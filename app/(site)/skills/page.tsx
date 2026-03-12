import { getResumeData } from "@/lib/resumeData";

export default function SkillsPage() {
  const { cv } = getResumeData();
  const skills = cv.sections?.skills ?? [];
  const languages = cv.sections?.languages ?? [];
  const education = cv.sections?.education ?? [];

  return (
    <>
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
            <ul className="mt-2 space-y-2 text-sm text-zinc-800">
              {education.map((edu) => (
                <li key={`${edu.institution}-${edu.degree}-${edu.start_date}`}>
                  <span className="font-medium">
                    {edu.degree}{edu.area ? ` (${edu.area})` : ""}
                  </span>
                  {" · "}
                  {edu.institution}
                  {" · "}
                  <span className="text-zinc-600">
                    {edu.location} · {edu.start_date} – {edu.end_date}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

