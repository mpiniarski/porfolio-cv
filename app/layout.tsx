import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

import { getCvData } from "@/lib/cv";
import { RootShell } from "@/components/site/root-shell";

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
        <Analytics />
      </body>
    </html>
  );
}
