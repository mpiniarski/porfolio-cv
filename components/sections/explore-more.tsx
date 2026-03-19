"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";

import type { CvData } from "@/lib/resumeData";
import { getLucideIcon } from "@/components/shared/icon-map";

export function ExploreMoreSection({
  cv,
  excludeHrefs,
}: {
  cv: CvData["cv"];
  excludeHrefs?: string[];
}) {
  const pathname = usePathname();
  const links = [
    { href: "/", icon: "Home", title: "Home", description: "Return to the homepage" },
    {
      href: "/about",
      icon: "User",
      title: "About",
      description: "Get to know more about my skills and background",
    },
    {
      href: "/experience",
      icon: "Briefcase",
      title: "Experience",
      description: "View my detailed work history and career journey",
    },
    {
      href: "/projects",
      icon: "FolderOpen",
      title: "Projects",
      description: "Explore my portfolio of professional and personal work",
    },
    { href: "/contact", icon: "Mail", title: "Contact", description: "Let's discuss opportunities" },
  ];

  const excluded = new Set([pathname, ...(excludeHrefs ?? [])]);
  const displayLinks = links.filter((l) => !excluded.has(l.href));
  const gridClass = displayLinks.length === 3 ? "grid md:grid-cols-3 gap-6" : "grid md:grid-cols-4 gap-6";

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl mb-4">Explore More</h2>
          <p className="text-muted-foreground text-lg">Learn more about my experience, projects, and background</p>
        </div>

        <div className={gridClass}>
          {displayLinks.map((link) => {
            const Icon = getLucideIcon(link.icon);
            return (
              <Link key={link.href} href={link.href} className="h-full">
                <div className="h-full p-6 bg-background border border-border/50 rounded-lg shadow-xl hover:border-primary/30 hover:shadow-2xl transition-all cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          {Icon ? <Icon className="h-5 w-5 text-primary" /> : null}
                        </div>
                        <h3 className="text-lg font-semibold">{link.title}</h3>
                      </div>
                      <p className="text-muted-foreground text-sm">{link.description}</p>
                    </div>
                    <div className="shrink-0 ml-2">
                      <ArrowRight className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

