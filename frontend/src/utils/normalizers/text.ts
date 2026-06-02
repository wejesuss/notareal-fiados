/**
 * Normalize a given {@link text} using `NFD` form,
 * removing accent characters from the string
 * @param text The text to be normalized
 * @returns The normalized text (lowercase form)
 */
export function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
