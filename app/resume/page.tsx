import { getResumeData, groupEducationByInstitution, shortUrl } from "@/lib/resumeData";
import { ResumeExperienceWithPreview } from "@/components/ResumeExperienceWithPreview";

const PRIMARY_EXPERIENCE_COUNT = 2;

export default function ResumePage() {
  const data = getResumeData();
  const { cv } = data;
  const social_networks = cv.social_networks ?? [];
  const intro = cv.sections?.[""] ?? [];
  const experience = cv.sections?.experience ?? [];
  const experiencePage1 = experience.slice(0, PRIMARY_EXPERIENCE_COUNT);
  const experiencePage2 = experience.slice(PRIMARY_EXPERIENCE_COUNT);
  const skills = cv.sections?.skills ?? [];
  const education = groupEducationByInstitution(cv.sections?.education ?? []);
  const languages = cv.sections?.languages ?? [];

  return (
    <div className="min-h-screen bg-zinc-200 text-zinc-900">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <section className="resume-page relative">
          <header className="border-b border-zinc-200 pb-4">
            <h1 className="text-3xl font-semibold tracking-tight">
              {cv.name}
            </h1>
            <p className="text-lg text-zinc-700">{cv.headline}</p>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-zinc-600">
              <span>{cv.location}</span>
              <span>•</span>
              <a
                href={`mailto:${cv.email}`}
                className="underline decoration-zinc-400 underline-offset-4 hover:text-zinc-900 print:no-underline"
              >
                {cv.email}
              </a>
              {social_networks.map((item: { network: string; username: string }) => (
                <span key={item.network} className="flex items-center gap-1">
                  <span>•</span>
                  <a
                    href={item.username}
                    className="underline decoration-zinc-400 underline-offset-4 hover:text-zinc-900 print:no-underline"
                  >
                    {shortUrl(item.username)}
                  </a>
                </span>
              ))}
            </div>
          </header>

          <section className="mt-4 text-sm leading-relaxed text-zinc-700">
            {intro.map((paragraph, idx) => (
              <p key={idx} className={idx > 0 ? "mt-2" : undefined}>
                {paragraph}
              </p>
            ))}
          </section>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[2fr_1fr] print:grid-cols-[2fr_1fr]">
            <div>
              <section className="space-y-3">
                <h2 className="text-base font-semibold uppercase tracking-wide text-zinc-800">
                  Experience
                </h2>
                <ResumeExperienceWithPreview items={experiencePage1} />
              </section>
            </div>

            <div className="space-y-6">
              <section>
                <h2 className="text-base font-semibold uppercase tracking-wide text-zinc-800">
                  Skills
                </h2>
                <ul className="mt-2 space-y-2 text-xs text-zinc-700">
                  {skills.map((skill) => (
                    <li key={skill.label} className="space-y-0.5">
                      <div className="font-semibold uppercase tracking-wide text-zinc-800">
                        {skill.label}
                      </div>
                      <div>{skill.details}</div>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-base font-semibold uppercase tracking-wide text-zinc-800">
                  Education
                </h2>
                <div className="mt-2 space-y-3 text-xs text-zinc-700">
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
                      <div key={field} className="space-y-1.5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-800">
                          {field}
                        </p>
                        {groups.map((group) => {
                          const starts = group.degrees.map((d) => d.start_date);
                          const ends = group.degrees.map((d) => d.end_date);
                          const mergedStart = [...starts].sort()[0];
                          const mergedEnd = [...ends].sort().reverse()[0];
                          const dateRange =
                            mergedStart === mergedEnd
                              ? mergedStart
                              : `${mergedStart}–${mergedEnd}`;
                          const degreeLines = group.degrees.map((d) => {
                            const abbrev = d.degree.includes(" - ")
                              ? d.degree.split(" - ")[0].trim()
                              : d.degree;
                            const degreeSubject =
                              d.degree.match(/ (?:in|-) (.+)$/)?.[1]?.trim();
                            const showArea = d.area && degreeSubject !== d.area;
                            return showArea ? `${abbrev} (${d.area})` : abbrev;
                          });
                          return (
                            <div
                              key={group.institution}
                              className="space-y-0.5 pl-0"
                            >
                              {degreeLines.map((line) => (
                                <p key={line}>{line}</p>
                              ))}
                              <p className="text-zinc-600">
                                {group.institution}, {group.location} · {dateRange}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    ));
                  })()}
                </div>
              </section>

              {languages.length > 0 && (
                <section>
                  <h2 className="text-base font-semibold uppercase tracking-wide text-zinc-800">
                    Languages
                  </h2>
                  <ul className="mt-2 space-y-1 text-xs text-zinc-700">
                    {languages.map((lang) => (
                      <li key={lang.bullet}>{lang.bullet}</li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>

          <div className="print:break-after-page" aria-hidden="true" />

          {experiencePage2.length > 0 && (
            <section className="mt-6 space-y-3 print:mt-0">
              <h2 className="text-base font-semibold uppercase tracking-wide text-zinc-800">
                Experience (continued)
              </h2>
              <ResumeExperienceWithPreview items={experiencePage2} />
            </section>
          )}
        </section>
      </div>
    </div>
  );
}

