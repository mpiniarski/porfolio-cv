import { getCvData } from "@/lib/cv";
import { ResumePreview } from "@/components/resume/ResumePreview";

export default function ResumePage() {
  const { cv } = getCvData();
  return <ResumePreview cv={cv} />;
}

