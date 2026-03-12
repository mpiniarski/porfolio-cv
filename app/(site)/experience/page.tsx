import { getResumeData } from "@/lib/resumeData";

export default function ExperiencePage() {
  const { cv } = getResumeData();
  const experience = cv.sections?.experience ?? [];

  return (
    <>
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Experience</h1>
        <p className="text-sm text-zinc-600">
          Detailed work history and project highlights.
        </p>
      </section>

      <section className="space-y-5">
        {experience.map((item) => (
          <article
            key={`${item.company}-${item.position}-${item.start_date}`}
            className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
          >
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
            {item.projects && item.projects.length > 0 ? (
              <div className="mt-2 space-y-3 text-xs leading-relaxed text-zinc-700">
                {item.projects.map((project) => (
                  <div key={project.name}>
                    <p className="font-semibold text-zinc-800">
                      {project.name}
                    </p>
                    <ul className="mt-1 list-disc space-y-1 pl-5">
                      {project.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : item.highlights && item.highlights.length > 0 ? (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-relaxed text-zinc-700">
                {item.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </section>
    </>
  );
}

