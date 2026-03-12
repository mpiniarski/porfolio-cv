import { getResumeData } from "@/lib/resumeData";
import { ResumeExperienceWithPreview } from "@/components/ResumeExperienceWithPreview";

export default function ResumePage() {
  const data = getResumeData();
  const { cv, social_networks = [] } = data;
  const intro = cv.sections?.[""] ?? [];
  const experience = cv.sections?.experience ?? [];
  const skills = cv.sections?.skills ?? [];
  const education = cv.sections?.education ?? [];
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
                className="underline decoration-zinc-400 underline-offset-4 hover:text-zinc-900"
              >
                {cv.email}
              </a>
              <span>•</span>
              <a
                href={`tel:${cv.phone.replace(/\s+/g, "")}`}
                className="underline decoration-zinc-400 underline-offset-4 hover:text-zinc-900"
              >
                {cv.phone}
              </a>
              {social_networks.map((item) => (
                <span key={item.network} className="flex items-center gap-1">
                  <span>•</span>
                  <a
                    href={item.username}
                    className="underline decoration-zinc-400 underline-offset-4 hover:text-zinc-900"
                  >
                    {item.network}
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

          <section className="mt-6 space-y-3">
            <h2 className="text-base font-semibold uppercase tracking-wide text-zinc-800">
              Experience
            </h2>
            <ResumeExperienceWithPreview items={experience} />
          </section>

          <section className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-semibold uppercase tracking-wide text-zinc-800">
                  Skills
                </h2>
                <ul className="mt-2 space-y-1 text-xs text-zinc-700">
                  {skills.map((skill) => (
                    <li key={skill.label}>
                      <span className="font-medium">{skill.label}:</span>{" "}
                      <span>{skill.details}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-base font-semibold uppercase tracking-wide text-zinc-800">
                  Languages
                </h2>
                <ul className="mt-2 space-y-1 text-xs text-zinc-700">
                  {languages.map((lang) => (
                    <li key={lang.bullet}>{lang.bullet}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="text-base font-semibold uppercase tracking-wide text-zinc-800">
                  Education
                </h2>
                <div className="mt-2 space-y-2 text-xs text-zinc-700">
                  {education.map((edu) => (
                    <div key={`${edu.institution}-${edu.degree}`}>
                      <p className="font-medium">
                        {edu.degree}, {edu.area}
                      </p>
                      <p>{edu.institution}</p>
                      <p className="text-zinc-600">
                        {edu.location} • {edu.start_date} – {edu.end_date}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </section>
      </div>
    </div>
  );
}

