import Image from "next/image";
import Link from "next/link";

import { CASE_STUDY_LOGO_MARK_BOX_PX } from "@/lib/companyLogoMark";
import type { CvData } from "@/lib/resumeData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CaseStudiesSectionProps = {
  block?: CvData["cv"]["case_studies"];
  companyLogos?: Record<string, string>;
  /** When set, only the first N items from `data.yml` order (most recent at top). */
  maxItems?: number;
  /** Homepage etc.: link to the full Work page below the grid. */
  viewAllHref?: string;
  viewAllLabel?: string;
};

function logoKeyForStudy(study: NonNullable<CvData["cv"]["case_studies"]>["items"][number]): string | undefined {
  const fromField = study.logo_company?.trim();
  if (fromField) return fromField;
  const company = study.company?.trim();
  return company || undefined;
}

export function CaseStudiesSection({
  block,
  companyLogos,
  maxItems,
  viewAllHref,
  viewAllLabel = "See all work",
}: CaseStudiesSectionProps) {
  const allItems = block?.items ?? [];
  if (!block || allItems.length === 0) return null;

  const items = maxItems != null ? allItems.slice(0, maxItems) : allItems;

  const title = block.title?.trim() || "Case studies";
  const description = block.description?.trim();
  const logos = companyLogos ?? {};

  return (
    <section id="case-studies" className="scroll-mt-24 bg-background py-20 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl md:text-4xl">{title}</h2>
          {description ? <p className="mx-auto max-w-2xl text-lg text-muted-foreground">{description}</p> : null}
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((study) => {
            const preview = study.blurb?.trim() || study.problem[0] || "";
            const logoMapKey = logoKeyForStudy(study);
            const logoSrc = logoMapKey ? logos[logoMapKey] : undefined;

            return (
              <Link
                key={study.id}
                href={`/projects/${study.id}`}
                aria-label={`Case study: ${study.title} — ${study.company}`}
                className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Card className="h-full border-border/50 transition-all group-hover:border-primary/30 group-hover:shadow-md">
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1 space-y-1">
                        <CardTitle className="text-lg leading-snug transition-colors group-hover:text-primary md:text-xl">
                          {study.title}
                        </CardTitle>
                        <p className="text-sm font-medium text-muted-foreground">{study.company}</p>
                      </div>
                      {logoSrc ? (
                        <div
                          className="relative flex shrink-0 items-center justify-end"
                          style={{
                            width: CASE_STUDY_LOGO_MARK_BOX_PX.width,
                            height: CASE_STUDY_LOGO_MARK_BOX_PX.height,
                          }}
                          title={logoMapKey}
                        >
                          <Image
                            src={logoSrc}
                            alt=""
                            width={CASE_STUDY_LOGO_MARK_BOX_PX.width}
                            height={CASE_STUDY_LOGO_MARK_BOX_PX.height}
                            className="object-contain object-right"
                            aria-hidden
                          />
                        </div>
                      ) : null}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0">
                    {preview ? (
                      <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed">{preview}</p>
                    ) : null}
                    <p className="text-sm font-medium text-primary">Read case study →</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {viewAllHref ? (
          <p className="mt-10 text-center">
            <Link
              href={viewAllHref}
              className="text-sm font-semibold text-primary underline-offset-4 transition-colors hover:underline"
            >
              {viewAllLabel}
            </Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}
