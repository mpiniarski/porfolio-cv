import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { getResumeData } from "@/lib/resumeData";

export default function Home() {
  const { cv, social_networks = [], projects = [] } = getResumeData();
  const intro = cv.sections?.[""] ?? [];
  const experience = cv.sections?.experience ?? [];
  const skills = cv.sections?.skills ?? [];
  const education = cv.sections?.education ?? [];

  const totalYears =
    experience.length > 0
      ? (() => {
          const first = experience[experience.length - 1];
          const startYear = Number(first.start_date.slice(0, 4));
          const nowYear = new Date().getFullYear();
          const years = nowYear - startYear;
          return years >= 10 ? `${years}+` : `${years}`;
        })()
      : null;

  const keyStrengths = skills
    .filter(
      (skill) =>
        skill.label !== "Languages" && skill.label !== "Backend (Supporting)",
    )
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <main className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-12">
        <SiteHeader
          cv={cv}
          social_networks={social_networks}
          tagline="Senior frontend engineer focused on data-heavy UIs, design systems, and performance in modern React/TypeScript ecosystems."
          showProjectsNav={projects.length > 0}
        />

        <section className="space-y-3">
          {intro.map((paragraph, idx) => (
            <p
              key={idx}
              className="text-sm leading-relaxed text-zinc-700"
            >
              {paragraph}
            </p>
          ))}

          {education[0] && (
            <p className="text-sm font-medium text-zinc-800">
              {education[0].degree} ({education[0].area}) from{" "}
              {education[0].institution}.
            </p>
          )}
        </section>

        {keyStrengths.length > 0 && (
          <section className="space-y-3">
            <ul className="grid gap-3 text-sm text-zinc-800 md:grid-cols-3">
              {keyStrengths.map((skill) => (
                <li
                  key={skill.label}
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-2"
                >
                  <p className="font-medium">{skill.label}</p>
                  <p className="text-xs text-zinc-700">{skill.details}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="space-y-3">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-xl font-semibold tracking-tight">
              Experience{totalYears ? ` (${totalYears} years)` : ""}
            </h2>
          </div>
          <div className="space-y-4">
            {experience.slice(0, 3).map((item) => {
              const previewHighlights =
                item.projects && item.projects.length > 0
                  ? item.projects
                      .map((project) =>
                        project.highlights[0]
                          ? `${project.name}: ${project.highlights[0]}`
                          : null,
                      )
                      .filter(Boolean)
                      .slice(0, 3)
                  : item.highlights?.slice(0, 3) ?? [];

              return (
                <article key={`${item.company}-${item.position}`}>
                  <header className="flex flex-wrap justify-between gap-1 text-sm font-medium text-zinc-900">
                    <span>
                      {item.position} • {item.company}
                    </span>
                    <span className="text-xs font-normal text-zinc-600">
                      {item.start_date} – {item.end_date ?? "Present"}
                    </span>
                  </header>
                  {item.location ? (
                    <p className="text-xs text-zinc-600">{item.location}</p>
                  ) : null}
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-xs leading-relaxed text-zinc-700">
                    {previewHighlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
          <div className="pt-1">
            <Link
              href="/experience"
              className="text-xs font-medium text-zinc-600 underline underline-offset-4"
            >
              View full experience
            </Link>
          </div>
        </section>

        <section className="mt-2 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-800">
          <p className="font-medium">
            Open to senior frontend roles (Warsaw / Remote).
          </p>
          <p className="mt-1 text-xs text-zinc-600">
            If you&apos;re hiring for data-heavy products, design systems or
            complex frontend platforms, feel free to reach out by email or via
            LinkedIn.
          </p>
        </section>
      </main>
    </div>
  );
}
