import { SiteHeader } from "@/components/site-header";
import { getResumeData } from "@/lib/resumeData";

export default function ProjectsPage() {
  const { cv, social_networks = [], projects = [] } = getResumeData();

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <main className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12">
        <SiteHeader
          cv={cv}
          social_networks={social_networks}
          tagline="Senior frontend engineer focused on data-heavy UIs, design systems, and performance in modern React/TypeScript ecosystems."
          showProjectsNav={projects.length > 0}
        />

        <section className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="text-sm text-zinc-600">
            Personal and side projects beyond the CV.
          </p>
        </section>

        {projects.length === 0 ? (
          <p className="text-sm text-zinc-600">
            No projects defined yet. Add them under a top-level{" "}
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
                className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
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
                <p className="text-sm text-zinc-700">{project.summary}</p>
                {project.technologies ? (
                  <p className="text-xs text-zinc-600">
                    {project.technologies}
                  </p>
                ) : null}
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

