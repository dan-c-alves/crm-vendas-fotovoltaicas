/**
 * Utilitários de formatação
 */

/**
 * Formatar valores em euros no formato português
 * @param value - Valor numérico
 * @returns String formatada (ex: "1.104,00€")
 */
export const formatCurrency = (value: number | undefined | null): string => {
  if (!value && value !== 0) return '0,00€';
  
  // Usar formato português: ponto para milhares, vírgula para decimais
  const formatted = new Intl.NumberFormat('pt-PT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
  
  return formatted + '€';
};

/**
 * Formatar data no formato português
 * @param date - Data ISO string ou Date object
 * @returns String formatada (ex: "28/10/2025")
 */
export const formatDate = (date: string | Date | undefined | null): string => {
  if (!date) return '-';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('pt-PT');
};

/**
 * Formatar hora no formato português
 * @param date - Data ISO string ou Date object
 * @returns String formatada (ex: "14:30")
 */
export const formatTime = (date: string | Date | undefined | null): string => {
  if (!date) return '-';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleTimeString('pt-PT', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

/**
 * Formatar data e hora no formato português
 * @param date - Data ISO string ou Date object
 * @returns Objeto com data e hora formatadas
 */
export const formatDateTime = (date: string | Date | undefined | null) => {
  if (!date) return { date: '-', time: '-' };
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return {
    date: formatDate(dateObj),
    time: formatTime(dateObj)
  };
};

/**
 * Calcular comissão (sempre 5% do valor sem IVA)
 * @param valorComIva - Valor com IVA
 * @param taxaIva - Taxa de IVA (padrão 23%)
 * @returns Valor da comissão
 */
export const calcularComissao = (valorComIva: number, taxaIva: number = 23): number => {
  if (!valorComIva || valorComIva <= 0) return 0;
  
  const valorSemIva = valorComIva / (1 + taxaIva / 100);
  return valorSemIva * 0.05; // 5% de comissão
};

/**
 * Calcular valor sem IVA
 * @param valorComIva - Valor com IVA
 * @param taxaIva - Taxa de IVA (padrão 23%)
 * @returns Valor sem IVA
 */
export const calcularValorSemIva = (valorComIva: number, taxaIva: number = 23): number => {
  if (!valorComIva || valorComIva <= 0) return 0;
  
  return valorComIva / (1 + taxaIva / 100);
};