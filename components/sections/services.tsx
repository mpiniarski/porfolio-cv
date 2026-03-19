"use client";

import type { CvData } from "@/lib/resumeData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLucideIcon } from "@/components/shared/icon-map";

export function ServicesSection({ cv }: { cv: CvData["cv"] }) {
  const items = cv.services ?? [];
  const yearsLabel = cv.worked_with?.years_label ? `${cv.worked_with.years_label}+` : "9+";

  return (
    <section className="py-20 px-4 bg-secondary/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-4">Services I Provide</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Leveraging {yearsLabel} years of experience to help organizations build exceptional frontend experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((service) => {
            const Icon = getLucideIcon(service.icon) ?? null;
            return (
              <Card
                key={service.title}
                className="h-full hover:shadow-lg transition-shadow border-border/50 hover:border-primary/30"
              >
                <CardHeader className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                      {Icon ? <Icon className="h-8 w-8 text-primary" /> : null}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground text-sm">{service.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

