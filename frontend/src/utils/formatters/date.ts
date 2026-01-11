export function formatDate(
  value?: string,
  locale?: Intl.LocalesArgument,
  timeZone?: string
): string {
  if (!value) return "—";
  if (!locale) locale = "pt-BR";
  if (!timeZone) timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return new Date(value).toLocaleString(locale, {
    timeZone,
  });
}
