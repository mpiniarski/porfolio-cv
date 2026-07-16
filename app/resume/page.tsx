import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { CvVariant } from "@/lib/cv";
import { CV_VARIANTS, getCvData, isCvDataNotFoundError } from "@/lib/cv";
import { ResumePreview } from "@/components/resume/ResumePreview";

export const metadata: Metadata = {
  title: "Resume",
  description: "Printable CV / resume.",
};

type ResumePageProps = { searchParams: Promise<{ variant?: CvVariant }> };

function getResumeVariant(value: string | string[] | undefined): CvVariant | undefined {
  if (value === undefined) return undefined;
  const single = Array.isArray(value) ? value[value.length - 1] : value;
  if (CV_VARIANTS.includes(single as CvVariant)) return single as CvVariant;
  return undefined;
}

export default async function ResumePage({ searchParams }: ResumePageProps) {
  const { variant } = await searchParams;
  try {
    const { cv } = getCvData({ variant: getResumeVariant(variant) });
    return <ResumePreview cv={cv} />;
  } catch (error) {
    if (isCvDataNotFoundError(error)) {
      notFound();
    }
    throw error;
  }
}

