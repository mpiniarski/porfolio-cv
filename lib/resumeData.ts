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

export interface CvData {
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
    skills: CvSkillItem[];
    experience: CvExperienceItem[];
    education: CvEducationItem[];
    languages: CvLanguageItem[];
    typically_help_with?: string[];
    social_networks?: CvSocialNetwork[];
    projects?: CvProject[];
    photo?: string | null;
  };
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
