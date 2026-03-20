import { getCvData } from "@/lib/cv";
import { ExperienceTimelineSection } from "@/components/sections/experience-timeline";
import { PageHeader } from "@/components/shared/page-header";

export default function ExperiencePage() {
  const { cv } = getCvData();
  const experience = cv.experience ?? [];

  return (
    <div className="shrink-0 grow-0">
      <PageHeader
        title="Professional Experience"
        description="Detailed work history and project highlights."
        compact
      />

      <ExperienceTimelineSection experience={experience} cv={cv} />
    </div>
  );
}

