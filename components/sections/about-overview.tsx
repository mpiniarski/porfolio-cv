"use client";

import { Boxes, Code, Globe, Languages, Server, TestTube } from "lucide-react";

import { sortEducationByEndDateDesc, type CvData } from "@/lib/resumeData";
import { formatDateRange } from "@/lib/dateFormat";
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

function educationAboutTitle(e: CvData["cv"]["education"][number]) {
  if (/^Student Exchange/i.test(e.degree)) return "Student Exchange";
  return e.degree
    .replace(/^MSc\s*-\s*/i, "MSc in ")
    .replace(/^BSc\s*-\s*/i, "BSc in ")
    .trim();
}

function educationAboutShowArea(e: CvData["cv"]["education"][number]) {
  const raw = e.area?.trim();
  if (!raw) return false;
  const fromDegree = e.degree.match(/ (?:in|-) (.+)$/)?.[1]?.trim().toLowerCase() ?? "";
  return fromDegree === "" || raw.toLowerCase() !== fromDegree;
}

export function AboutOverviewSection({ cv }: { cv: CvData["cv"] }) {
  const skillCategories = (cv.skills ?? []).map((s) => {
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

  const spokenLanguages = (cv.languages ?? []).map((l) => parseSpokenLanguage(l.bullet));

  const educationSorted = sortEducationByEndDateDesc(cv.education ?? []);

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
              <div className="space-y-4">
                {educationSorted.map((e) => (
                  <div
                    key={`${e.institution}-${e.degree}-${e.start_date}`}
                    className="border-l-4 border-primary pl-6 py-1.5"
                  >
                    <h4 className="text-xl font-semibold mb-1">{educationAboutTitle(e)}</h4>
                    {educationAboutShowArea(e) ? (
                      <p className="text-base text-muted-foreground mb-2">{e.area}</p>
                    ) : null}
                    <p className="text-lg font-medium mb-1">{e.institution}</p>
                    {e.location ? (
                      <p className="text-sm text-muted-foreground mb-2">{e.location}</p>
                    ) : null}
                    <p className="text-sm text-primary font-medium">
                      {formatDateRange(e.start_date, e.end_date)}
                    </p>
                    {e.thesis?.trim() ? (
                      <p className="text-sm text-muted-foreground mt-2">{e.thesis}</p>
                    ) : null}
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

