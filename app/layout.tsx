import type { Metadata } from "next";
import "./globals.css";

import { RootShell } from "@/components/site/root-shell";
import { SiteAnalytics } from "@/components/site/site-analytics";
import { getCvData } from "@/lib/cv";

export function generateMetadata(): Metadata {
  const { cv, derived } = getCvData();
  return {
    title: {
      default: derived.meta.title,
      template: `%s · ${cv.name}`,
    },
    description: derived.meta.description,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { cv } = getCvData();

  return (
    <html lang="en">
      <body className="antialiased">
        <RootShell cv={cv}>{children}</RootShell>
        <SiteAnalytics />
      </body>
    </html>
  );
}
