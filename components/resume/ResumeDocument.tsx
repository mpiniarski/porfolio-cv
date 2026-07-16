import React from "react";
import { formatDateRange } from "@/lib/dateFormat";
import { formatCvLocationForResume, sortEducationByEndDateDesc } from "@/lib/resumeData";
import type { CvData, CvExperienceItem, CvExperienceProject } from "@/lib/resumeData";
import { ResumeHeader } from "./ResumeHeader";

const DEFAULT_PRIMARY_EXPERIENCE_COUNT = 2;

const PAGE_SHELL_BASE =
  "max-w-[210mm] mx-auto px-16 py-12 min-h-[297mm] print:min-h-[297mm] w-full print:w-[210mm]";
/** Page 1 print padding (full page). */
const PAGE_1_PRINT_PAD = "print:px-12 print:pt-6 print:pb-6";
/** Page 2 print padding: slightly tighter top to recover a small amount of vertical space. */
const PAGE_2_PRINT_PAD = "print:px-11 print:pt-3 print:pb-6";

type ExperienceRenderRow = {
  item: CvExperienceItem;
  /** Subset of `item.projects` for this page chunk; omit to use full item. */
  projectSlice?: CvExperienceProject[];
  continuation: boolean;
};

function highlightTech(text: string): (string | React.ReactElement)[] {
  const technologies = [
    "React",
    "Vue",
    "TypeScript",
    "JavaScript",
    "GraphQL",
    "Kotlin",
    "Java",
    "Next.js",
    "Node.js",
    "AWS",
    "MongoDB",
    "Terraform",
    "REST",
    "Highcharts",
    "AG Grid",
    "KotlinJS",
    "Ember.js",
    "New Relic",
    "Sentry",
    "TanStack Query",
    "Playwright",
    "XMPP",
    "Cognito",
    "Scrum",
  ];

  const techRegex = new RegExp(`\\b(${technologies.map((t) => t.replace(".", "\\.")).join("|")})\\b`, "g");

  const parts: (string | React.ReactElement)[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = techRegex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.substring(lastIndex, match.index));
    parts.push(
      <span key={match.index} className="font-medium text-slate-900">
        {match[0]}
      </span>,
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.substring(lastIndex));
  return parts.length > 0 ? parts : [text];
}

function ResumeProjectEntry({ project }: { project: CvExperienceProject }) {
  const role = project.role?.trim();
  const primary = role || project.name;
  const secondary = role ? project.name : null;
  return (
    <section className="flex flex-col gap-1.5 pb-3 last:pb-0 print:gap-1.25 print:pb-1.75 print:last:pb-0 print:break-inside-avoid">
      <div className="space-y-0.5 print:space-y-px">
        <h3 className="text-sm font-semibold text-slate-900">{primary}</h3>
        {secondary ? <p className="text-xs font-semibold text-slate-600">{secondary}</p> : null}
      </div>
      <div className="text-[10px] text-slate-500">
        {formatDateRange(project.start_date, project.end_date)}
      </div>
      <ul className="ml-5 list-disc space-y-1.5 list-outside text-xs leading-relaxed text-slate-700 marker:text-slate-400 print:space-y-1 print:leading-[1.35]">
        {project.highlights.map((h) => (
          <li key={h}>{highlightTech(h)}</li>
        ))}
      </ul>
    </section>
  );
}

function expandExperienceForResumeRows(items: CvExperienceItem[]): ExperienceRenderRow[] {
  const out: ExperienceRenderRow[] = [];
  for (const item of items) {
    const projs = item.projects;
    const n = item.resume_break_projects_after;
    if (projs && n != null && n > 0 && n < projs.length) {
      out.push({ item, projectSlice: projs.slice(0, n), continuation: false });
      out.push({ item, projectSlice: projs.slice(n), continuation: true });
    } else {
      out.push({ item, continuation: false });
    }
  }
  return out;
}

function resumeExperienceRowKey(row: ExperienceRenderRow): string {
  const sliceKey = row.projectSlice?.[0]?.name ?? "full";
  return `${row.item.company}-${row.item.position}-${row.item.start_date ?? ""}-${row.continuation ? "c" : "a"}-${sliceKey}`;
}

function ResumeExperienceArticle({ row }: { row: ExperienceRenderRow }) {
  const { item, continuation, projectSlice } = row;
  const projects = projectSlice ?? item.projects;
  const hasProjects = projects && projects.length > 0;
  const showCompanyDescription = item.company_description && !continuation;
  const isConsultingStyle = (item.worked_with?.length ?? 0) > 0;

  return (
    <article className="space-y-1.5 pb-3 last:pb-0 print:space-y-1.5 print:pb-2 print:last:pb-0 print:break-inside-avoid">
      {!continuation ? (
        <>
          <div className="space-y-0.5 print:space-y-px">
            <h3 className="text-sm font-semibold text-slate-900">{item.position}</h3>
            <p className="text-xs font-semibold text-slate-600">{item.company}</p>
          </div>
          <div className="text-[10px] text-slate-500">
            {formatDateRange(item.start_date, item.end_date)}
            {item.location ? ` · ${item.location}` : ""}
          </div>
        </>
      ) : null}
      {showCompanyDescription ? (
        <p className="text-xs leading-relaxed text-slate-700 print:leading-[1.35]">
          {item.company_description}
        </p>
      ) : null}
      {hasProjects ? (
        <div
          className={
            isConsultingStyle
              ? continuation
                ? "space-y-3 border-l border-slate-200 py-0.5 pl-3 print:space-y-1.75 print:border-slate-300 print:pl-3 print:py-0.5"
                : "mt-2 space-y-3 border-l border-slate-200 py-0.5 pl-3 print:mt-1.75 print:space-y-1.75 print:border-slate-300 print:pl-3 print:py-0.5"
              : continuation
                ? "space-y-3 print:space-y-2.75"
                : "space-y-3 pt-2 print:space-y-2.75 print:pt-2.25"
          }
        >
          {projects.map((project) => (
            <ResumeProjectEntry key={project.name} project={project} />
          ))}
        </div>
      ) : (
        <ul className="ml-5 list-disc space-y-1.5 list-outside text-xs leading-relaxed text-slate-700 marker:text-slate-400 print:space-y-1 print:leading-[1.35]">
          {(item.highlights ?? []).map((h) => (
            <li key={h}>{highlightTech(h)}</li>
          ))}
        </ul>
      )}
    </article>
  );
}

function ResumePageFooter({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <footer className="shrink-0 pt-2.5 text-right text-[9px] text-slate-400 print:pt-2">
      Page {pageNumber} of {totalPages}
    </footer>
  );
}

function normalizeLanguageDetails(details: string): string {
  const d = details.trim();
  const parts = d.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length === 2) return `${parts[0]} (${parts[1]})`;
  return d;
}

function sortByStartDateDesc<T extends { start_date?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const sa = a.start_date ?? "";
    const sb = b.start_date ?? "";
    return sb.localeCompare(sa);
  });
}

export function ResumeDocument({ cv, previewEnabled = true }: { cv: CvData["cv"]; previewEnabled?: boolean }) {
  const social_networks = cv.social_networks ?? [];
  const resumeSummaryText = (cv.summary?.trim() ?? "").trim();
  const rawExperience = cv.experience ?? [];
  const experience = sortByStartDateDesc(rawExperience).map((item) => ({
    ...item,
    projects: item.projects ? sortByStartDateDesc(item.projects) : undefined,
  }));
  const experienceRows = expandExperienceForResumeRows(experience);
  const primaryExperienceCount = cv.resume_page1_experience_rows ?? DEFAULT_PRIMARY_EXPERIENCE_COUNT;
  const experiencePage1Rows = experienceRows.slice(0, primaryExperienceCount);
  const experiencePage2Rows = experienceRows.slice(primaryExperienceCount);
  const skills = cv.skills ?? [];
  const education = sortEducationByEndDateDesc(cv.education ?? []);
  const languages = cv.languages ?? [];
  const hasPage2 =
    experiencePage2Rows.length > 0 || education.length > 0 || languages.length > 0;
  const totalPages = hasPage2 ? 2 : 1;
  const resumeLocation = formatCvLocationForResume(cv);

  const page1Shell = `${PAGE_SHELL_BASE} ${PAGE_1_PRINT_PAD} flex min-h-0 flex-col`;
  const page2Shell = `${PAGE_SHELL_BASE} ${PAGE_2_PRINT_PAD} flex min-h-0 flex-col`;

  return (
    <div className="bg-white font-(--font-resume) print:bg-white">
      <section
        className={`${previewEnabled ? "resume-page" : "resume-page resume-page--no-preview"} flex min-h-0 flex-col`}
      >
        <div className={page1Shell}>
          <ResumeHeader
            headline={cv.headline}
            name={cv.name}
            portfolio={cv.portfolio}
            location={resumeLocation}
            email={cv.email}
            socialNetworks={social_networks}
          />

          <div className="flex min-h-0 flex-1 flex-col gap-6 print:gap-4.5">
          <section className="print:break-inside-avoid">
            {resumeSummaryText ? (
              <p className="text-xs leading-relaxed text-slate-700 print:leading-[1.35]">
                {(() => {
                  const text = resumeSummaryText;
                  const marker = "experience";
                  const idx = text.toLowerCase().indexOf(marker);
                  if (idx === -1) return text;
                  const end = idx + marker.length;
                  return (
                    <>
                      <strong>{text.slice(0, end)}</strong>{" "}
                      {text.slice(end).trimStart()}
                    </>
                  );
                })()}
              </p>
            ) : null}
          </section>

          {skills.length > 0 ? (
            <section className="print:break-inside-avoid">
              <h2 className="mb-3 text-sm font-semibold tracking-wider text-slate-500 uppercase print:mb-1.75">
                Technical Skills:
              </h2>
              <div className="space-y-2 print:space-y-1.75">
                {skills.map((skill) => (
                  <p key={skill.label} className="text-xs leading-relaxed text-slate-700 print:leading-[1.35]">
                    <span className="font-semibold tracking-wider text-slate-900 uppercase">{skill.label}:</span>{" "}
                    {skill.details}
                  </p>
                ))}
              </div>
            </section>
          ) : null}

          <section>
            <h2 className="mb-3 text-sm font-semibold tracking-wider text-slate-500 uppercase print:mb-2.25">
              Experience:
            </h2>
            <div className="space-y-4 print:space-y-2.25">
              {experiencePage1Rows.map((row) => (
                <ResumeExperienceArticle key={resumeExperienceRowKey(row)} row={row} />
              ))}
            </div>
          </section>
          </div>

          <ResumePageFooter pageNumber={1} totalPages={totalPages} />
        </div>
      </section>

      {hasPage2 ? (
        <section
          className={`${previewEnabled ? "resume-page" : "resume-page resume-page--no-preview"} resume-page--sheet-2 flex min-h-0 flex-col`}
        >
          <div className={page2Shell}>
            <div className="flex min-h-0 flex-1 flex-col gap-6 print:gap-2">
            {experiencePage2Rows.length > 0 ? (
              <section>
                <div className="space-y-4 print:space-y-1.25">
                  {experiencePage2Rows.map((row) => (
                    <ResumeExperienceArticle key={resumeExperienceRowKey(row)} row={row} />
                  ))}
                </div>
              </section>
            ) : null}

            {education.length > 0 ? (
              <section className="print:break-inside-avoid">
                <h2 className="mb-2 text-sm font-semibold tracking-wider text-slate-500 uppercase print:mb-1.5">
                  Education:
                </h2>
                <div className="space-y-2 print:space-y-1">
                  {education.map((entry) => {
                    const abbrev = entry.degree.includes(" - ")
                      ? entry.degree.split(" - ")[0].trim()
                      : entry.degree;
                    const discipline =
                      entry.degree.match(/ (?:in|-) (.+)$/)?.[1]?.trim() ?? entry.area?.trim() ?? "";
                    const omitArea =
                      Boolean(entry.area?.trim()) &&
                      discipline.length > 0 &&
                      entry.area!.trim().toLowerCase() === discipline.toLowerCase();
                    const spec =
                      entry.area?.trim() && !omitArea ? ` (${entry.area.trim()})` : "";
                    const institutionLine = [entry.institution, entry.location].filter(Boolean).join(", ");
                    const yearRange = formatDateRange(entry.start_date, entry.end_date);
                    const thesis = entry.thesis?.trim();
                    return (
                      <div
                        key={`${entry.institution}-${entry.degree}-${entry.start_date}`}
                        className="space-y-0.5"
                      >
                        <p className="text-xs font-semibold text-slate-700">
                          {abbrev}
                          {spec}
                        </p>
                        {thesis ? (
                          <p className="text-[10px] text-slate-500 -mt-0.5">{thesis}</p>
                        ) : null}
                        <p className="text-[11px] text-slate-500">{institutionLine}</p>
                        <p className="text-[10px] text-slate-500">{yearRange}</p>
                      </div>
                    );
                  })}
                </div>
              </section>
            ) : null}

            {languages.length > 0 ? (
              <section className="print:break-inside-avoid">
                  <h2 className="mb-2 text-sm font-semibold tracking-wider text-slate-500 uppercase print:mb-1.5">
                    Languages:
                  </h2>
                  <div className="space-y-2 print:space-y-1">
                    {languages.map((lang) => {
                      const [name, rest] = lang.bullet.split(/\s*\(\s*/);
                      const label = name?.replace(/:$/, "").trim();
                      const details = rest ? rest.replace(/\)\s*$/, "").trim() : "";
                      const normalized = details ? normalizeLanguageDetails(details) : "";
                      return (
                        <p key={lang.bullet} className="text-xs text-slate-700">
                          <span className="tracking-wider text-slate-500 uppercase">{label}:</span>{" "}
                          {normalized || details || lang.bullet}
                        </p>
                      );
                    })}
                  </div>
                </section>
            ) : null}
          </div>

            <ResumePageFooter pageNumber={2} totalPages={totalPages} />
          </div>
        </section>
      ) : null}
    </div>
  );
}

