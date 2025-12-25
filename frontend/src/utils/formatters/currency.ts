export function formatCurrency(
  value: number,
  locale = "pt-BR",
  currency = "BRL"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}
