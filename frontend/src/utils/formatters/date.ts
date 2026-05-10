export function formatDate(
  value?: number | null,
  locale?: Intl.LocalesArgument,
  timeZone?: string,
  options?: Intl.DateTimeFormatOptions
): string {
  if (value === null || value === undefined) return "—";
  if (!locale) locale = "pt-BR";

  const resolvedTimeZone =
    options?.timeZone ||
    timeZone ||
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  const date =
    typeof value === "number" ? new Date(value * 1000) : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Data inválida";
  }

  return date.toLocaleString(locale, {
    timeZone: resolvedTimeZone,
    ...options,
  });
}
