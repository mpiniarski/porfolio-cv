import Link from "next/link";
import { getResumeData } from "@/lib/resumeData";
import { WorkedWithCarousel } from "@/components/worked-with-carousel";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

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

  const companies =
    experience.length > 0
      ? experience.flatMap((item) => [item.company, ...(item.worked_with ?? [])])
      : [];

  return (
    <>
      {/* HERO */}
        <section className="grid gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:items-center">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/60 px-3 py-1 text-xs font-medium text-indigo-700 shadow-sm backdrop-blur">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.35)]" />
              Open for senior frontend roles
            </p>

            <div className="space-y-3">
              <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                {cv.headline}
              </h1>
              {intro[0] && (
                <p className="max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                  {intro[0]}
                </p>
              )}
            </div>

            {typicallyHelpWith.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  I typically help with
                </p>
                <ul className="grid gap-1 text-sm text-slate-700 sm:grid-cols-2">
                  {typicallyHelpWith.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 rounded-xl border border-slate-100 bg-white/70 px-3 py-2 shadow-sm shadow-slate-100/60 backdrop-blur"
                    >
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/experience"
                className={cn(buttonVariants({ size: "lg" }))}
              >
                View experience
              </Link>
              <a
                href="/cv.pdf"
                download="cv.pdf"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                )}
              >
                View CV
              </a>
              <a
                href={`mailto:${cv.email}`}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                )}
              >
                Contact by email
              </a>
            </div>
          </div>

          {/* Metrics / social proof card */}
          <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <MetricCard
                label="Years in industry"
                value={totalYears ?? "9+"}
                tooltip={
                  experience.length > 0 &&
                  experience[experience.length - 1].start_date
                    ? `From start of earliest role (${experience[experience.length - 1].start_date!.slice(0, 4)}) to current year`
                    : undefined
                }
              />
              <MetricCard
                label="Focus"
                value="Data-heavy UIs & design systems"
              />
              {cv.location && (
                <MetricCard label="Location" value={cv.location} />
              )}
              {education[0] && (
                <MetricCard
                  label="Education"
                  value={education[0].degree}
                  className="col-span-2 sm:col-span-3"
                />
              )}
            </div>
          </div>
        </section>

        {/* KEY STRENGTHS */}
        {keyStrengths.length > 0 && (
          <section className="mt-14 space-y-4">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Key strengths
              </p>
              <p className="mt-1 text-sm text-slate-600">
                What I usually bring to complex frontend teams.
              </p>
            </div>
            <Link
              href="/skills"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              View all skills
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {keyStrengths.map((skill) => (
              <div
                key={skill.label}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-[0_14px_35px_rgba(15,23,42,0.08)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_rgba(79,70,229,0.25)]"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute -inset-20 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.2),transparent_55%)]" />
                </div>
                <div className="relative space-y-2">
                  <p className="text-sm font-semibold text-slate-900">
                    {skill.label}
                  </p>
                  <p className="text-xs leading-relaxed text-slate-600">
                    {skill.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
        )}

        {/* WORKED WITH / CAROUSEL */}
        {companies.length > 0 && (
          <section className="mt-14 space-y-4">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Worked with
              </p>
              <p className="mt-1 text-sm text-slate-600">
                A sample of companies and teams I&apos;ve helped ship for.
              </p>
            </div>
            <Link
              href="/experience"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              View full experience
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-[0_20px_45px_rgba(15,23,42,0.08)]">
            <WorkedWithCarousel companies={companies} />
          </div>
        </section>
        )}

        {/* CTA BAND */}
        <section className="mt-14 relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 px-5 py-6 text-slate-50 shadow-[0_24px_60px_rgba(30,64,175,0.7)] sm:px-7 sm:py-7 md:px-8 md:py-8">
          <div className="pointer-events-none absolute inset-0 opacity-60">
            <div className="absolute -left-10 top-0 h-40 w-40 rounded-full bg-[radial-gradient(circle_at_center,rgba(248,250,252,0.35),transparent_65%)] blur-2xl" />
            <div className="absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.4),transparent_65%)] blur-2xl" />
          </div>
          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-100/90">
                Open to opportunities
              </p>
              <p className="text-sm font-medium sm:text-base">
                I&apos;m looking for senior frontend roles on teams that care
                about craft, performance, and great internal tools.
              </p>
              <p className="text-xs leading-relaxed text-indigo-100/90 sm:text-[13px]">
                Complex, data-heavy products, design systems, and component
                architecture are where I&apos;m most useful. Prefer Warsaw or
                remote-friendly teams in Europe.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/cv.pdf"
                download="cv.pdf"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-white text-indigo-700 hover:bg-slate-100",
                )}
              >
                View CV
              </a>
              <a
                href={`mailto:${cv.email}`}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-indigo-200/80 bg-indigo-500/20 text-indigo-50 hover:bg-indigo-400/40",
                )}
              >
                Contact
              </a>
            </div>
          </div>
        </section>
    </>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  tooltip?: string;
  className?: string;
}

function MetricCard({ label, value, tooltip, className }: MetricCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/80 p-3 shadow-sm shadow-slate-100/80 backdrop-blur transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.12)] ${className ?? ""
        }`}
      title={tooltip}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-indigo-100/60 via-transparent to-transparent opacity-60" />
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-base font-semibold text-slate-900 sm:text-lg">
        {value}
      </p>
    </div>
  );
}
