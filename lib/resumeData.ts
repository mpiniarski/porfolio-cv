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
  start_date?: string;
  end_date?: string;
  highlights: string[];
}

export interface CvExperienceItem {
  company: string;
  position: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  /** Short company description (e.g. consulting firm, product company). */
  company_description?: string;
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
  thesis?: string;
}

export interface GroupedEducationDegree {
  degree: string;
  area: string;
  start_date: string;
  end_date: string;
  thesis?: string;
  /** When set, this degree is from a different institution (e.g. Student Exchange). */
  institution?: string;
  location?: string;
}

export interface GroupedEducation {
  institution: string;
  location: string;
  degrees: GroupedEducationDegree[];
}

export function groupEducationByInstitution(
  education: CvEducationItem[],
): GroupedEducation[] {
  const byKey = new Map<string, GroupedEducation>();
  for (const edu of education) {
    const key = `${edu.institution}|${edu.location}`;
    const existing = byKey.get(key);
    const entry = {
      degree: edu.degree,
      area: edu.area,
      start_date: edu.start_date,
      end_date: edu.end_date,
      thesis: edu.thesis,
    };
    if (existing) {
      existing.degrees.push(entry);
    } else {
      byKey.set(key, {
        institution: edu.institution,
        location: edu.location,
        degrees: [entry],
      });
    }
  }
  return Array.from(byKey.values());
}

function isStudentExchange(d: GroupedEducationDegree): boolean {
  return /^Student Exchange\b/i.test(d.degree);
}

function isAcademic(d: GroupedEducationDegree): boolean {
  return /^MSc\b/i.test(d.degree) || /^BSc\b/i.test(d.degree);
}

function getDiscipline(d: GroupedEducationDegree): string {
  return d.degree?.match(/ (?:in|-) (.+)$/)?.[1]?.trim().toLowerCase() ?? "";
}

/** Merges Student Exchange groups into academic blocks when they share the same discipline. */
export function mergeStudentExchangeIntoAcademic(
  groups: GroupedEducation[],
): GroupedEducation[] {
  const academic = groups.find((g) => g.degrees.some(isAcademic));
  const exchangeOnly = groups.filter(
    (g) =>
      g !== academic &&
      g.degrees.every(isStudentExchange) &&
      g.degrees.length > 0,
  );
  if (!academic || exchangeOnly.length === 0) return groups;

  const mainDiscipline = getDiscipline(
    academic.degrees.find(isAcademic) ?? academic.degrees[0],
  );
  const merged = [...groups];
  for (const ex of exchangeOnly) {
    const exDiscipline = getDiscipline(ex.degrees[0]);
    if (exDiscipline && exDiscipline === mainDiscipline) {
      for (const d of ex.degrees) {
        academic.degrees.push({
          ...d,
          institution: ex.institution,
          location: ex.location,
        });
      }
      const idx = merged.indexOf(ex);
      if (idx >= 0) merged.splice(idx, 1);
    }
  }
  return merged;
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
    portfolio?: string;
    email: string;
    phone: string;
    /** Short summary used for meta tags, previews, etc. */
    summary?: string;
    /** Hero intro sentence displayed on the homepage. */
    hero_intro?: string;
    /**
     * Optional 3-up stat strip shown in the homepage hero.
     * When omitted, the UI falls back to derived education/years/location.
     */
    hero_stats?: Array<{ top: string; bottom: string }>;
    /**
     * Optional configuration for the "Worked with" homepage section.
     * Allows matching curated content/order from external designs.
     */
    worked_with?: {
      /** Overrides the computed X+ years label in the title, e.g. "9". */
      years_label?: string;
      /** Explicit ordered list of company names to render (must exist in company_logos). */
      companies?: string[];
    };
    /** Footer role/tagline line. When omitted, falls back to headline. */
    footer_tagline?: string;
    open_for_opportunities?: boolean;
    open_for_opportunities_section?: {
      availability?: string;
      mode?: string;
      bullets: string[];
    };
    services?: { icon: string; title: string; description: string }[];
    tools?: { name: string; description: string; logo: string }[];
    /** Optional mapping used to render company logos in "Worked with". */
    company_logos?: Record<string, string>;
    /** Optional short labels for companies (e.g. "No Spoon" instead of full legal name). */
    company_short_names?: Record<string, string>;
    sections: CvSections;
    social_networks?: CvSocialNetwork[];
    projects?: CvProject[];
    photo?: string | null;
  };
}

/** Strip https:// and optional www. for compact display; href stays full URL for ATS and links. */
export function shortUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/i, "").trim();
}
