import type { Metadata } from "next";
import "./globals.css";

import { getCvData } from "@/lib/cv";
import { RootShell } from "@/components/site/root-shell";

export function generateMetadata(): Metadata {
  const { derived } = getCvData();
  return { title: derived.meta.title, description: derived.meta.description };
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
      </body>
    </html>
  );
}
