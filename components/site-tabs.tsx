"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface TabPillProps {
  href: string;
  children: React.ReactNode;
  matchPrefix?: boolean;
}

interface SiteTabsProps {}

export function SiteTabs(_props: SiteTabsProps) {
  const pathname = usePathname() || "/";

  return (
    <nav className="flex flex-wrap gap-2 rounded-full border border-slate-200 bg-white/80 px-1.5 py-1 text-xs font-medium text-slate-600 shadow-sm shadow-slate-100">
      <TabPill href="/" matchPrefix pathname={pathname}>
        Overview
      </TabPill>
      <TabPill href="/experience" matchPrefix pathname={pathname}>
        Experience
      </TabPill>
      <TabPill href="/skills" matchPrefix pathname={pathname}>
        Skills, education &amp; languages
      </TabPill>
      <TabPill href="/projects" matchPrefix pathname={pathname}>
        Projects
      </TabPill>
    </nav>
  );
}

interface InternalTabPillProps extends TabPillProps {
  pathname: string;
}

function TabPill({ children, href, matchPrefix, pathname }: InternalTabPillProps) {
  const isActive = matchPrefix
    ? pathname === href || pathname.startsWith(href + "/")
    : pathname === href;

  const base =
    "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs sm:text-[13px] transition-colors";

  if (isActive) {
    return (
      <span className={`${base} bg-slate-900 text-slate-50 shadow-sm`}>
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={`${base} text-slate-600 hover:bg-slate-100 hover:text-slate-900`}
    >
      {children}
    </Link>
  );
}

