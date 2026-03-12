"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface SiteHeaderProps {
  cv: {
    name: string;
    headline: string;
    location: string;
    email: string;
    phone: string;
  };
  social_networks: Array<{ network: string; username: string }>;
  /** Optional tagline shown under headline (e.g. on homepage). Omit on resume. */
  tagline?: string;
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
  social_networks,
  tagline,
  showProjectsNav = true,
}: SiteHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="flex flex-col gap-2 border-b border-zinc-200 pb-6">
      <h1 className="text-3xl font-semibold tracking-tight">{cv.name}</h1>
      <p className="text-lg text-zinc-700">{cv.headline}</p>
      {tagline ? (
        <p className="text-sm text-zinc-600">{tagline}</p>
      ) : null}
      <div className="mt-2 flex flex-wrap gap-3 text-sm text-zinc-600">
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
