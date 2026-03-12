import Image from "next/image";
import { getResumeData } from "@/lib/resumeData";

export default function ProjectsPage() {
  const { cv } = getResumeData();
  const projects = cv.projects ?? [];

  return (
    <>
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <p className="text-sm text-zinc-600">
          Personal and side projects. Commercial work is in the Experience section.
        </p>
      </section>

      {projects.length === 0 ? (
        <p className="text-sm text-zinc-600">
          No personal projects listed yet. Add them under a top-level{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">
            projects:
          </code>{" "}
          key in <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">data.yml</code>.
        </p>
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.name}
              className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-base font-semibold tracking-tight">
                  {project.name}
                </h2>
                {project.link ? (
                  <a
                    href={project.link}
                    className="text-xs font-medium text-zinc-600 underline underline-offset-4"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View
                  </a>
                ) : null}
              </div>
              {project.image ? (
                <div className="relative h-32 overflow-hidden rounded-md border border-zinc-200 bg-zinc-50/80">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div
                  className="h-20 rounded-md border border-dashed border-zinc-200 bg-zinc-50/80"
                  aria-hidden="true"
                />
              )}
              <p className="text-sm text-zinc-700">{project.summary}</p>
              {(project.app || project.repo) && (
                <div className="flex flex-wrap gap-3 text-xs">
                  {project.app && (
                    <a
                      href={project.app}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-zinc-700 underline underline-offset-4"
                    >
                      Live app
                    </a>
                  )}
                  {project.repo && (
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-zinc-700 underline underline-offset-4"
                    >
                      Source code
                    </a>
                  )}
                </div>
              )}
              {project.technologies ? (
                <p className="mt-auto text-xs font-medium text-zinc-600">
                  {project.technologies}
                </p>
              ) : null}
            </article>
          ))}
        </section>
      )}
    </>
  );
}

