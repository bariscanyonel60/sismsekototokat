const DESCRIPTION_MAX = 158;

/** Arama sonucunda kesilmemesi için açıklamayı kelime sınırında ~158 karaktere indirir. */
export function fitDescription(text: string, max = DESCRIPTION_MAX): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:–-]$/, "")}…`;
}
