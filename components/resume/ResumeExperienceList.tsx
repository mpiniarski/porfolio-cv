"use client";

import type { CvExperienceItem } from "@/lib/resumeData";

type Props = {
  items: CvExperienceItem[];
};

export function ResumeExperienceList({ items }: Props) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <article key={`${item.company}-${item.position}`}>
          <header className="text-sm font-medium text-zinc-900">
            <div>
              {item.company} – {item.position}
            </div>
          </header>
          {item.start_date != null || item.end_date != null || item.location ? (
            <p className="text-xs text-zinc-600">
              {item.start_date != null || item.end_date != null
                ? `${item.start_date ?? "?"} – ${item.end_date ?? "Present"}`
                : ""}
              {item.location != null
                ? (item.start_date != null || item.end_date != null ? " · " : "") + item.location
                : ""}
            </p>
          ) : null}
          {item.projects && item.projects.length > 0 ? (
            <div
              className={
                (item.worked_with?.length ?? 0) > 0
                  ? "mt-2 space-y-2 border-l border-zinc-200 py-0.5 pl-4"
                  : "mt-1"
              }
            >
              <ul
                className={
                  (item.worked_with?.length ?? 0) > 0
                    ? "list-none space-y-2 text-xs leading-relaxed text-zinc-700"
                    : "list-disc space-y-1 pl-5 text-xs leading-relaxed text-zinc-700"
                }
              >
                {item.projects.map((project) => (
                  <li key={project.name} className={(item.worked_with?.length ?? 0) > 0 ? "list-none" : ""}>
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium text-zinc-900">
                        {project.role?.trim() || project.name}
                      </div>
                      {project.role?.trim() ? (
                        <div className="text-xs font-semibold text-zinc-600">{project.name}</div>
                      ) : null}
                    </div>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-xs font-normal leading-relaxed text-zinc-700">
                      {project.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <ul className="mt-1 list-disc space-y-1 pl-5 text-xs leading-relaxed text-zinc-700">
              {(item.highlights ?? []).map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          )}
        </article>
      ))}
    </div>
  );
}
