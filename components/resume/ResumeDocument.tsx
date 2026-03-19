import React from "react";
import { formatDateRange, formatYearRange } from "@/lib/dateFormat";
import { groupEducationByInstitution } from "@/lib/resumeData";
import type { CvData } from "@/lib/resumeData";
import { ResumeHeader } from "./ResumeHeader";

const PRIMARY_EXPERIENCE_COUNT = 2;
const PAGE_PADDING_CLASS =
  "max-w-[210mm] mx-auto px-16 py-12 print:px-16 print:py-12 min-h-[297mm] print:min-h-0 w-full print:w-[210mm]";

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
    "NewRelic",
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
  const intro = cv.sections?.[""] ?? [];
  const rawExperience = cv.sections?.experience ?? [];
  const experience = sortByStartDateDesc(rawExperience).map((item) => ({
    ...item,
    projects: item.projects ? sortByStartDateDesc(item.projects) : undefined,
  }));
  const experiencePage1 = experience.slice(0, PRIMARY_EXPERIENCE_COUNT);
  const experiencePage2 = experience.slice(PRIMARY_EXPERIENCE_COUNT);
  const skills = cv.sections?.skills ?? [];
  const education = groupEducationByInstitution(cv.sections?.education ?? []);
  const languages = cv.sections?.languages ?? [];
  const hasPage2 =
    experiencePage2.length > 0 || education.length > 0 || languages.length > 0;
  const totalPages = hasPage2 ? 2 : 1;
  const resumeLocation =
    /remote/i.test(cv.location) && /warsaw/i.test(cv.location) ? "Remote / Warsaw" : cv.location;

  return (
    <div className="bg-white font-(--font-resume) print:bg-white">
      <section className={previewEnabled ? "resume-page" : "resume-page resume-page--no-preview"}>
        <div className={PAGE_PADDING_CLASS}>
          <ResumeHeader
            headline={cv.headline}
            name={cv.name}
            portfolio={cv.portfolio}
            location={resumeLocation}
            email={cv.email}
            socialNetworks={social_networks}
            pageNumber={1}
            totalPages={totalPages}
          />

          <div className="flex flex-col gap-5">
          <section className="print:break-inside-avoid">
            {intro.length > 0 ? (
              <p className="text-xs leading-relaxed text-slate-700">
                {(() => {
                  const text = intro[0] ?? "";
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
              <h2 className="mb-2 text-sm font-semibold tracking-wider text-slate-500 uppercase">Technical Skills:</h2>
              <div className="space-y-1">
                {skills.map((skill) => (
                  <p key={skill.label} className="text-xs leading-relaxed text-slate-700">
                    <span className="font-medium tracking-wider text-slate-600 uppercase">{skill.label}:</span>{" "}
                    {skill.details}
                  </p>
                ))}
              </div>
            </section>
          ) : null}

          <section className="print:break-inside-avoid">
            <h2 className="mb-2 text-sm font-semibold tracking-wider text-slate-500 uppercase">Recent Experience:</h2>
            <div className="space-y-2">
                  {experiencePage1.map((item) => (
                    <article
                      key={`${item.company}-${item.position}-${item.start_date ?? ""}`}
                      className="pb-2 print:break-inside-avoid"
                    >
                      <div className="mb-0.5 flex items-baseline justify-between">
                        <h3 className="text-sm font-semibold text-slate-900">{item.position}</h3>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {formatDateRange(item.start_date, item.end_date)}
                        </span>
                      </div>
                      <div className="mb-1.5 flex items-baseline justify-between">
                        <p className="text-xs font-semibold text-slate-600">{item.company}</p>
                        <span className="text-xs text-slate-500">{item.location}</span>
                      </div>

                      {item.projects && item.projects.length > 0 ? (
                        <div className="space-y-2">
                          {item.projects.map((project) => (
                            <section
                              key={project.name}
                              className="pb-2 last:pb-0 print:break-inside-avoid"
                            >
                              <div className="mb-1.5 flex items-baseline justify-between">
                                <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                  {project.name}
                                </p>
                                <span className="text-[9px] text-slate-400">
                                  {formatDateRange(project.start_date, project.end_date)}
                                </span>
                              </div>
                              <ul className="ml-5 list-disc space-y-1.5 list-outside text-xs leading-[1.6] text-slate-700 marker:text-slate-400">
                                {project.highlights.map((h) => (
                                  <li key={h}>{highlightTech(h)}</li>
                                ))}
                              </ul>
                            </section>
                          ))}
                        </div>
                      ) : (
                        <ul className="ml-5 list-disc space-y-1.5 list-outside text-xs leading-[1.6] text-slate-700 marker:text-slate-400">
                          {(item.highlights ?? []).map((h) => (
                            <li key={h}>{highlightTech(h)}</li>
                          ))}
                        </ul>
                      )}
                    </article>
                  ))}
                </div>
              </section>
          </div>
        </div>
      </section>

      {hasPage2 ? (
        <section className={previewEnabled ? "resume-page" : "resume-page resume-page--no-preview"}>
          <div className={PAGE_PADDING_CLASS}>
            <ResumeHeader
              headline={cv.headline}
              name={cv.name}
              portfolio={cv.portfolio}
              location={resumeLocation}
              email={cv.email}
              socialNetworks={social_networks}
              pageNumber={2}
              totalPages={totalPages}
            />

            <div className="flex flex-col gap-5">
            {experiencePage2.length > 0 ? (
                <section>
              <h2 className="mb-2 text-sm font-semibold tracking-wider text-slate-500 uppercase">
                Past Experience:
              </h2>

              <div className="space-y-2">
                {experiencePage2.map((item) => (
                  <article
                    key={`${item.company}-${item.position}-${item.start_date ?? ""}`}
                    className="pb-2 last:pb-0 print:break-inside-avoid"
                  >
                    <div className="mb-0.5 flex items-baseline justify-between">
                      <h3 className="text-sm font-semibold text-slate-900">{item.position}</h3>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        {formatDateRange(item.start_date, item.end_date)}
                      </span>
                    </div>
                    <div className="mb-1.5 flex items-baseline justify-between">
                      <p className="text-xs font-semibold text-slate-600">{item.company}</p>
                      <span className="text-xs text-slate-500">{item.location}</span>
                    </div>

                    {item.projects && item.projects.length > 0 ? (
                      <div className="space-y-2">
                        {item.projects.map((project) => (
                          <section
                            key={project.name}
                            className="pb-2 last:pb-0 print:break-inside-avoid"
                          >
                            <div className="mb-1.5 flex items-baseline justify-between">
                              <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                {project.name}
                              </p>
                              <span className="text-[9px] text-slate-400">
                                {formatDateRange(project.start_date, project.end_date)}
                              </span>
                            </div>
                            <ul className="ml-5 list-disc space-y-1.5 list-outside text-xs leading-[1.6] text-slate-700 marker:text-slate-400">
                              {project.highlights.map((h) => (
                                <li key={h}>{highlightTech(h)}</li>
                              ))}
                            </ul>
                          </section>
                        ))}
                      </div>
                    ) : (
                      <ul className="ml-5 list-disc space-y-1.5 list-outside text-xs leading-[1.6] text-slate-700 marker:text-slate-400">
                        {(item.highlights ?? []).map((h) => (
                          <li key={h}>{highlightTech(h)}</li>
                        ))}
                      </ul>
                    )}
                  </article>
                ))}
              </div>
            </section>
              ) : null}

            {education.length > 0 ? (
              <section className="print:break-inside-avoid">
                <h2 className="mb-1 text-sm font-semibold tracking-wider text-slate-500 uppercase">Education:</h2>
                {(() => {
                  const sorted = [...education].sort((a, b) => {
                    const aEnd = [...a.degrees.map((d) => d.end_date)].sort().reverse()[0] ?? "";
                    const bEnd = [...b.degrees.map((d) => d.end_date)].sort().reverse()[0] ?? "";
                    return bEnd.localeCompare(aEnd);
                  });
                  return sorted.map((group) => {
                    const starts = group.degrees.map((d) => d.start_date);
                    const ends = group.degrees.map((d) => d.end_date);
                    const mergedStart = [...starts].sort()[0];
                    const mergedEnd = [...ends].sort().reverse()[0];
                    const yearRange = formatYearRange(mergedStart, mergedEnd);
                    const msc = group.degrees.find((d) => /^MSc\b/i.test(d.degree));
                    const bsc = group.degrees.find((d) => /^BSc\b/i.test(d.degree));
                    const hasMscAndBsc = msc && bsc;
                    const discipline =
                      group.degrees[0]?.degree.match(/ (?:in|-) (.+)$/)?.[1]?.trim() ?? "";
                    const degreeLabel = hasMscAndBsc
                      ? `MSc${msc?.area ? ` (${msc.area})` : ""} & BSc${discipline ? ` ${discipline}` : ""}`
                      : group.degrees
                          .map((d) => {
                            const abbrev = d.degree.includes(" - ") ? d.degree.split(" - ")[0].trim() : d.degree;
                            const subj = d.degree.match(/ (?:in|-) (.+)$/)?.[1]?.trim();
                            return subj ? `${abbrev} ${subj}` : abbrev;
                          })
                          .join(", ");
                    const institutionLine = [group.institution, group.location].filter(Boolean).join(", ");
                    return (
                      <p key={`${group.institution}-${group.location}`} className="text-xs text-slate-700">
                        {degreeLabel}, {institutionLine} — {yearRange}
                      </p>
                    );
                  });
                })()}
              </section>
            ) : null}

            {languages.length > 0 ? (
              <section className="print:break-inside-avoid">
                  <h2 className="mb-1 text-sm font-semibold tracking-wider text-slate-500 uppercase">Languages:</h2>
                  <div className="space-y-1">
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
          </div>
        </section>
      ) : null}
    </div>
  );
}

