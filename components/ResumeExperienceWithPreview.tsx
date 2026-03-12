"use client";

import type { CvExperienceItem } from "@/lib/resumeData";

type Props = {
  items: CvExperienceItem[];
};

export function ResumeExperienceWithPreview({ items }: Props) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <article key={`${item.company}-${item.position}`}>
          <header className="text-sm font-medium text-zinc-900">
            <div>
              {item.company} – {item.position}
            </div>
          </header>
          {item.location ? (
            <p className="text-xs text-zinc-600">
              {item.start_date} – {item.end_date ?? "Present"} · {item.location}
            </p>
          ) : null}
          <ul className="mt-1 list-disc space-y-1 pl-5 text-xs leading-relaxed text-zinc-700">
            {item.projects && item.projects.length > 0 ? (
              item.projects.map((project) => (
                <li key={project.name} className="font-semibold text-zinc-800">
                  {project.name}
                  <ul className="mt-1 list-disc space-y-1 pl-5 font-normal text-zinc-700">
                    {project.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </li>
              ))
            ) : (
              (item.highlights ?? []).map((h) => <li key={h}>{h}</li>)
            )}
          </ul>
        </article>
      ))}
    </div>
  );
}

