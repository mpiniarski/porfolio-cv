"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Calendar,
  ChevronUp,
  GraduationCap,
  List,
  MapPin,
  X,
} from "lucide-react";

import { experienceEntryAnchorId } from "@/lib/experienceAnchor";
import type { CvData } from "@/lib/resumeData";
import { DownloadCVButton } from "@/components/DownloadCVButton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function parseYearMonth(value: string | undefined): Date | null {
  if (!value) return null;
  const [y, m] = value.split("-");
  const year = Number(y);
  if (!Number.isFinite(year)) return null;
  const month = m ? Math.max(1, Math.min(12, Number(m))) : 1;
  return new Date(year, month - 1, 1);
}

function addMonths(d: Date, months: number) {
  const out = new Date(d);
  out.setMonth(out.getMonth() + months);
  return out;
}

function formatMonthYear(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function formatPeriod(start: Date, end: Date) {
  return `${formatMonthYear(start)} – ${formatMonthYear(end)}`;
}

type ExperienceItem = {
  title: string;
  company: string;
  /** Full project line from data (e.g. "SIEMENS (GroundFog)"); used for anchors and fallbacks. */
  projectName?: string;
  /** When `name` is "Client (Engagement)", shown under the client line (e.g. GroundFog). */
  engagementPartner?: string;
  parentCompany?: string;
  location: string;
  period: string;
  startDate: Date;
  endDate: Date;
  highlights: string[];
  technologies: string[];
  logo?: string;
  client?: string;
  isSubProject?: boolean;
  shortName?: string;
  isOpportunity?: boolean;
  /** Matches `case_studies.items[].experience_anchor` / `/experience#…` URL fragment. */
  anchorId: string;
};

type EducationMilestone = {
  label: string;
  date: Date;
  year: number;
  title: string;
  institution: string;
};

function splitClientAndCompany(projectName: string): { client?: string; company?: string } {
  const match = projectName.match(/^(.+?)\s*\((.+?)\)\s*$/);
  if (!match) return {};
  return { client: match[1]?.trim(), company: match[2]?.trim() };
}

/** Title-case loud client labels (e.g. SIEMENS → Siemens) while keeping tokens like MANN+HUMMEL readable. */
function prettyEngagementClient(raw: string): string {
  const t = raw.trim();
  if (!t) return t;
  if (t.includes("+")) {
    return t
      .split("+")
      .map((part) => {
        const p = part.trim();
        if (!p) return part;
        return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
      })
      .join("+");
  }
  if (t === t.toUpperCase() && /[A-Z]/.test(t)) {
    return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
  }
  return t;
}

/** e.g. GroundFog → Ground Fog for subtitle lines */
function humanizeEngagementPartner(raw: string): string {
  return raw.replace(/([a-z\d])([A-Z])/g, "$1 $2").trim();
}

/** Main title = client / project name only; engagement & employer are never part of `heading`. */
function experienceCardHeadingParts(exp: ExperienceItem): { heading: string; metaLines: string[] } {
  const heading = exp.title?.trim() || exp.company;
  const metaLines: string[] = [];

  if (exp.engagementPartner) {
    metaLines.push(humanizeEngagementPartner(exp.engagementPartner));
  }
  if (exp.parentCompany) {
    metaLines.push(exp.parentCompany);
  }

  if (!exp.engagementPartner) {
    const fallback = exp.projectName ?? exp.company;
    if (fallback !== heading) {
      metaLines.unshift(fallback);
    }
  }

  return { heading, metaLines };
}

function experienceRailLabels(exp: ExperienceItem): { main: string; subLines: string[] } {
  if (!exp.isSubProject) {
    return { main: exp.shortName || exp.company, subLines: [] };
  }
  const subLines: string[] = [];
  if (exp.engagementPartner) {
    subLines.push(humanizeEngagementPartner(exp.engagementPartner));
  }
  if (exp.parentCompany) {
    subLines.push(exp.parentCompany);
  }
  return { main: exp.title, subLines };
}

const now = new Date();
const paddedNow = new Date(now);
paddedNow.setMonth(paddedNow.getMonth() + 6);

export function ExperienceTimelineSection({
  experience,
  cv,
}: {
  experience: CvData["cv"]["experience"];
  cv: CvData["cv"];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const desktopDetailRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [selectedEducation, setSelectedEducation] = useState<number | null>(null);


  const experiences = useMemo<ExperienceItem[]>(() => {
    const out: ExperienceItem[] = [];

    const opp = cv.open_for_opportunities_section;
    if (opp?.bullets?.length) {
      // This item is "extra" and should end at the current day (no future padding).
      // Give it a small visible range so the timeline rail can render its bar.
      const end = now;
      const start = addMonths(end, -1);

      out.push({
        title: "",
        company: "Open for Opportunities",
        location: opp.mode ?? "Remote / Hybrid",
        period: opp.availability ?? "Available Now",
        startDate: start,
        endDate: paddedNow,
        highlights: opp.bullets,
        technologies: [],
        isOpportunity: true,
        anchorId: experienceEntryAnchorId(undefined, "Open for Opportunities"),
      });
    }

    for (const exp of experience ?? []) {
      const expStart = parseYearMonth(exp.start_date);
      const expEnd =
        parseYearMonth(exp.end_date) ?? new Date(now.getFullYear(), now.getMonth(), 1);

      const title =
        (exp.position ?? "").replace(/\s*\(.+?\)\s*/g, "").trim() ||
        exp.position ||
        exp.company;

      if (exp.projects?.length) {
        for (const p of exp.projects) {
          const { client, company } = splitClientAndCompany(p.name);
          const pStart = parseYearMonth(p.start_date) ?? expStart;
          const pEnd = parseYearMonth(p.end_date) ?? expEnd;
          if (!pStart || !pEnd) continue;

          const projectCompany = company ?? exp.company;
          const splitPair = Boolean(client && company);
          const displayTitle = splitPair && client ? prettyEngagementClient(client) : p.name.trim() || title;
          const engagementPartner = splitPair && company ? company : undefined;
          out.push({
            title: displayTitle,
            company: projectCompany,
            projectName: p.name,
            engagementPartner,
            parentCompany: exp.company,
            location: exp.location ?? "",
            period: formatPeriod(pStart, pEnd),
            startDate: pStart,
            endDate: pEnd,
            highlights: (p.highlights?.length ? p.highlights : exp.highlights) ?? [],
            technologies: [],
            logo: cv.company_logos?.[projectCompany],
            client,
            isSubProject: Boolean(client),
            shortName:
              projectCompany === "Balyasny Asset Management"
                ? "Balyasny (BAM)"
                : projectCompany === "No Spoon Tech Lab"
                  ? "No Spoon"
                  : undefined,
            anchorId: experienceEntryAnchorId(p.name, exp.company),
          });
        }
      } else if (expStart) {
        out.push({
          title,
          company: exp.company,
          location: exp.location ?? "",
          period: formatPeriod(expStart, expEnd),
          startDate: expStart,
          endDate: expEnd,
          highlights: exp.highlights ?? [],
          technologies: [],
          logo: cv.company_logos?.[exp.company],
          anchorId: experienceEntryAnchorId(undefined, exp.company),
        });
      }
    }

    out.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
    return out;
  }, [cv, experience]);

  // On load / hash change: deep-link to `#anchor` from Selected Work, else skip the promo card when it's first.
  useEffect(() => {
    const applyNavigation = () => {
      const id = window.location.hash.replace(/^#/, "").trim();
      if (id) {
        const fromHash = experiences.findIndex((e) => e.anchorId === id);
        if (fromHash >= 0) {
          setActiveIndex(fromHash);
          requestAnimationFrame(() => {
            const isLg = window.matchMedia("(min-width: 1024px)").matches;
            if (isLg) {
              desktopDetailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            } else {
              document
                .querySelector(`[data-experience-anchor="${CSS.escape(id)}"]`)
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          });
          return;
        }
      }
      const firstNonOpp = experiences.findIndex((e) => !e.isOpportunity);
      if (firstNonOpp > 0) setActiveIndex(firstNonOpp);
    };
    applyNavigation();
    window.addEventListener("hashchange", applyNavigation);
    return () => window.removeEventListener("hashchange", applyNavigation);
  }, [experiences]);

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, experiences.length);
  }, [experiences.length]);

  const educationMilestones = useMemo<EducationMilestone[]>(() => {
    const edu = cv.education ?? [];
    const milestones: EducationMilestone[] = [];

    const bachelor =
      edu.find((e) => /^BSc/i.test(e.degree ?? "")) ??
      edu.find((e) => /Bachelor/i.test(e.degree ?? ""));
    const master =
      edu.find((e) => /^MSc/i.test(e.degree ?? "")) ??
      edu.find((e) => /Master/i.test(e.degree ?? ""));

    const bEnd = parseYearMonth(bachelor?.end_date);
    if (bachelor && bEnd) {
      milestones.push({
        label: "End of Bachelor",
        date: bEnd,
        year: bEnd.getFullYear(),
        title: bachelor.degree ?? "Bachelor",
        institution: bachelor.institution ?? "",
      });
    }

    const mEnd = parseYearMonth(master?.end_date);
    if (master && mEnd) {
      milestones.push({
        label: "End of Master",
        date: mEnd,
        year: mEnd.getFullYear(),
        title: master.degree ?? "Master",
        institution: master.institution ?? "",
      });
    }

    return milestones;
  }, [cv.education]);

  const timelineBounds = useMemo(() => {
    const dates = [
      ...experiences.flatMap((e) => [e.startDate, e.endDate]),
      ...educationMilestones.map((m) => m.date),
      paddedNow,
    ];

    const earliest = new Date(Math.min(...dates.map((d) => d.getTime())));
    const latest = new Date(Math.max(...dates.map((d) => d.getTime())));
    const earliestDate = new Date(earliest.getFullYear(), 0, 1);
    // Add a small future padding so the current/active item isn't pinned to the very top.
    return { earliestDate, latestDate: latest };
  }, [educationMilestones, experiences]);

  const timelinePositions = useMemo(() => {
    const totalDuration =
      timelineBounds.latestDate.getTime() - timelineBounds.earliestDate.getTime();
    if (!Number.isFinite(totalDuration) || totalDuration <= 0) return [];

    return experiences.map((exp) => {
      const startOffset = exp.startDate.getTime() - timelineBounds.earliestDate.getTime();
      const endOffset = exp.endDate.getTime() - timelineBounds.earliestDate.getTime();
      const startPosition = (startOffset / totalDuration) * 100;
      const endPosition = (endOffset / totalDuration) * 100;
      return { start: 100 - endPosition, end: 100 - startPosition };
    });
  }, [experiences, timelineBounds.earliestDate, timelineBounds.latestDate]);

  const educationPositions = useMemo(() => {
    const totalDuration =
      timelineBounds.latestDate.getTime() - timelineBounds.earliestDate.getTime();
    if (!Number.isFinite(totalDuration) || totalDuration <= 0) return [];

    return educationMilestones.map((milestone) => {
      const offset = milestone.date.getTime() - timelineBounds.earliestDate.getTime();
      const normalPosition = (offset / totalDuration) * 100;
      return 100 - normalPosition;
    });
  }, [educationMilestones, timelineBounds.earliestDate, timelineBounds.latestDate]);

  const yearPositions = useMemo(() => {
    const totalDuration =
      timelineBounds.latestDate.getTime() - timelineBounds.earliestDate.getTime();
    if (!Number.isFinite(totalDuration) || totalDuration <= 0) return [];

    const years: Array<{ year: number; position: number; label: string }> = [];
    for (
      let year = timelineBounds.earliestDate.getFullYear();
      year <= timelineBounds.latestDate.getFullYear();
      year++
    ) {
      const yearStart = new Date(year, 0, 1);
      const offset = yearStart.getTime() - timelineBounds.earliestDate.getTime();
      const normalPosition = (offset / totalDuration) * 100;
      years.push({ year, position: 100 - normalPosition, label: year.toString().slice(-2) });
    }
    return years;
  }, [timelineBounds.earliestDate, timelineBounds.latestDate]);

  const navigateToIndex = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < experiences.length) setActiveIndex(newIndex);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        navigateToIndex(activeIndex + 1);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        navigateToIndex(activeIndex - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, experiences.length]);

  useEffect(() => {
    let isScrolling = false;
    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      const experienceSection = target.closest("[data-experience-timeline]");
      if (!experienceSection) return;
      if (isScrolling) return;

      e.preventDefault();
      isScrolling = true;

      if (e.deltaY > 0) navigateToIndex(activeIndex + 1);
      else navigateToIndex(activeIndex - 1);

      setTimeout(() => {
        isScrolling = false;
      }, 600);
    };

    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [activeIndex, experiences.length]);

  if (!experiences.length) {
    return (
      <section className="px-4 py-10">
        <div className="max-w-6xl mx-auto text-muted-foreground">No experience data found.</div>
      </section>
    );
  }

  const activeExp = experiences[activeIndex];
  const activeHeadingParts = activeExp ? experienceCardHeadingParts(activeExp) : { heading: "", metaLines: [] as string[] };

  return (
    <section
      ref={containerRef}
      data-experience-timeline
      className="h-full px-4 bg-background flex items-center"
    >
      <div className="max-w-6xl mx-auto w-full h-full">
        {/* Mobile: stacked cards */}
        <div className="lg:hidden h-full flex flex-col">
          <div className="shrink-0 py-4">
            <button
              onClick={() => setIsTimelineOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <List className="h-5 w-5" />
              <span>View Timeline</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pb-4">
            {experiences.map((exp, index) => {
              const hp = experienceCardHeadingParts(exp);
              return (
                <Card
                  key={`${exp.company}-${exp.period}-${index}`}
                  data-experience-anchor={exp.anchorId}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  className={`scroll-mt-28 border-border/50 shadow-lg transition-all duration-500 ${highlightedIndex === index ? "ring-2 ring-primary shadow-primary/20" : ""
                    }`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      {exp.logo ? (
                        <div className="shrink-0 w-24 h-24 flex items-center justify-center bg-white rounded-lg border border-border/50 p-2.5">
                          <img
                            src={exp.logo}
                            alt={`${exp.company} logo`}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      ) : null}

                      <div className="flex-1">
                        <h2
                          className={`font-semibold tracking-tight mb-1 ${hp.metaLines.length > 0 ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"}`}
                        >
                          {hp.heading}
                        </h2>
                        {hp.metaLines.length > 0 ? (
                          <div className="mb-2 space-y-1">
                          {hp.metaLines.map((line, mi) => (
                            <p key={`${exp.anchorId}-m-${mi}`} className="text-sm text-muted-foreground">
                              {line}
                            </p>
                          ))}
                          </div>
                        ) : null}

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-sm">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            <span>{exp.period}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4" />
                            <span>{exp.location}</span>
                          </div>
                        </div>
                        {exp.client && !exp.projectName ? (
                          <p className="text-xs text-muted-foreground mt-2">Client: {exp.client}</p>
                        ) : null}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="list-disc list-outside ml-4 pl-4 space-y-2 mb-6 text-muted-foreground text-sm md:text-base leading-relaxed marker:text-primary">
                      {exp.highlights.map((highlight, hIndex) => (
                        <li key={`${highlight}-${hIndex}`} className="pl-1">
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Desktop: Figma-style card + rail */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_240px] gap-8 items-center py-10">
          <div ref={desktopDetailRef} className="scroll-mt-28">
            <Card className="border-border/50 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  {experiences[activeIndex]?.logo ? (
                    <div className="shrink-0 w-24 h-24 flex items-center justify-center bg-white rounded-lg border border-border/50 p-2.5">
                      <img
                        src={experiences[activeIndex].logo}
                        alt={`${experiences[activeIndex].company} logo`}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  ) : null}

                  <div className="flex-1">
                    <h2
                      className={`font-semibold tracking-tight mb-1 ${activeHeadingParts.metaLines.length > 0 ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"} ${experiences[activeIndex].isOpportunity ? "text-primary" : ""}`}
                    >
                      {activeHeadingParts.heading}
                    </h2>
                    {activeHeadingParts.metaLines.length > 0 ? (
                      <div className="mb-2 space-y-1">
                        {activeHeadingParts.metaLines.map((line, mi) => (
                          <p key={`active-m-${mi}`} className="text-sm text-muted-foreground">
                            {line}
                          </p>
                        ))}
                      </div>
                    ) : null}

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-sm">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>{experiences[activeIndex].period}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        <span>{experiences[activeIndex].location}</span>
                      </div>
                    </div>
                    {experiences[activeIndex].client && !experiences[activeIndex].projectName ? (
                      <p className="text-xs text-muted-foreground mt-2">Client: {experiences[activeIndex].client}</p>
                    ) : null}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="list-disc list-outside ml-4 pl-4 space-y-2 mb-6 text-muted-foreground text-sm md:text-base leading-relaxed marker:text-primary">
                  {experiences[activeIndex].highlights.map((highlight, hIndex) => (
                    <li key={`${highlight}-${hIndex}`} className="pl-1">
                      {highlight}
                    </li>
                  ))}
                </ul>
                {experiences[activeIndex].isOpportunity ? (
                  <div className="flex flex-wrap gap-3 pt-2">
                    <DownloadCVButton
                      variant="default"
                      size="sm"
                      className="rounded-lg px-4 py-2"
                    >
                      Download CV
                    </DownloadCVButton>
                    <a
                      href="/contact"
                      className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                    >
                      Contact me
                    </a>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>

          <div>
            <div className="relative h-[700px] mt-8">
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-border" />

              <div
                className={`absolute left-1/2 -translate-x-1/2 -top-2 transition-colors ${activeIndex === 0 && experiences[0].isOpportunity ? "text-primary" : "text-muted-foreground/30"
                  }`}
              >
                <ChevronUp className="h-6 w-6" />
              </div>

              {educationMilestones.map((milestone, index) => {
                const position = educationPositions[index];
                return (
                  <div
                    key={`education-${index}`}
                    className="absolute left-1/2"
                    style={{ top: `${position}%` }}
                  >
                    <button
                      onClick={() => setSelectedEducation(index)}
                      className="group/education cursor-pointer"
                    >
                      <div className="relative">
                        <div className="absolute top-1/2 -translate-y-1/2 left-0 h-px w-5 bg-muted-foreground/50 group-hover/education:bg-primary transition-colors" />
                        <div className="absolute left-7 top-1/2 -translate-y-1/2 pl-0.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground group-hover/education:text-primary transition-colors">
                            <GraduationCap className="h-3 w-3" />
                            <span>{milestone.label}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}

              {yearPositions.map((year) => (
                <div key={`year-${year.year}`} className="absolute left-1/2" style={{ top: `${year.position}%` }}>
                  <div className="relative">
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 h-px w-4 bg-muted-foreground/30 -translate-x-1/2" />
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 pl-2 whitespace-nowrap">
                      <div className="text-[10px] text-muted-foreground">{year.label}</div>
                    </div>
                  </div>
                </div>
              ))}

              {experiences.map((exp, index) => {
                const pos = timelinePositions[index];
                const topPosition = pos?.start ?? 0;
                const bottomPosition = pos?.end ?? 0;
                const rangeHeight = bottomPosition - topPosition;
                const isActive = index === activeIndex;

                const { main: railMain, subLines: railSubLines } = experienceRailLabels(exp);

                return (
                  <button
                    key={`range-${index}`}
                    onClick={() => setActiveIndex(index)}
                    style={{
                      position: "absolute",
                      top: `${topPosition}%`,
                      left: 0,
                      right: 0,
                      height: `${Math.max(2, rangeHeight)}%`,
                    }}
                    className="transition-all group cursor-pointer"
                  >
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 rounded-full transition-all ${isActive ? "bg-primary" : "bg-muted-foreground/30 group-hover:bg-primary/50"
                        }`}
                    />

                    <div
                      className="absolute right-1/2 pr-4 flex items-center justify-end"
                      style={{ top: "50%", transform: "translateY(-50%)" }}
                    >
                      <div className="text-right">
                        <div
                          className={`text-sm font-medium transition-all ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary/50"
                            }`}
                        >
                          {railMain}
                        </div>
                        {railSubLines.map((line, si) => (
                          <div
                            key={`${index}-rail-${si}`}
                            className={`text-[9px] transition-all ${isActive ? "text-primary" : "text-muted-foreground/70 group-hover:text-primary/50"
                              }`}
                          >
                            {line}
                          </div>
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              Use scroll wheel or arrow keys to navigate
            </div>
          </div>
        </div>
      </div>

      {/* Education details modal */}
      {selectedEducation !== null ? (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedEducation(null)}
        >
          <Card className="max-w-lg w-full border-border/50 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <CardHeader className="relative pb-3">
              <button
                type="button"
                onClick={() => setSelectedEducation(null)}
                aria-label="Close education details"
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
              <div className="flex items-start gap-3 pr-8">
                <div className="shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-1">{educationMilestones[selectedEducation].title}</h2>
                  <p className="text-primary font-medium">{educationMilestones[selectedEducation].institution}</p>
                  <p className="text-sm text-muted-foreground mt-1">{educationMilestones[selectedEducation].year}</p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      ) : null}

      {/* Mobile timeline modal */}
      {isTimelineOpen ? (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsTimelineOpen(false)}
        >
          <Card
            className="max-w-md w-full h-[80vh] border-border/50 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="pb-3 border-b border-border shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Experience Timeline</h2>
                <button
                  type="button"
                  onClick={() => setIsTimelineOpen(false)}
                  aria-label="Close timeline"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <div className="relative h-full w-full px-8 py-6 overflow-y-auto">
                <div className="relative min-h-[600px] h-full">
                  <div className="absolute left-1/2 -translate-x-1/2 top-6 bottom-6 w-0.5 bg-border" />

                  <div
                    className={`absolute left-1/2 -translate-x-1/2 top-2 transition-colors ${activeIndex === 0 && experiences[0].isOpportunity ? "text-primary" : "text-muted-foreground/30"
                      }`}
                  >
                    <ChevronUp className="h-6 w-6" />
                  </div>

                  {educationMilestones.map((milestone, index) => {
                    const position = educationPositions[index];
                    return (
                      <div
                        key={`education-mobile-${index}`}
                        className="absolute left-1/2"
                        style={{ top: `${position}%` }}
                      >
                        <button
                          onClick={() => {
                            setSelectedEducation(index);
                            setIsTimelineOpen(false);
                          }}
                          className="group/education cursor-pointer"
                        >
                          <div className="relative">
                            <div className="absolute top-1/2 -translate-y-1/2 left-0 h-px w-5 bg-muted-foreground/50 group-hover/education:bg-primary transition-colors" />
                            <div className="absolute left-7 top-1/2 -translate-y-1/2 pl-0.5 whitespace-nowrap">
                              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground group-hover/education:text-primary transition-colors">
                                <GraduationCap className="h-3 w-3" />
                                <span>{milestone.label}</span>
                              </div>
                            </div>
                          </div>
                        </button>
                      </div>
                    );
                  })}

                  {yearPositions.map((year) => (
                    <div
                      key={`year-mobile-${year.year}`}
                      className="absolute left-1/2"
                      style={{ top: `${year.position}%` }}
                    >
                      <div className="relative">
                        <div className="absolute top-1/2 -translate-y-1/2 left-0 h-px w-4 bg-muted-foreground/30 -translate-x-1/2" />
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 pl-2 whitespace-nowrap">
                          <div className="text-[10px] text-muted-foreground">{year.label}</div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {experiences.map((exp, index) => {
                    const pos = timelinePositions[index];
                    const topPosition = pos?.start ?? 0;
                    const bottomPosition = pos?.end ?? 0;
                    const rangeHeight = bottomPosition - topPosition;
                    const isActive = index === activeIndex;

                    const { main: railMain, subLines: railSubLines } = experienceRailLabels(exp);

                    return (
                      <button
                        key={`range-mobile-${index}`}
                        onClick={() => {
                          setActiveIndex(index);
                          setIsTimelineOpen(false);

                          setTimeout(() => {
                            const card = cardRefs.current[index];
                            if (card) {
                              card.scrollIntoView({ behavior: "smooth", block: "center" });
                              setHighlightedIndex(index);
                              setTimeout(() => setHighlightedIndex(null), 2000);
                            }
                          }, 100);
                        }}
                        style={{
                          position: "absolute",
                          top: `${topPosition}%`,
                          left: 0,
                          right: 0,
                          height: `${Math.max(2, rangeHeight)}%`,
                        }}
                        className="transition-all group cursor-pointer"
                      >
                        <div
                          className={`absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 rounded-full transition-all ${isActive ? "bg-primary" : "bg-muted-foreground/30 group-hover:bg-primary/50"
                            }`}
                        />

                        <div
                          className="absolute right-1/2 pr-4 flex items-center justify-end"
                          style={{ top: "50%", transform: "translateY(-50%)" }}
                        >
                          <div className="text-right">
                            <div
                              className={`text-sm font-medium transition-all ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary/50"
                                }`}
                            >
                              {railMain}
                            </div>
                            {railSubLines.map((line, si) => (
                              <div
                                key={`${index}-rail-m-${si}`}
                                className={`text-[9px] transition-all ${isActive ? "text-primary" : "text-muted-foreground/70 group-hover:text-primary/50"
                                  }`}
                              >
                                {line}
                              </div>
                            ))}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </section>
  );
}

