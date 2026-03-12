import fs from "node:fs";
import path from "node:path";
import yaml from "yaml";

export type CvSectionKey = "" | "skills" | "experience" | "education" | "languages";

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
  start_date: string;
  end_date?: string;
  location?: string;
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

export interface CvLanguageItem {
  bullet: string;
}

export interface CvSections {
  "": string[];
  skills: CvSkillItem[];
  experience: CvExperienceItem[];
  education: CvEducationItem[];
  languages: CvLanguageItem[];
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
}

export interface CvData {
  cv: {
    name: string;
    headline: string;
    location: string;
    email: string;
    phone: string;
    sections: CvSections;
  };
  social_networks?: CvSocialNetwork[];
  projects?: CvProject[];
  photo?: string | null;
}

export function getResumeData(): CvData {
  const rootDir = path.resolve(process.cwd(), "..");
  const filePath = path.join(rootDir, "data.yml");
  const file = fs.readFileSync(filePath, "utf8");
  const parsed = yaml.parse(file) as CvData;
  return parsed;
}

