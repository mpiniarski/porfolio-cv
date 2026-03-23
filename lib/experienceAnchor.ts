/**
 * Stable fragment id for /experience deep links. Must match `case_studies.items[].experience_anchor` (and experience UI) in data.yml.
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
