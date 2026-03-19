import fs from "node:fs";
import path from "node:path";
import yaml from "yaml";

import type { CvData } from "./resumeData";

export type CvDerived = {
  meta: {
    title: string;
    description?: string;
  };
  yearsOfExperience: number | null;
  topEducationLabel: { top: string; bottom: string } | null;
  workedWith: Array<{ name: string; logo: string; shortName?: string }>;
};

function findDataYml(): string {
  const cwd = process.cwd();
  const fromLib = path.resolve(__dirname, "..", "..", "data.yml");
  const candidates = [path.join(cwd, "data.yml"), path.join(cwd, "..", "data.yml"), fromLib];
  for (const filePath of candidates) {
    if (fs.existsSync(filePath)) return filePath;
  }
  throw new Error(`data.yml not found. Tried: ${candidates.join(", ")}`);
}

function parseYear(value: string | undefined): number | null {
  if (!value) return null;
  const y = Number(String(value).slice(0, 4));
  return Number.isFinite(y) ? y : null;
}

function getYearsOfExperience(cv: CvData["cv"]): number | null {
  const exp = cv.sections?.experience ?? [];
  const years = exp
    .map((e) => parseYear(e.start_date))
    .filter((y): y is number => y != null)
    .sort((a, b) => a - b);
  if (years.length === 0) return null;
  return new Date().getFullYear() - years[0];
}

function getTopEducationLabel(cv: CvData["cv"]): { top: string; bottom: string } | null {
  const edu = cv.sections?.education ?? [];
  const msc = edu.find((e) => /^MSc\b/i.test(e.degree));
  if (msc) return { top: "M.Sc", bottom: msc.area || "Computer Science" };
  const bsc = edu.find((e) => /^BSc\b/i.test(e.degree));
  if (bsc) return { top: "B.Sc", bottom: bsc.area || "Computer Science" };
  return null;
}

function getWorkedWithCompanies(cv: CvData["cv"]): string[] {
  const exp = cv.sections?.experience ?? [];
  const names = new Set<string>();
  for (const e of exp) {
    if (e.company) names.add(e.company);
    for (const w of e.worked_with ?? []) names.add(w);
  }
  return Array.from(names);
}

export function deriveCv(cv: CvData["cv"]): CvDerived {
  const title = `${cv.name} – ${cv.headline}`;
  const description = cv.summary ?? cv.sections?.[""]?.[0] ?? undefined;

  const yearsOfExperience = getYearsOfExperience(cv);
  const topEducationLabel = getTopEducationLabel(cv);

  const workedWithNames = (cv.worked_with?.companies?.length ? cv.worked_with.companies : getWorkedWithCompanies(cv))
    .filter((name) => cv.company_logos?.[name])
    .slice(0, 9);
  const workedWith = workedWithNames.map((name) => ({
    name,
    logo: cv.company_logos?.[name] ?? "",
    shortName: cv.company_short_names?.[name],
  }));

  return {
    meta: { title, description },
    yearsOfExperience,
    topEducationLabel,
    workedWith,
  };
}

let memo: { data: CvData; derived: CvDerived; mtimeMs: number } | null = null;

export function getCvData(): { cv: CvData["cv"]; derived: CvDerived } {
  const filePath = findDataYml();
  const mtimeMs = fs.statSync(filePath).mtimeMs;
  if (memo && memo.mtimeMs === mtimeMs) return { cv: memo.data.cv, derived: memo.derived };
  const file = fs.readFileSync(filePath, "utf8");
  const data = yaml.parse(file) as CvData;
  const derived = deriveCv(data.cv);
  memo = { data, derived, mtimeMs };
  return { cv: data.cv, derived };
}

