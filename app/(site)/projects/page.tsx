import type { Metadata } from "next";

import { getCvData } from "@/lib/cv";
import { CaseStudiesSection } from "@/components/sections/case-studies";
import { ProjectsSection } from "@/components/sections/projects";
import { ExploreMoreSection } from "@/components/sections/explore-more";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies from senior frontend roles — problems, approach, and outcomes — plus personal projects.",
};

export default function ProjectsPage() {
  const { cv } = getCvData();
  const projects = cv.projects ?? [];

  return (
    <>
      <PageHeader
        title="Work"
        description="Case studies from my roles — how I approached real product and engineering problems — and personal projects I ship on the side."
      />
      <CaseStudiesSection block={cv.case_studies} companyLogos={cv.company_logos} />
      <ProjectsSection
        projects={projects}
        hideWhenEmpty
        title="Personal projects"
        description="Experiments and side projects — often TypeScript, React, and modern tooling."
      />
      <ExploreMoreSection cv={cv} />
    </>
  );
}

