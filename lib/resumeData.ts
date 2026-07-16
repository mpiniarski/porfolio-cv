export interface CvSkillItem {
  label: string;
  details: string;
}

export interface CvExperienceProject {
  name: string;
  /** Role or title while on this engagement (e.g. Lead front-end developer). */
  role?: string;
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
  /**
   * Client or partner names (e.g. consulting accounts). On the resume, when set with `projects`,
   * each chunk of that list (including continuations on the next page) gets the same client-project
   * left rule. Also used on the marketing site / timeline.
   */
  worked_with?: string[];
  highlights?: string[];
  projects?: CvExperienceProject[];
  /**
   * Resume only: after this many projects (in current sort order), continue the rest on the next page
   * with the same role/company header. Omit for a single block.
   */
  resume_break_projects_after?: number;
}

/**
 * Variant-file override for one experience entry, matched by exact `company`.
 * Provided fields replace the base entry's; arrays (e.g. `highlights`) are replaced wholesale.
 */
export type CvExperienceOverride = Partial<CvExperienceItem> & { company: string };

export interface CvEducationItem {
  institution: string;
  degree: string;
  area: string;
  start_date: string;
  end_date: string;
  location: string;
  thesis?: string;
}

/** Newest end date first (for resume and marketing education lists). */
export function sortEducationByEndDateDesc(education: CvEducationItem[]): CvEducationItem[] {
  return [...education].sort((a, b) => (b.end_date ?? "").localeCompare(a.end_date ?? ""));
}

export interface CvLanguageItem {
  bullet: string;
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

/** Long-form “problem → work → impact” narratives; optional homepage / case studies section. */
export interface CvCaseStudy {
  /** Stable key for anchors or analytics. */
  id: string;
  title: string;
  /** Employer or client label shown in UI. */
  company: string;
  /** Exact key in `company_logos` when the display `company` label does not match a logo map entry. */
  logo_company?: string;
  /**
   * Optional `/experience#…` link — must match `experienceEntryAnchorId(project name, company)`.
   */
  experience_anchor?: string;
  /** One-line hook under the title. */
  blurb?: string;
  problem: string[];
  work: string[];
  impact: string[];
  /** Reflections, trade-offs, or lessons (optional). */
  learning?: string[];
}

export interface CvCoreTechnology {
  name: string;
  logo: string;
  /** Dark logo on light background (e.g. Next.js mark). */
  invert_logo?: boolean;
}

export interface PortfolioData {
  photo?: string | null;
  hero_stats?: Array<{ top: string; bottom: string }>;
  worked_with?: {
    years_label?: string;
    companies?: string[];
  };
  footer_tagline?: string;
  open_for_opportunities?: boolean;
  open_for_opportunities_section?: {
    availability?: string;
    mode?: string;
    bullets: string[];
  };
  services?: { icon: string; title: string; description: string }[];
  tools?: { name: string; description: string; logo: string }[];
  company_logos?: Record<string, string>;
  company_short_names?: Record<string, string>;
  typically_help_with?: string[];
  projects?: CvProject[];
  case_studies?: {
    title?: string;
    description?: string;
    items: CvCaseStudy[];
  };
  core_technologies?: CvCoreTechnology[];
}

export interface CvDataBase {
  cv: {
    name: string;
    headline: string;
    location: string;
    /** When true, UI may append remote availability to the location line (see `formatCvLocationLine`). */
    remote_available?: boolean;
    portfolio?: string;
    email: string;
    phone: string;
    /** Short summary used for meta tags, previews, etc. */
    summary?: string;
    /** Short one-liner for the homepage hero (and fallback where a brief blurb is needed). */
    short_summary?: string;
    skills: CvSkillItem[];
    experience: CvExperienceItem[];
    /**
     * Variant files only: per-entry experience overrides matched by exact `company`.
     * Lets a variant tailor one role (e.g. shorter highlights) without redefining the
     * whole `experience` array (deepMerge replaces arrays wholesale). Applied and
     * stripped in `loadCvDataFromFile`.
     */
    experience_overrides?: CvExperienceOverride[];
    education: CvEducationItem[];
    languages: CvLanguageItem[];
    social_networks?: CvSocialNetwork[];
    /**
     * Resume only: how many expanded experience rows land on page 1 (default 2).
     * Bump per-variant when a short leading entry (e.g. an open-source role) would
     * otherwise leave page 1 half-empty and push the next role entirely to page 2.
     */
    resume_page1_experience_rows?: number;
  };
}

export interface CvData {
  cv: CvDataBase["cv"] & PortfolioData;
}

/** Strip https:// and optional www. for compact display; href stays full URL for ATS and links. */
export function shortUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/i, "").trim();
}

/** Location line for site chrome (hero, contact): geographic location plus optional remote note. */
export function formatCvLocationLine(cv: Pick<CvData["cv"], "location" | "remote_available">): string {
  const loc = cv.location.trim();
  if (cv.remote_available) {
    return loc ? `${loc} (Remote available)` : "Remote available";
  }
  return loc;
}

/** Compact location for the printable resume header (preserves prior “Remote / Warsaw” wording when applicable). */
export function formatCvLocationForResume(cv: Pick<CvData["cv"], "location" | "remote_available">): string {
  const loc = cv.location.trim();
  if (cv.remote_available && /warsaw/i.test(loc)) return "Remote / Warsaw";
  return formatCvLocationLine(cv);
}
