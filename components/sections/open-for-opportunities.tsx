import { MapPin } from "lucide-react";

import type { CvData } from "@/lib/resumeData";
import { DownloadCVButton } from "@/components/DownloadCVButton";
import { Card, CardContent } from "@/components/ui/card";

export function OpenForOpportunitiesSection({ cv }: { cv: CvData["cv"] }) {
  const opp = cv.open_for_opportunities_section;
  if (!opp?.bullets?.length) return null;

  return (
    <section className="px-4 pb-16 pt-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <Card className="border-primary/20 bg-primary/5 shadow-lg">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-primary">
                Open for Opportunities
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                <span>{opp.availability ?? "Available Now"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{opp.mode ?? "Remote / Hybrid"}</span>
              </div>
            </div>

            <ul className="list-disc list-outside ml-4 pl-4 space-y-2 mb-6 text-muted-foreground text-sm md:text-base leading-relaxed marker:text-primary">
              {opp.bullets.map((bullet, index) => (
                <li key={`${bullet}-${index}`} className="pl-1">
                  {bullet}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3">
              <DownloadCVButton variant="default" size="sm" className="rounded-lg px-4 py-2">
                Download CV
              </DownloadCVButton>
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
              >
                Contact me
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
