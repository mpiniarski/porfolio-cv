import type { Metadata } from "next";

import { getCvData } from "@/lib/cv";
import { ResumePreview } from "@/components/resume/ResumePreview";

export const metadata: Metadata = {
  title: "Resume",
  description: "Printable CV / resume.",
};

export default function ResumePage() {
  const { cv } = getCvData();
  return <ResumePreview cv={cv} />;
}

