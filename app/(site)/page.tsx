import Link from "next/link";
import { getResumeData } from "@/lib/resumeData";
import { WorkedWithCarousel } from "@/components/worked-with-carousel";

export default function Home() {
  const { cv } = getResumeData();
  const intro = cv.sections?.[""] ?? [];
  const experience = cv.sections?.experience ?? [];
  const skills = cv.sections?.skills ?? [];
  const education = cv.sections?.education ?? [];
  const typicallyHelpWith = cv.sections?.typically_help_with ?? [];

  const totalYears =
    experience.length > 0
      ? (() => {
        const withDate = experience.filter((e) => e.start_date != null);
        if (withDate.length === 0) return null;
        const earliest = withDate[withDate.length - 1];
        const startYear = Number(earliest.start_date!.slice(0, 4));
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
    <>
      <section className="grid gap-6 rounded-xl border border-zinc-200 bg-white/80 p-5 shadow-sm md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:items-start">
        <div className="space-y-3">
          {intro[0] && (
            <p className="text-sm leading-relaxed text-zinc-700">
              {intro[0]}
            </p>
          )}
          {typicallyHelpWith.length > 0 && (
            <div className="space-y-1.5 text-sm text-zinc-700">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                I typically help with
              </p>
              <ul className="space-y-1 text-sm">
                {typicallyHelpWith.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/experience"
              className="inline-flex items-center justify-center rounded-full border border-zinc-900 bg-zinc-900 px-4 py-1.5 text-sm font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800"
            >
              View experience
            </Link>
            <a
              href="/cv.pdf"
              download="cv.pdf"
              className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 px-4 py-1.5 text-sm font-medium text-zinc-800 transition hover:bg-white"
            >
              View CV
            </a>
            <a
              href={`mailto:${cv.email}`}
              className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 px-4 py-1.5 text-sm font-medium text-zinc-800 transition hover:bg-white"
            >
              Contact by email
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
          <div className="rounded-lg border border-zinc-200 bg-zinc-50/80 px-3 py-2.5">
            <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">
              Focus
            </p>
            <p className="text-sm font-semibold text-zinc-900">
              Data-heavy UIs & design systems
            </p>
          </div>
          <div
            className="rounded-lg border border-zinc-200 bg-zinc-50/80 px-3 py-2.5"
            title={
              experience.length > 0 && experience[experience.length - 1].start_date
                ? `From start of earliest role (${experience[experience.length - 1].start_date!.slice(0, 4)}) to current year`
                : undefined
            }
          >
            <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">
              Years in industry
            </p>
            <p className="text-lg font-semibold text-zinc-900">
              {totalYears ?? "9+"}
            </p>
          </div>
          {education[0] && (
            <div className="rounded-lg border border-zinc-200 bg-zinc-50/80 px-3 py-2.5">
              <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">
                Education
              </p>
              <p className="text-sm font-semibold text-zinc-900">
                {education[0].degree}
              </p>
            </div>
          )}
          {cv.location && (
            <div className="rounded-lg border border-zinc-200 bg-zinc-50/80 px-3 py-2.5">
              <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">
                Location
              </p>
              <p className="text-sm font-semibold text-zinc-900">
                {cv.location}
              </p>
            </div>
          )}
        </div>
      </section>

      {keyStrengths.length > 0 && (
        <section className="space-y-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Key strengths
            </h2>
            <Link
              href="/skills"
              className="text-xs font-medium text-zinc-600 underline underline-offset-4 hover:text-zinc-900"
            >
              View all skills
            </Link>
          </div>
          <ul className="grid gap-3 text-sm text-zinc-800 md:grid-cols-3">
            {keyStrengths.map((skill) => (
              <li
                key={skill.label}
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 transition hover:-translate-y-0.5 hover:shadow-sm"
              >
                <p className="font-medium">{skill.label}</p>
                <p className="text-xs text-zinc-700">{skill.details}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {experience.length > 0 && (() => {
        const companies = experience.flatMap((item) => [
          item.company,
          ...(item.worked_with ?? []),
        ]);
        return (
          <section className="space-y-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                Worked with
              </h2>
              <Link
                href="/experience"
                className="text-xs font-medium text-zinc-600 underline underline-offset-4 hover:text-zinc-900"
              >
                View full experience
              </Link>
            </div>
            <WorkedWithCarousel companies={companies} />
          </section>
        );
      })()}

      <section className="grid gap-4 rounded-xl border border-zinc-200 bg-white/80 p-5 shadow-sm md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="font-medium text-zinc-800">Open for job opportunities</p>
          <p className="mt-1 text-xs leading-relaxed text-zinc-600">
            I am open to senior frontend roles focused on complex, data-heavy products and teams that invest in design systems, component architecture, and developer experience. Prefer Warsaw-based or remote-friendly positions in Europe. Available to start in the coming months—reach out to discuss timing and fit.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/cv.pdf"
            download="cv.pdf"
            className="inline-flex items-center justify-center rounded-full border border-zinc-900 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800"
          >
            View CV
          </a>
          <a
            href={`mailto:${cv.email}`}
            className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-800 transition hover:bg-white hover:border-zinc-300"
          >
            Contact
          </a>
        </div>
      </section>

    </>
  );
}

