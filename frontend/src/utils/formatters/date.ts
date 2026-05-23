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

  const date = new Date(value * 1000);

  if (Number.isNaN(date.getTime())) {
    return "Data inválida";
  }

  return date.toLocaleString(locale, {
    timeZone: resolvedTimeZone,
    ...options,
  });
}

export function formatDateTime(value: number): [string | null, string | null] {
  const date = new Date(value * 1000);

  if (Number.isNaN(date.getTime())) {
    return [null, null];
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const datePart = `${year}-${month}-${day}`;
  const timePart = `${hours}:${minutes}`;

  return [datePart, timePart];
}
