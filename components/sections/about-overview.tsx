"use client";

import { Boxes, Code, Globe, Languages, Server, TestTube } from "lucide-react";

import type { CvData } from "@/lib/resumeData";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function splitDotList(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split("·")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseSpokenLanguage(bullet: string): { name: string; level: string } {
  const m = bullet.match(/^(.+?)\s*\((.+?)\)\s*$/);
  if (!m) return { name: bullet, level: "" };
  return { name: m[1].trim(), level: m[2].trim() };
}

export function AboutOverviewSection({ cv }: { cv: CvData["cv"] }) {
  const skillCategories = (cv.sections?.skills ?? []).map((s) => {
    const title = s.label;
    const icon =
      s.label === "Languages"
        ? Code
        : s.label === "Frontend"
          ? Globe
          : s.label === "Architecture"
            ? Boxes
            : s.label === "Testing"
              ? TestTube
              : Server;
    return {
      icon,
      title,
      skills: splitDotList(s.details),
    };
  });

  const spokenLanguages = (cv.sections?.languages ?? []).map((l) => parseSpokenLanguage(l.bullet));

  const education = cv.sections?.education ?? [];
  const poznan = education.filter((e) => e.institution === "Poznań University of Technology");
  const exchange = education.filter((e) => e.institution !== "Poznań University of Technology");

  const poznanStart = poznan.map((e) => Number(String(e.start_date).slice(0, 4))).filter(Number.isFinite);
  const poznanEnd = poznan.map((e) => Number(String(e.end_date).slice(0, 4))).filter(Number.isFinite);
  const poznanPeriod =
    poznanStart.length && poznanEnd.length
      ? `${Math.min(...poznanStart)}-${Math.max(...poznanEnd)}`
      : undefined;

  const msc = poznan.find((e) => /^MSc\b/i.test(e.degree));
  const bsc = poznan.find((e) => /^BSc\b/i.test(e.degree));

  return (
    <>
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">Skills</h2>
            <p className="text-muted-foreground text-lg">Technical expertise and core competencies</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.title} className="h-full hover:shadow-lg transition-shadow border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Icon className="h-6 w-6 text-primary" />
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="bg-primary/10 text-foreground border border-primary/20 hover:bg-primary/20 transition-colors"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-secondary/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">Education & Languages</h2>
            <p className="text-muted-foreground text-lg">Academic background and language proficiency</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <Languages className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold">Education</h3>
              </div>
              <div className="space-y-6">
                <div className="border-l-4 border-primary pl-6 py-2">
                  {msc ? (
                    <>
                      <h4 className="text-xl font-semibold mb-1">MSc in Computer Science</h4>
                      {msc.area ? <p className="text-base text-muted-foreground mb-2">{msc.area}</p> : null}
                    </>
                  ) : null}
                  {bsc ? <p className="text-base text-muted-foreground mb-2">BSc in Computer Science</p> : null}
                  <p className="text-lg font-medium mb-1">Poznań University of Technology</p>
                  {poznanPeriod ? <p className="text-sm text-primary font-medium">{poznanPeriod}</p> : null}
                </div>

                {exchange.map((e) => (
                  <div key={`${e.institution}-${e.degree}`} className="border-l-4 border-primary pl-6 py-2">
                    <h4 className="text-lg font-semibold mb-1">
                      {e.degree.startsWith("Student Exchange") ? "Student Exchange" : e.degree}
                    </h4>
                    {e.area ? <p className="text-sm text-muted-foreground mb-1">{e.area}</p> : null}
                    <p className="text-base text-muted-foreground mb-2">
                      {e.institution}
                      {e.location ? `, ${e.location}` : ""}
                    </p>
                    <p className="text-sm text-primary font-medium">
                      {e.start_date}-{e.end_date}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <Languages className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium text-muted-foreground">Spoken Languages</h3>
              </div>
              <div className="space-y-3">
                {spokenLanguages.map((lang) => (
                  <div
                    key={lang.name}
                    className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/30"
                  >
                    <span className="text-sm font-medium">{lang.name}</span>
                    {lang.level ? (
                      <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                        {lang.level}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

