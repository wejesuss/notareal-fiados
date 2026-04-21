export function formatDate(
  value?: string,
  locale?: Intl.LocalesArgument,
  timeZone?: string,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!value) return "—";
  if (!locale) locale = "pt-BR";
  if (!timeZone) timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (options) {
    timeZone = options.timeZone || timeZone;
  }

  return new Date(value).toLocaleString(locale, {
    timeZone,
    ...options,
  });
}
