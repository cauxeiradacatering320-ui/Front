
export function formatPriceMask(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function stripPriceMask(formatted: string): string {
  return formatted.replace(/\D/g, '');
}

export function mascaraTelefone(valor: string | number) {
  if (!valor) return "";

  // transforma em string
  valor = String(valor);

  // remove tudo que não for número
  valor = valor.replace(/\D/g, "");

  // limita
  valor = valor.slice(0, 15);

  // ANGOLA
  // Ex: 244926608579
  if (valor.startsWith("244")) {
    return valor
      .replace(/^(\d{3})(\d)/, "$1 $2")
      .replace(/(\d{3})(\d)/, "$1 $2")
      .replace(/(\d{3})(\d{1,3})$/, "$1 $2");
  }

  // BRASIL
  // Ex: 558388823313
  if (valor.startsWith("55")) {
    return valor
      .replace(/^(\d{2})(\d{2})(\d)/, "$1 $2 $3")
      .replace(/(\d{4,5})(\d{4})$/, "$1-$2");
  }

  // fallback genérico
  return valor;
}