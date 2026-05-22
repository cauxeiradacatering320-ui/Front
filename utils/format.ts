export function formatKz(precoCentavos: number): string {
  return `${(precoCentavos / 100).toLocaleString('pt-PT', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} KZ`;
}

export function formatPriceMask(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function stripPriceMask(formatted: string): string {
  return formatted.replace(/\D/g, '');
}
