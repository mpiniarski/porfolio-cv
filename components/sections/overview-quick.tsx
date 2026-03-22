"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";

import { getCoreTechnologies } from "@/lib/coreTechnologies";
import type { CvData } from "@/lib/resumeData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLucideIcon } from "@/components/shared/icon-map";

function formatTopEducation(edu: CvData["cv"]["education"][number] | undefined) {
  if (!edu) return "—";
  const degree = edu.degree
    .replace(/^MSc\s*-\s*/i, "MSc in ")
    .replace(/^BSc\s*-\s*/i, "BSc in ")
    .trim();
  const area = edu.area?.trim();
  return area ? `${degree} - ${area}` : degree;
}

export function OverviewQuickSection({ cv }: { cv: CvData["cv"] }) {
  const topEducation = cv.education?.[0];
  const coreStack = getCoreTechnologies(cv);

  const expertise = [
    { name: "Frontend Development", icon: "Globe" },
    { name: "Design Systems", icon: "Layers" },
    { name: "Component Architecture", icon: "Package" },
    { name: "Performance Optimization", icon: "Zap" },
    { name: "Testing", icon: "TestTube" },
  ];

  return (
    <section className="py-20 px-4 bg-secondary/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-4">Quick Overview</h2>
          <p className="text-muted-foreground text-lg">Key qualifications and expertise</p>
        </div>

        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-border/50 hover:border-primary/30 hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Education</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatTopEducation(topEducation)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/30 hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Full-Stack Development</h3>
                    <p className="text-sm text-muted-foreground">
                      9+ years, frontend-focused with backend expertise
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/50 hover:border-primary/30 hover:shadow-lg transition-all">
            <CardContent className="p-8">
              <h3 className="font-semibold text-lg mb-6 text-center">Core Technologies</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
                {coreStack.map((tech) => (
                  <div key={tech.name} className="flex flex-col items-center gap-3 group">
                    <div className="w-16 h-16 flex items-center justify-center rounded-lg bg-background border border-border/50 group-hover:border-primary/30 transition-all group-hover:shadow-md">
                      <Image
                        src={tech.logo}
                        alt={tech.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 object-contain"
                        style={{ filter: tech.invert_logo ? "invert(1)" : "none" }}
                      />
                    </div>
                    <span className="font-medium text-sm">{tech.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:border-primary/30 hover:shadow-lg transition-all">
            <CardContent className="p-8">
              <h3 className="font-semibold text-lg mb-6 text-center">Main Expertise</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {expertise.map((item) => {
                  const Icon = getLucideIcon(item.icon) ?? null;
                  return (
                    <div
                      key={item.name}
                      className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors"
                    >
                      {Icon ? <Icon className="h-6 w-6 text-primary shrink-0" /> : null}
                      <span className="text-sm font-medium text-center">{item.name}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mt-12">
          <p className="text-muted-foreground">
            Want to know more about my background, skills, and what I can bring to your team? Check out my detailed
            profile.
          </p>
          <Button size="lg" className="px-8 whitespace-nowrap" asChild>
            <Link href="/about">
              Learn More About Me <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

