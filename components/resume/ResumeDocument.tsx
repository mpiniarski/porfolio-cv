import React from "react";
import { groupEducationByInstitution } from "@/lib/resumeData";
import type { CvData } from "@/lib/resumeData";
import { ResumeHeader } from "./ResumeHeader";

const PRIMARY_EXPERIENCE_COUNT = 2;
const PAGE_PADDING_CLASS =
  "max-w-[210mm] mx-auto px-16 py-12 print:px-16 print:py-12 min-h-[297mm] print:min-h-0 w-full print:w-[210mm]";

function formatMonthYear(value: string | undefined): string {
  if (!value) return "?";
  const [y, m] = String(value).split("-");
  if (!y) return "?";
  if (!m) return y;
  return `${m.padStart(2, "0")}.${y}`;
}

function formatRange(start?: string, end?: string): string {
  const s = formatMonthYear(start);
  const e = end ? formatMonthYear(end) : "Present";
  return `${s} - ${e}`;
}

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

export function ResumeDocument({ cv, previewEnabled = true }: { cv: CvData["cv"]; previewEnabled?: boolean }) {
  const social_networks = cv.social_networks ?? [];
  const intro = cv.sections?.[""] ?? [];
  const experience = cv.sections?.experience ?? [];
  const experiencePage1 = experience.slice(0, PRIMARY_EXPERIENCE_COUNT);
  const experiencePage2 = experience.slice(PRIMARY_EXPERIENCE_COUNT);
  const skills = cv.sections?.skills ?? [];
  const education = groupEducationByInstitution(cv.sections?.education ?? []);
  const languages = cv.sections?.languages ?? [];
  const totalPages = experiencePage2.length > 0 ? 2 : 1;
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

          <section className="mb-5 print:break-inside-avoid">
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

          <div className="grid grid-cols-[1fr_200px] gap-8 print:break-before-avoid">
            <div>
              <section>
                <h2 className="mb-2 text-sm font-semibold tracking-wider text-slate-500 uppercase">Experience:</h2>

                <div className="space-y-4">
                  {experiencePage1.map((item) => (
                    <article
                      key={`${item.company}-${item.position}-${item.start_date ?? ""}`}
                      className="border-b border-slate-100 pb-4 print:break-inside-avoid"
                    >
                      <div className="mb-0.5 flex items-baseline justify-between">
                        <h3 className="text-sm font-semibold text-slate-900">{item.position}</h3>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {formatRange(item.start_date, item.end_date)}
                        </span>
                      </div>
                      <div className="mb-1.5 flex items-baseline justify-between">
                        <p className="text-xs font-semibold text-slate-600">{item.company}</p>
                        <span className="text-xs text-slate-500">{item.location}</span>
                      </div>

                      {item.projects && item.projects.length > 0 ? (
                        <div className="space-y-3">
                          {item.projects.map((project) => (
                            <section
                              key={project.name}
                              className="border-b border-slate-200 pb-3 last:border-b-0 last:pb-0 print:break-inside-avoid"
                            >
                              <div className="mb-1.5 flex items-baseline justify-between">
                                <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                  {project.name}
                                </p>
                                <span className="text-[9px] text-slate-400">
                                  {formatRange(project.start_date, project.end_date)}
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

            <aside className="space-y-5 rounded bg-slate-50 p-4 shadow-sm print:break-inside-avoid print:shadow-none">
              <section>
                <h2 className="mb-4 text-xs tracking-wider text-slate-800 uppercase">Technical Skills:</h2>
                <div className="space-y-3">
                  {skills.map((skill) => (
                    <div key={skill.label}>
                      <h3 className="mb-1.5 text-xs tracking-wider text-slate-500 uppercase">{skill.label}:</h3>
                      <p className="text-xs leading-relaxed text-slate-700">{skill.details}</p>
                    </div>
                  ))}
                </div>
              </section>

              <hr className="border-slate-300" />

              <section>
                <h2 className="mb-3 text-xs tracking-wider text-slate-800 uppercase">Education:</h2>

                {(() => {
                  const byField = new Map<string, typeof education>();
                  for (const group of education) {
                    const field =
                      group.degrees[0]?.degree.match(/ (?:in|-) (.+)$/)?.[1]?.trim() ??
                      group.degrees[0]?.degree ??
                      "";
                    const list = byField.get(field) ?? [];
                    list.push(group);
                    byField.set(field, list);
                  }

                  return Array.from(byField.entries()).map(([field, groups]) => (
                    <div key={field} className="space-y-2">
                      {field ? (
                        <h3 className="mb-2 text-xs font-semibold tracking-wider text-slate-700 uppercase">{field}</h3>
                      ) : null}

                      {groups.map((group) => {
                        const starts = group.degrees.map((d) => d.start_date);
                        const ends = group.degrees.map((d) => d.end_date);
                        const mergedStart = [...starts].sort()[0];
                        const mergedEnd = [...ends].sort().reverse()[0];
                        const dateRange = mergedStart === mergedEnd ? mergedStart : `${mergedStart}-${mergedEnd}`;

                        const msc = group.degrees.find((d) => /^MSc\b/i.test(d.degree));
                        const bsc = group.degrees.find((d) => /^BSc\b/i.test(d.degree));
                        const hasMscAndBsc = msc && bsc;

                        const degreeLines = hasMscAndBsc
                          ? [`MSc${msc.area ? ` (${msc.area})` : ""} & BSc`]
                          : group.degrees.map((d) => {
                            const abbrev = d.degree.includes(" - ") ? d.degree.split(" - ")[0].trim() : d.degree;
                            return abbrev === "Student Exchange" ? "Student Exchange" : abbrev;
                          });

                        return (
                          <div key={`${group.institution}-${group.location}`}>
                            {degreeLines.map((line) => (
                              <p key={line} className="text-xs font-medium text-slate-700">
                                {line}
                              </p>
                            ))}
                            <p className="text-[11px] text-slate-500">
                              {group.institution}
                              {group.location ? `, ${group.location}` : ""}
                            </p>
                            <span className="mt-0.5 block text-[10px] text-slate-400">{dateRange}</span>
                          </div>
                        );
                      })}
                    </div>
                  ));
                })()}
              </section>

              {languages.length > 0 ? (
                <>
                  <hr className="border-slate-300" />
                  <section>
                    <h2 className="mb-3 text-xs tracking-wider text-slate-800 uppercase">Languages:</h2>
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
                </>
              ) : null}
            </aside>
          </div>
        </div>
      </section>

      {experiencePage2.length > 0 ? (
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

            <section>
              <h2 className="mb-2 text-sm font-semibold tracking-wider text-slate-500 uppercase">
                Experience (Continued):
              </h2>

              <div className="space-y-4">
                {experiencePage2.map((item) => (
                  <article
                    key={`${item.company}-${item.position}-${item.start_date ?? ""}`}
                    className="border-b border-slate-100 pb-4 last:border-b-0 last:pb-0 print:break-inside-avoid"
                  >
                    <div className="mb-0.5 flex items-baseline justify-between">
                      <h3 className="text-sm font-semibold text-slate-900">{item.position}</h3>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        {formatRange(item.start_date, item.end_date)}
                      </span>
                    </div>
                    <div className="mb-1.5 flex items-baseline justify-between">
                      <p className="text-xs font-semibold text-slate-600">{item.company}</p>
                      <span className="text-xs text-slate-500">{item.location}</span>
                    </div>

                    {item.projects && item.projects.length > 0 ? (
                      <div className="space-y-3">
                        {item.projects.map((project) => (
                          <section
                            key={project.name}
                            className="border-b border-slate-200 pb-3 last:border-b-0 last:pb-0 print:break-inside-avoid"
                          >
                            <div className="mb-1.5 flex items-baseline justify-between">
                              <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                {project.name}
                              </p>
                              <span className="text-[9px] text-slate-400">
                                {formatRange(project.start_date, project.end_date)}
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
        </section>
      ) : null}
    </div>
  );
}

