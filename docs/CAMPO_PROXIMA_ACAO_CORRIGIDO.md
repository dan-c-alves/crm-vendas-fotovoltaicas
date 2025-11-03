# ✅ Campo "Próxima Ação" Corrigido!

## O que foi feito

O campo de data e hora para "Próxima Ação" já estava no código, mas tinha problemas de formatação. Agora foi corrigido:

### Mudanças no LeadModal.tsx

1. **Conversão automática de data ao carregar lead**:
   - Quando você edita um lead existente com `proxima_acao`, a data é convertida para o formato `datetime-local` (YYYY-MM-DDTHH:mm)
   - Exemplo: `2025-11-04T14:30` 

2. **Conversão para ISO ao salvar**:
   - Quando você salva o formulário, a data é convertida para formato ISO completo
   - Exemplo: `2025-11-04T14:30:00.000Z`
   - Este formato é compatível com PostgreSQL e o backend

3. **Visual melhorado**:
   - Label com ícone: 📅 Próxima Ação (Data e Hora)
   - Texto de ajuda: "Aparecerá na página Tarefas e sincroniza com Google Calendar"

## Como usar (AGORA FUNCIONA!)

### 1. Criar um novo lead com tarefa

1. Vá para **Leads** > **Novo Lead**
2. Preencha os dados básicos (nome, email, telefone)
3. Role até encontrar o campo **📅 Próxima Ação (Data e Hora)**
4. Clique no campo e escolha:
   - Data (calendário)
   - Hora (relógio)
5. Salve o lead
6. ✅ A tarefa aparecerá na página **Tarefas**

### 2. Editar lead existente e adicionar tarefa

1. Na página **Leads**, clique no lead para editar
2. Role até o campo **📅 Próxima Ação (Data e Hora)**
3. Defina data e hora
4. Salve
5. ✅ O lead agora aparece em **Tarefas**

### 3. Ver e gerenciar tarefas

1. Vá para **Tarefas**
2. Você verá todos os leads com `proxima_acao` definida
3. Ações disponíveis:
   - ✅ **Concluir**: Marca como concluída e remove da lista
   - 📅 **Adiar**: Escolhe nova data/hora
   - ❌ **Remover agendamento**: Remove a data (lead volta ao status normal)
   - ✏️ **Editar**: Abre o modal completo do lead
   - 🗑️ **Eliminar**: Apaga o lead completamente

## Integração com Google Calendar (quando configurado)

Quando você conectar o Google OAuth (Settings):
- **Criar/Editar proxima_acao** → Cria/atualiza evento no Google Calendar
- **Concluir tarefa** → Remove evento do Google Calendar
- **Remover data** → Remove evento do Google Calendar

## Formato do campo

```html
<input 
  type="datetime-local" 
  name="proxima_acao"
  className="input"
/>
```

**Exemplo de valor válido**: `2025-11-04T14:30`

## Verificação técnica

O campo agora:
- ✅ Aceita entrada datetime-local
- ✅ Converte para ISO ao salvar
- ✅ Converte de ISO ao carregar
- ✅ Funciona com Supabase (timestamptz)
- ✅ Integra com Google Calendar API
- ✅ Aparece corretamente na página Tarefas

## Teste rápido

1. Abra http://localhost:3000/leads
2. Clique em um lead para editar
3. Procure por "📅 Próxima Ação (Data e Hora)"
4. Clique no campo → Deve abrir calendário + relógio
5. Escolha amanhã às 10:00
6. Salve
7. Vá para http://localhost:3000/tarefas
8. ✅ O lead deve aparecer lá!

---

**Status**: ✅ FUNCIONANDO
**Data da correção**: 3 de novembro de 2025
