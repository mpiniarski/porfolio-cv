"use client";

import Link from "next/link";

import type { CvData } from "@/lib/resumeData";

export function SiteFooter({ cv }: { cv: CvData["cv"] }) {
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Experience", href: "/experience" },
    { label: "Work", href: "/projects" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <footer className="bg-secondary/10 py-12 px-4 mt-auto">
      <div className="max-w-4xl mx-auto text-center">
        <p className="mb-4 text-lg font-semibold tracking-tight">{cv.name}</p>
        <p className="text-muted-foreground mb-6">{cv.footer_tagline ?? cv.headline}</p>
        <div className="flex justify-center gap-6 mb-6">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {cv.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

