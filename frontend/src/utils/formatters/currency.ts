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

export function parseCurrencyToCents(value: string | null): number {
  if (!value) return 0;

  const filtered = value.replace(/\D/g, "");
  const digits = Number.parseInt(filtered, 10);

  if (Number.isNaN(digits) || !Number.isInteger(digits)) return 0;

  return digits;
}
