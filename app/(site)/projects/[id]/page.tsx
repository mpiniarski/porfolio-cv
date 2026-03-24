import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getCvData } from "@/lib/cv";
import { getCaseStudyById, listCaseStudyIds } from "@/lib/caseStudies";
import { CaseStudyDetail } from "@/components/sections/case-study-detail";
import { ExploreMoreSection } from "@/components/sections/explore-more";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams(): { id: string }[] {
  const { cv } = getCvData();
  return listCaseStudyIds(cv).map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { cv } = getCvData();
  const study = getCaseStudyById(cv, id);
  if (!study) return { title: "Work" };
  return {
    title: study.title,
    description: study.blurb ?? study.problem[0],
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { id } = await params;
  const { cv } = getCvData();
  const study = getCaseStudyById(cv, id);
  if (!study) notFound();

  return (
    <>
      <div className="border-b border-border/40 bg-linear-to-br from-background via-background to-primary/5 px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/projects#case-studies"
            className="text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            ← Work
          </Link>
        </div>
      </div>
      <CaseStudyDetail study={study} companyLogos={cv.company_logos} />
      <ExploreMoreSection cv={cv} />
    </>
  );
}
