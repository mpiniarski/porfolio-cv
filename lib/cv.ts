import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import yaml from "yaml";

import type { CvData, PortfolioData } from "./resumeData";
import { loadCvDataFromFile } from "./cv/load";
import { deepMerge } from "./deepMerge";
import { CvDataNotFoundError } from "./cv/errors";
export const CV_VARIANTS = ["fe", "fs", "se"] as const;
export type CvVariant = (typeof CV_VARIANTS)[number];
export { isCvDataNotFoundError } from "./cv/errors";
export { loadCvDataFromFile };

type CvResult = { cv: CvData["cv"]; derived: CvDerived };

const getPortfolioData = cache((): PortfolioData => {
  return yaml.parse(
    fs.readFileSync(path.resolve(process.cwd(), "data", "portfolio.yml"), "utf8"),
  ) as PortfolioData;
});

export type CvDerived = {
  meta: {
    title: string;
    description?: string;
  };
  yearsOfExperience: number | null;
  topEducationLabel: { top: string; bottom: string } | null;
  workedWith: Array<{ name: string; logo: string; shortName?: string }>;
};

export function getCvData(
  options?: { variant?: unknown },
): CvResult {
  const requested = options?.variant;
  const variant: CvVariant = CV_VARIANTS.includes(requested as CvVariant)
    ? (requested as CvVariant)
    : "fe";
  return getCvDataByVariant(variant);
}

const getCvDataByVariant = cache((variant: CvVariant): CvResult => {
  try {
    const filePath = path.resolve(process.cwd(), "data", `cv-${variant}.yml`);
    const portfolio = getPortfolioData();
    const data = loadCvDataFromFile(filePath);
    // TODO: Return separated `cv` and `portfolio` from this API and migrate consumers incrementally.
    const cv = mergeCvAndPortfolio(data.cv, portfolio);
    const derived = deriveCv(cv);
    return { cv, derived };
  } catch (error) {
    if ((error as NodeJS.ErrnoException)?.code === "ENOENT") {
      throw new CvDataNotFoundError("CV or portfolio data file not found");
    }
    throw error;
  }
});

export function mergeCvAndPortfolio(cv: CvData["cv"], portfolio: PortfolioData): CvData["cv"] {
  return deepMerge(cv, portfolio);
}

function parseYear(value: string | undefined): number | null {
  if (!value) return null;
  const y = Number(String(value).slice(0, 4));
  return Number.isFinite(y) ? y : null;
}

function getYearsOfExperience(cv: CvData["cv"]): number | null {
  const exp = cv.experience ?? [];
  const years = exp
    .map((e) => parseYear(e.start_date))
    .filter((y): y is number => y != null)
    .sort((a, b) => a - b);
  if (years.length === 0) return null;
  return new Date().getFullYear() - years[0];
}

function getTopEducationLabel(cv: CvData["cv"]): { top: string; bottom: string } | null {
  const edu = cv.education ?? [];
  const msc = edu.find((e) => /^MSc\b/i.test(e.degree));
  if (msc) return { top: "M.Sc", bottom: msc.area || "Computer Science" };
  const bsc = edu.find((e) => /^BSc\b/i.test(e.degree));
  if (bsc) return { top: "B.Sc", bottom: bsc.area || "Computer Science" };
  return null;
}

function getWorkedWithCompanies(cv: CvData["cv"]): string[] {
  const exp = cv.experience ?? [];
  const names = new Set<string>();
  for (const e of exp) {
    if (e.company) names.add(e.company);
    for (const w of e.worked_with ?? []) names.add(w);
  }
  return Array.from(names);
}

// TODO: Extract derive helpers into a dedicated module.
export function deriveCv(cv: CvData["cv"]): CvDerived {
  const title = `${cv.name} – ${cv.headline}`;
  const description = cv.summary ?? undefined;

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

