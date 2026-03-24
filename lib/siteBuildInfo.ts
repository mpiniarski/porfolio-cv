function formatIsoDate(iso: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function getSiteBuildInfo() {
  const version = process.env.NEXT_PUBLIC_SITE_VERSION ?? "";
  const commit = process.env.NEXT_PUBLIC_GIT_COMMIT ?? "";
  const commitMessage = process.env.NEXT_PUBLIC_GIT_COMMIT_MESSAGE ?? "";
  const commitDateIso = process.env.NEXT_PUBLIC_GIT_COMMIT_DATE ?? "";
  const builtAtIso = process.env.NEXT_PUBLIC_BUILD_TIME_ISO ?? "";

  return {
    version: version || null,
    commit: commit || null,
    commitMessage: commitMessage || null,
    commitDateLabel: formatIsoDate(commitDateIso),
    builtAtLabel: formatIsoDate(builtAtIso),
    builtAtIso: builtAtIso || null,
  };
}
