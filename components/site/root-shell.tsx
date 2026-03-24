"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { getSiteBuildInfo } from "@/lib/siteBuildInfo";
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
  const buildLoggedRef = useRef(false);

  useEffect(() => {
    if (isResume || buildLoggedRef.current) return;
    buildLoggedRef.current = true;
    const info = getSiteBuildInfo();
    console.info(
      "%cSite build",
      "font-weight: bold",
      {
        version: info.version,
        commit: info.commit,
        commitMessage: info.commitMessage,
        commitDate: info.commitDateLabel,
        builtAt: info.builtAtIso,
      },
    );
  }, [isResume]);

  if (isResume) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader cv={cv} />
      <main className="flex-1 pt-16">{children}</main>
      <SiteFooter cv={cv} />
    </div>
  );
}

