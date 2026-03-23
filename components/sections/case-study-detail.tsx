import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { CASE_STUDY_LOGO_MARK_BOX_PX } from "@/lib/companyLogoMark";
import type { CvCaseStudy } from "@/lib/resumeData";

function LabeledBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-primary">{label}</h2>
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc list-outside ml-4 space-y-2 text-muted-foreground text-sm md:text-base leading-relaxed marker:text-primary">
      {items.map((line, i) => (
        <li key={i} className="pl-1">
          {line}
        </li>
      ))}
    </ul>
  );
}

function caseStudyLogoMapKey(study: CvCaseStudy): string | undefined {
  const fromField = study.logo_company?.trim();
  if (fromField) return fromField;
  const company = study.company?.trim();
  return company || undefined;
}

export function CaseStudyDetail({
  study,
  companyLogos,
}: {
  study: CvCaseStudy;
  companyLogos?: Record<string, string>;
}) {
  const expHref = study.experience_anchor ? `/experience#${study.experience_anchor}` : null;
  const logoKey = caseStudyLogoMapKey(study);
  const logoSrc = logoKey && companyLogos ? companyLogos[logoKey] : undefined;

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <header className="mb-10 space-y-3 border-b border-border/60 pb-10">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-muted-foreground">{study.company}</p>
          {logoSrc ? (
            <div
              className="relative flex shrink-0 items-center justify-end"
              style={{
                width: CASE_STUDY_LOGO_MARK_BOX_PX.width,
                height: CASE_STUDY_LOGO_MARK_BOX_PX.height,
              }}
              title={logoKey}
            >
              <Image
                src={logoSrc}
                alt={logoKey ? `${logoKey} logo` : "Company logo"}
                width={CASE_STUDY_LOGO_MARK_BOX_PX.width}
                height={CASE_STUDY_LOGO_MARK_BOX_PX.height}
                className="object-contain object-right"
              />
            </div>
          ) : null}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{study.title}</h1>
        {study.blurb ? <p className="text-lg text-muted-foreground leading-relaxed">{study.blurb}</p> : null}
      </header>

      <div className="flex flex-col gap-10">
        <LabeledBlock label="Problem">
          <BulletList items={study.problem} />
        </LabeledBlock>
        <LabeledBlock label="Work">
          <BulletList items={study.work} />
        </LabeledBlock>
        <LabeledBlock label="Impact">
          <BulletList items={study.impact} />
        </LabeledBlock>
        {study.learning && study.learning.length > 0 ? (
          <LabeledBlock label="Learning">
            <BulletList items={study.learning} />
          </LabeledBlock>
        ) : null}
        {expHref ? (
          <p className="text-sm font-medium">
            <Link href={expHref} className="text-primary underline-offset-4 hover:underline">
              View timeline on Experience →
            </Link>
          </p>
        ) : null}
      </div>
    </article>
  );
}
