"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface SiteHeaderProps {
  cv: {
    name: string;
    headline: string;
    location?: string;
  };
  /** When false, hide the Projects nav item (e.g. if there are no projects). */
  showProjectsNav?: boolean;
}

const NAV_ITEMS: Array<{ href: string; label: string }> = [
  { href: "/", label: "Overview" },
  { href: "/experience", label: "Experience" },
  { href: "/skills", label: "Skills, education & languages" },
  { href: "/projects", label: "Projects" },
];

export function SiteHeader({
  cv,
  showProjectsNav = true,
}: SiteHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="flex flex-col gap-2 border-b border-zinc-200 pb-6">
      <h1 className="text-3xl font-semibold tracking-tight">{cv.name}</h1>
      <p className="text-lg text-zinc-700">{cv.headline}</p>
      <nav className="mt-4 flex flex-wrap gap-3 text-sm" aria-label="Main">
        {NAV_ITEMS.filter((item) =>
          item.href === "/projects" ? showProjectsNav : true,
        ).map(({ href, label }) => {
          const isActive =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={
                isActive
                  ? "rounded-full border border-zinc-300 bg-zinc-900 px-4 py-1.5 font-medium text-zinc-50 hover:bg-zinc-800"
                  : "rounded-full border border-zinc-200 px-4 py-1.5 text-zinc-700 hover:bg-white/80 hover:border-zinc-300"
              }
              aria-current={isActive ? "page" : undefined}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
