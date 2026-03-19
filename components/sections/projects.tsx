"use client";

import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";

import type { CvData } from "@/lib/resumeData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProjectsSection({
  projects,
  title,
  description,
}: {
  projects: NonNullable<CvData["cv"]["projects"]>;
  title?: string;
  description?: string;
}) {
  return (
    <section id="projects" className="py-20 px-4 bg-secondary/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl">{title ?? "Featured Projects"}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {description ?? "Personal projects showcasing frontend development skills and modern web technologies."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => {
            const tech = project.technologies
              ? project.technologies.split("·").map((t) => t.trim()).filter(Boolean)
              : [];

            return (
              <Card
                key={project.name}
                className="overflow-hidden border-border/50 hover:border-primary/30 transition-all"
              >
                <div className="aspect-video overflow-hidden bg-linear-to-br from-background to-primary/5 relative">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={`${project.name} preview`}
                      fill
                      sizes="(min-width: 1024px) 384px, (min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{project.summary}</p>
                  {tech.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {tech.map((t) => (
                        <Badge
                          key={t}
                          variant="secondary"
                          className="bg-primary/10 text-foreground border border-primary/20"
                        >
                          {t}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                  <div className="flex gap-2 pt-2">
                    {project.repo ? (
                      <Button variant="outline" size="sm" className="gap-2" asChild>
                        <a href={project.repo} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4" />
                          Code
                        </a>
                      </Button>
                    ) : null}
                    {project.app || project.link ? (
                      <Button size="sm" className="gap-2" asChild>
                        <a href={project.app ?? project.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                          Demo
                        </a>
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

