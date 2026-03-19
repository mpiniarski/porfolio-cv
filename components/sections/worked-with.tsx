"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { CvData } from "@/lib/resumeData";
import { Button } from "@/components/ui/button";

type Company = { name: string; logo: string; shortName?: string };

function toAnchorId(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const LOGO_MAX_WIDTH = "100px";
const LOGO_MAX_HEIGHT = "36px";

export function WorkedWithSection({
  cv,
  yearsOfExperience,
  companies,
}: {
  cv: CvData["cv"];
  yearsOfExperience: number | null;
  companies: Company[];
}) {
  const yearsLabel = cv.worked_with?.years_label ?? (yearsOfExperience == null ? "9" : `${yearsOfExperience}`);
  const title = `${yearsLabel}+ years of experience working with companies worldwide`;

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Text */}
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4">{title}</h2>
            <p className="text-muted-foreground text-lg">
              Led frontend development and introduced design systems across global teams in finance, e-commerce, and enterprise software.
            </p>
            <Link href="/experience" className="block mt-6">
              <Button className="w-full sm:w-auto sm:min-w-[280px]" size="lg">
                View My Experience <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Right Side - Logo Grid */}
          <div className="grid grid-cols-3 gap-0">
            {companies.map((company, index) => (
              <Link
                key={company.name}
                href={`/experience#${toAnchorId(company.name)}`}
                className="flex items-center justify-center p-6 lg:p-8 h-[100px] lg:h-[120px] bg-white transition-colors group cursor-pointer"
                style={{
                  borderRight: (index + 1) % 3 !== 0 ? "1px solid hsl(var(--border))" : "none",
                  borderBottom: index < 6 ? "1px solid hsl(var(--border))" : "none",
                }}
              >
                <img
                  src={company.logo}
                  alt={`${company.shortName ?? company.name} logo`}
                  style={{
                    maxWidth: LOGO_MAX_WIDTH,
                    maxHeight: LOGO_MAX_HEIGHT,
                  }}
                  className="object-contain group-hover:scale-110 transition-transform duration-200"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

