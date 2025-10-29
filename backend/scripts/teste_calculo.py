"""
Teste do cálculo de comissão correto
"""
from config.settings import COMISSAO_PERCENTAGEM, IVA_TAXA

def testar_calculo_comissao():
    """Testar se o cálculo está correto"""
    print("🧮 TESTE DO CÁLCULO DE COMISSÃO")
    print("=" * 50)
    
    # Valores de teste
    valor_com_iva = 1000.00
    taxa_iva = IVA_TAXA  # 0.23 (23%)
    percentagem_comissao = COMISSAO_PERCENTAGEM  # 0.05 (5%)
    
    print(f"📊 Dados de entrada:")
    print(f"   Valor com IVA: {valor_com_iva:.2f}€")
    print(f"   Taxa IVA: {taxa_iva} ({taxa_iva*100:.0f}%)")
    print(f"   Comissão: {percentagem_comissao} ({percentagem_comissao*100:.0f}%)")
    
    # Cálculo 1: Valor sem IVA
    valor_sem_iva = valor_com_iva / (1 + taxa_iva)
    print(f"\n🔢 Cálculo passo a passo:")
    print(f"   1. Valor sem IVA = {valor_com_iva:.2f}€ ÷ (1 + {taxa_iva}) = {valor_sem_iva:.2f}€")
    
    # Cálculo 2: Comissão
    comissao = valor_sem_iva * percentagem_comissao
    print(f"   2. Comissão = {valor_sem_iva:.2f}€ × {percentagem_comissao} = {comissao:.2f}€")
    
    # Verificação manual
    print(f"\n✅ Verificação manual:")
    print(f"   1000,00€ ÷ 1,23 = {1000/1.23:.2f}€")
    print(f"   {1000/1.23:.2f}€ × 5% = {(1000/1.23)*0.05:.2f}€")
    
    # Verificar se está correto
    valor_esperado_sem_iva = 813.01  # 1000 / 1.23
    comissao_esperada = 40.65  # 813.01 * 0.05
    
    print(f"\n🎯 Valores esperados:")
    print(f"   Valor sem IVA esperado: {valor_esperado_sem_iva:.2f}€")
    print(f"   Comissão esperada: {comissao_esperada:.2f}€")
    
    print(f"\n🔍 Comparação:")
    print(f"   Valor sem IVA calculado: {valor_sem_iva:.2f}€ {'✅' if abs(valor_sem_iva - valor_esperado_sem_iva) < 0.1 else '❌'}")
    print(f"   Comissão calculada: {comissao:.2f}€ {'✅' if abs(comissao - comissao_esperada) < 0.1 else '❌'}")

if __name__ == "__main__":
    testar_calculo_comissao()