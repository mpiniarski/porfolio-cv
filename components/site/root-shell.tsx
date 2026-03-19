"use client";

import { usePathname } from "next/navigation";

import type { CvData } from "@/lib/resumeData";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function RootShell({
  cv,
  children,
}: {
  cv: CvData["cv"];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isResume = pathname === "/resume" || pathname.startsWith("/resume/");

  if (isResume) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader cv={cv} />
      <main className="flex-1 pt-16">{children}</main>
      <SiteFooter cv={cv} />
    </div>
  );
}

