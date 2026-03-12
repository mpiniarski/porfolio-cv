import { SiteHeader } from "@/components/site-header";
import { getResumeData } from "@/lib/resumeData";

export default function SkillsPage() {
  const { cv, social_networks = [], projects = [] } = getResumeData();
  const skills = cv.sections?.skills ?? [];
  const languages = cv.sections?.languages ?? [];
  const education = cv.sections?.education ?? [];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <main className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12">
        <SiteHeader
          cv={cv}
          social_networks={social_networks}
          tagline="Senior frontend engineer focused on data-heavy UIs, design systems, and performance in modern React/TypeScript ecosystems."
          showProjectsNav={projects.length > 0}
        />

        <section className="space-y-8">
          <header className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Skills, education & languages
            </h1>
            <p className="text-sm text-zinc-600">
              A concise overview of your technical stack, academic background and language proficiency.
            </p>
          </header>

          <div className="space-y-6">
            <div>
              <h2 className="text-base font-semibold tracking-tight">
                Skills
              </h2>
              <ul className="mt-2 space-y-2 text-sm text-zinc-800">
                {skills.map((skill) => (
                  <li key={skill.label}>
                    <span className="font-medium">{skill.label}:</span>{" "}
                    <span>{skill.details}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-base font-semibold tracking-tight">
                Languages
              </h2>
              <ul className="mt-2 space-y-1 text-sm text-zinc-800">
                {languages.map((lang) => (
                  <li key={lang.bullet}>{lang.bullet}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-base font-semibold tracking-tight">
                Education
              </h2>
              <div className="mt-2 space-y-4 text-sm text-zinc-800">
                {education.map((edu) => (
                  <article
                    key={`${edu.institution}-${edu.degree}-${edu.start_date}`}
                    className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
                  >
                    <p className="font-medium">
                      {edu.degree}, {edu.area}
                    </p>
                    <p>{edu.institution}</p>
                    <p className="text-xs text-zinc-600">
                      {edu.location} • {edu.start_date} – {edu.end_date}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

