import fs from "node:fs";
import path from "node:path";
import yaml from "yaml";

export type CvSectionKey =
  | ""
  | "skills"
  | "experience"
  | "education"
  | "languages"
  | "typically_help_with";

export interface CvIntroSection {
  "": string[];
}

export interface CvSkillItem {
  label: string;
  details: string;
}

export interface CvExperienceProject {
  name: string;
  highlights: string[];
}

export interface CvExperienceItem {
  company: string;
  position: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  /** Client or partner company names to show in "Worked with" (e.g. consulting clients). */
  worked_with?: string[];
  highlights?: string[];
  projects?: CvExperienceProject[];
}

export interface CvEducationItem {
  institution: string;
  degree: string;
  area: string;
  start_date: string;
  end_date: string;
  location: string;
}

export interface GroupedEducation {
  institution: string;
  location: string;
  degrees: { degree: string; area: string; start_date: string; end_date: string }[];
}

export function groupEducationByInstitution(education: CvEducationItem[]): GroupedEducation[] {
  const byKey = new Map<string, GroupedEducation>();
  for (const edu of education) {
    const key = `${edu.institution}|${edu.location}`;
    const existing = byKey.get(key);
    const entry = {
      degree: edu.degree,
      area: edu.area,
      start_date: edu.start_date,
      end_date: edu.end_date,
    };
    if (existing) {
      existing.degrees.push(entry);
    } else {
      byKey.set(key, { institution: edu.institution, location: edu.location, degrees: [entry] });
    }
  }
  return Array.from(byKey.values());
}

export interface CvLanguageItem {
  bullet: string;
}

export interface CvSections {
  "": string[];
  skills: CvSkillItem[];
  experience: CvExperienceItem[];
  education: CvEducationItem[];
  languages: CvLanguageItem[];
  typically_help_with?: string[];
}

export interface CvSocialNetwork {
  network: string;
  username: string;
}

export interface CvProject {
  name: string;
  summary: string;
  technologies?: string;
  link?: string;
  app?: string;
  repo?: string;
  image?: string;
}

export interface CvData {
  cv: {
    name: string;
    headline: string;
    location: string;
    email: string;
    phone: string;
    sections: CvSections;
    social_networks?: CvSocialNetwork[];
    projects?: CvProject[];
    photo?: string | null;
  };
}

function findDataYml(): string {
  const cwd = process.cwd();
  const fromLib = path.resolve(__dirname, "..", "..", "data.yml");
  const candidates = [
    path.join(cwd, "data.yml"),
    path.join(cwd, "..", "data.yml"),
    fromLib,
  ];
  for (const filePath of candidates) {
    if (fs.existsSync(filePath)) return filePath;
  }
  throw new Error(`data.yml not found. Tried: ${candidates.join(", ")}`);
}

/** Strip https:// and optional www. for compact display; href stays full URL for ATS and links. */
export function shortUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/i, "").trim();
}

export function getResumeData(): CvData {
  const filePath = findDataYml();
  const file = fs.readFileSync(filePath, "utf8");
  const parsed = yaml.parse(file) as CvData;
  return parsed;
}
