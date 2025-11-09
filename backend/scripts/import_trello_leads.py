#!/usr/bin/env python3
"""
Importador de leads a partir de um JSON exportado do Trello.

Como funciona:
 - Lê um ficheiro JSON de um quadro Trello (Export JSON do board)
 - Mapeia as listas do Trello para os estados do CRM
 - Extrai nome, email, telefone e notas a partir do cartão
 - Cria leads no CRM (FastAPI/SQLAlchemy) com origem "Trello"

Uso (PowerShell):
  cd backend; venv\Scripts\activate; python scripts\import_trello_leads.py caminho\para\trello.json [--dry-run] [--skip-duplicates]

Notas:
 - Por omissão, ignora cartões fechados/arquivados.
 - Dedupe por email (se existir); se não houver email, usa (nome+telefone).
 - Se a lista se chamar "Vendido" no Trello, mapeamos para "Ganho" no CRM.
"""

import json
import re
import sys
import os
from argparse import ArgumentParser
from datetime import datetime
from typing import Dict, Any, Optional, Tuple
import unicodedata

# Tornar módulos do backend importáveis
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.database import SessionLocal  # type: ignore
from models.lead import Lead  # type: ignore


# Mapeamento real das listas do Trello para os estados do CRM
# Observação: Trello pode ter lista "Vendido" ou "Ganho"; ambas viram "Vendido" para alinhar com enum existente.
STATUS_MAP = {
    "entrada de lead": "Entrada de Lead",
    "em análise": "Em Análise",
    "proposta enviada": "Proposta Enviada",
    "em negociação": "Em Negociação",
    "vendido": "Vendido",
    "ganho": "Vendido",
    "perdido": "Perdido",
    "cancelado": "Cancelado",
}

EMAIL_REGEX = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
# Telefones nacionais (flexível): aceita +, (), espaços, e 8-15 dígitos no total
PHONE_REGEX = re.compile(r"(?:(?:\+\d{1,3}[\s-]?)?(?:\(?\d{2,4}\)?[\s-]?)?\d[\d\s-]{6,}\d)")
# Valores com ou sem símbolo €, com palavras-chave comuns
VALUE_REGEXES = [
    # Apenas quando explicitamente indicado como valor/preço
    re.compile(r"(?i)(valor|preço|preco)[^0-9]*(\d{1,3}(?:[ .]\d{3})*(?:[,.]\d{2})?|\d+(?:[,.]\d{2})?)"),
    # Ou quando acompanhado de símbolo/moeda
    re.compile(r"(?i)(€|eur|euros)\s*(\d{1,3}(?:[ .]\d{3})*(?:[,.]\d{2})?|\d+(?:[,.]\d{2})?)"),
    re.compile(r"(?i)(\d{1,3}(?:[ .]\d{3})+(?:[,\.]\d{2})?)\s*(€|eur|euros)")
]


def _strip_accents(text: str) -> str:
    return ''.join(c for c in unicodedata.normalize('NFKD', text) if not unicodedata.combining(c))


def normalize_status(list_name: str) -> str:
    raw = list_name or ""
    key = _strip_accents(raw).strip().lower()
    return STATUS_MAP.get(key, "Entrada de Lead")


def parse_email_and_phone(text: str) -> Tuple[Optional[str], Optional[str]]:
    if not text:
        return None, None
    email_match = EMAIL_REGEX.search(text)
    email = email_match.group(0) if email_match else None

    phone_match = PHONE_REGEX.search(text)
    phone = phone_match.group(0).strip() if phone_match else None
    if phone:
        # normalizar telefones removendo duplos espaços
        phone = re.sub(r"\s+", " ", phone)
    return email, phone


def parse_value(text: str) -> Optional[float]:
    if not text:
        return None
    # Procurar pelos padrões
    for rx in VALUE_REGEXES:
        m = rx.search(text)
        if m:
            value_str = m.group(2) if m.lastindex and m.lastindex >= 2 else m.group(1)
            if not value_str:
                continue
            # Normalizar: remover espaços e pontos de milhar, trocar vírgula decimal por ponto
            cleaned = value_str.strip()
            # remover separadores de milhar (ponto e espaços), mas manter vírgula/ponto decimal
            cleaned = cleaned.replace(' ', '')
            # se houver tanto ponto como vírgula, assumir que vírgula é decimal em pt-PT
            if '.' in cleaned and ',' in cleaned:
                cleaned = cleaned.replace('.', '').replace(',', '.')
            else:
                # se só houver vírgula, tratar como decimal
                if ',' in cleaned and '.' not in cleaned:
                    cleaned = cleaned.replace(',', '.')
                else:
                    # só dígitos e possivelmente ponto
                    pass
            try:
                return float(cleaned)
            except Exception:
                continue
    return None


def extract_fields_from_card(card: Dict[str, Any], list_name: str) -> Dict[str, Any]:
    """Extrai campos do cartão Trello para o modelo Lead."""
    nome = card.get("name") or "Sem Nome"
    desc = card.get("desc") or ""
    status = normalize_status(list_name)
    short_url = card.get("shortUrl") or card.get("url")

    # Procurar email/telefone no nome e na descrição
    combined = (nome or '') + "\n" + (desc or '')
    email, phone = parse_email_and_phone(combined)
    valor = parse_value(combined)

    # Tags vindas das labels
    labels = card.get("labels") or []
    tag_names = [lbl.get("name") for lbl in labels if lbl.get("name")]
    tags = ", ".join(tag_names) if tag_names else None

    # Data de criação/atividade (opcional)
    data_entrada = None
    card_date = card.get("dateLastActivity") or card.get("start")
    if card_date:
        try:
            # Trello usa ISO8601; convertendo para naive UTC (como o projeto armazena)
            dt = datetime.fromisoformat(card_date.replace("Z", "+00:00")).replace(tzinfo=None)
            data_entrada = dt
        except Exception:
            pass

    notas = desc.strip()
    if short_url:
        if notas:
            notas += f"\n\nTrello: {short_url}"
        else:
            notas = f"Trello: {short_url}"

    return {
        "nome_lead": nome,
        "email": email,
        "telefone": phone,
        "status": status,
        "notas_conversa": notas or None,
        "origem": "Outros",  # map Trello origem para enum existente
        "tags": tags,
        "data_entrada": data_entrada,
        "ativo": True,
        "valor_venda_com_iva": valor,
    }


def load_trello_json(path: str) -> Dict[str, Any]:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def build_list_map(data: Dict[str, Any]) -> Dict[str, str]:
    lists = data.get("lists", [])
    return {lst["id"]: lst.get("name", "") for lst in lists}


def is_duplicate(db, email: Optional[str], nome: Optional[str], telefone: Optional[str]) -> bool:
    q = db.query(Lead)
    if email:
        return q.filter(Lead.email == email, Lead.ativo == True).first() is not None
    # fallback: nome + telefone
    if nome and telefone:
        return q.filter(Lead.nome_lead == nome, Lead.telefone == telefone, Lead.ativo == True).first() is not None
    if nome:
        return q.filter(Lead.nome_lead == nome, Lead.ativo == True).first() is not None
    return False


def import_from_trello(path: str, dry_run: bool = False, skip_duplicates: bool = True):
    print(f"📥 Lendo JSON do Trello: {path}")
    data = load_trello_json(path)
    list_map = build_list_map(data)
    cards = data.get("cards", [])

    print(f"🗂️  Listas encontradas: {len(list_map)} | Cartões: {len(cards)}")

    db = SessionLocal()
    criados = 0
    ignorados = 0
    duplicados = 0
    # Guardar duplicados vistos nesta execução também (para evitar duplicação antes do commit)
    seen_emails = set()
    seen_name_phone = set()

    try:
        for card in cards:
            if card.get("closed"):
                continue  # ignorar arquivados

            list_id = card.get("idList")
            list_name = list_map.get(list_id, "Entrada de Lead")
            fields = extract_fields_from_card(card, list_name)

            if skip_duplicates:
                key_email = (fields.get("email") or '').strip().lower() or None
                key_np = None
                if fields.get("nome_lead") and fields.get("telefone"):
                    key_np = (fields["nome_lead"].strip().lower(), fields["telefone"].strip())

                # Dedupe por email ou por (nome, telefone) nesta execução
                if key_email and key_email in seen_emails:
                    duplicados += 1
                    continue
                if key_np and key_np in seen_name_phone:
                    duplicados += 1
                    continue
                # Dedupe contra DB também
                if is_duplicate(db, fields.get("email"), fields.get("nome_lead"), fields.get("telefone")):
                    duplicados += 1
                    continue

            if dry_run:
                ignorados += 1
                print(f"[DRY-RUN] Importaria: {fields['nome_lead']} | {fields.get('email')} | {fields.get('telefone')} | {fields['status']} | Valor: {fields.get('valor_venda_com_iva')}")
                continue

            # Preencher placeholders se estiverem ausentes
            email_value = fields.get("email") or "teste@test.com"
            telefone_value = fields.get("telefone") or "000000000"

            notas = fields.get("notas_conversa")
            if fields.get("telefone") is None:
                append = "(Telefone placeholder gerado)"
                notas = (notas + "\n" + append) if notas else append
            if fields.get("email") is None:
                append = "(Email placeholder gerado)"
                notas = (notas + "\n" + append) if notas else append

            lead = Lead(
                nome_lead=fields["nome_lead"],
                email=email_value,
                telefone=telefone_value,
                status=fields["status"],  # usar status mapeado real
                notas_conversa=notas,
                origem=fields.get("origem"),
                tags=fields.get("tags"),
                ativo=True,
            )
            # data_entrada se disponível
            if fields.get("data_entrada"):
                lead.data_entrada = fields["data_entrada"]
            # valor se detectado
            if fields.get("valor_venda_com_iva") is not None:
                lead.valor_venda_com_iva = fields["valor_venda_com_iva"]

            db.add(lead)
            criados += 1

            # Marcar chaves vistas nesta execução
            if skip_duplicates:
                if key_email:
                    seen_emails.add(key_email)
                if key_np:
                    seen_name_phone.add(key_np)

            # Commit em lotes para performance
            if criados % 200 == 0:
                db.commit()

        db.commit()
        print(f"✅ Importação concluída. Criados: {criados} | Duplicados ignorados: {duplicados} | Dry-run contados: {ignorados}")
    except Exception as e:
        db.rollback()
        print(f"❌ Erro durante importação: {e}")
        raise
    finally:
        db.close()


def main():
    parser = ArgumentParser(description="Importar leads a partir de um JSON do Trello")
    parser.add_argument("json_path", help="Caminho para o ficheiro JSON exportado do Trello")
    parser.add_argument("--dry-run", action="store_true", help="Não grava no DB, apenas mostra o que seria importado")
    parser.add_argument("--no-skip-duplicates", dest="skip_duplicates", action="store_false", help="Não ignorar duplicados")
    args = parser.parse_args()

    path = args.json_path
    if not os.path.exists(path):
        print(f"❌ Ficheiro não encontrado: {path}")
        sys.exit(1)

    import_from_trello(path, dry_run=args.dry_run, skip_duplicates=args.skip_duplicates)


if __name__ == "__main__":
    main()
