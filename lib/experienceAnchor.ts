/**
 * Stable fragment id for /experience deep links. Must match `selected_work.highlights[].experience_anchor` in data.yml.
 */
export function experienceEntryAnchorId(projectName: string | undefined, company: string): string {
  const raw = (projectName ?? company).trim();
  return raw
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
