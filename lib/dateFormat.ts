/**
 * Centralized date formatting for resume and portfolio.
 * All date strings from data.yml use "YYYY-MM" or "YYYY" format.
 */

const RANGE_SEP = " – ";

export function formatMonthYear(value: string | undefined): string {
  if (!value) return "?";
  const [y, m] = String(value).split("-");
  const year = parseInt(y ?? "", 10);
  if (!Number.isFinite(year)) return "?";
  if (!m) return String(year);
  const month = Math.max(1, Math.min(12, parseInt(m, 10))) - 1;
  return new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function formatDateRange(start?: string, end?: string): string {
  const s = formatMonthYear(start);
  const e = end ? formatMonthYear(end) : "Present";
  return `${s}${RANGE_SEP}${e}`;
}

export function formatYearRange(start?: string, end?: string): string {
  if (!start) return "?";
  const s = String(start).slice(0, 4);
  if (!end || start === end) return s;
  const e = String(end).slice(0, 4);
  return `${s}${RANGE_SEP}${e}`;
}
