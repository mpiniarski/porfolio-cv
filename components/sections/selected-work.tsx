"use client";

import Link from "next/link";

import { COMPANY_LOGO_MARK_BOX_PX } from "@/lib/companyLogoMark";
import type { CvData } from "@/lib/resumeData";
import { Card, CardContent } from "@/components/ui/card";
import { getLucideIcon } from "@/components/shared/icon-map";

const DEFAULT_TITLE = "Selected Work";

export function SelectedWorkSection({ cv }: { cv: CvData["cv"] }) {
  const block = cv.selected_work;
  const highlights = block?.highlights ?? [];
  if (highlights.length === 0) return null;

  const title = block?.title?.trim() || DEFAULT_TITLE;
  const description = block?.description?.trim();
  const logos = cv.company_logos ?? {};

  return (
    <section className="bg-background py-20 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl md:text-4xl">{title}</h2>
          {description ? <p className="mx-auto max-w-2xl text-lg text-muted-foreground">{description}</p> : null}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {highlights.map((item) => {
            const Icon = getLucideIcon(item.icon) ?? null;
            const anchor = item.experience_anchor?.trim();
            const expHref = anchor ? `/experience#${anchor}` : null;
            const companyKey = item.company?.trim();
            const logoSrc = companyKey ? logos[companyKey] : undefined;

            const card = (
              <Card
                className={`h-full border-border/50 transition-all hover:border-primary/30 hover:shadow-lg${expHref ? " group-hover:bg-primary/[0.03]" : ""}`}
              >
                <CardContent className="flex flex-col gap-5 p-6">
                  <div className="flex items-center justify-between gap-3 sm:gap-4">
                    <div
                      className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-primary/10 md:size-[4.5rem]"
                      aria-hidden={!Icon}
                    >
                      {Icon ? <Icon className="size-9 text-primary md:size-10" /> : null}
                    </div>
                    {logoSrc ? (
                      <div
                        className="flex shrink-0 items-center justify-end"
                        style={{
                          width: COMPANY_LOGO_MARK_BOX_PX.width,
                          height: COMPANY_LOGO_MARK_BOX_PX.height,
                        }}
                        title={companyKey}
                      >
                        <img
                          src={logoSrc}
                          alt={companyKey ? `${companyKey} logo` : "Company logo"}
                          className="h-full w-full object-contain object-right"
                        />
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold leading-snug transition-colors group-hover:text-primary">
                      {item.title}
                      {expHref ? (
                        <span className="ml-1 text-sm font-normal text-muted-foreground group-hover:text-primary/80">
                          →
                        </span>
                      ) : null}
                    </h3>
                    {item.subtitle ? (
                      <p className="mt-2 text-sm text-muted-foreground">{item.subtitle}</p>
                    ) : null}
                    {expHref ? (
                      <p className="mt-3 text-xs font-medium text-primary">View on Experience</p>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            );

            return expHref ? (
              <Link
                key={`${item.title}-${item.subtitle ?? ""}`}
                href={expHref}
                className="group block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label={`${item.title}: open Experience details`}
              >
                {card}
              </Link>
            ) : (
              <div key={`${item.title}-${item.subtitle ?? ""}`}>{card}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
