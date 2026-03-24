import type { Metadata } from "next";

import { getCvData } from "@/lib/cv";
import { AboutOverviewSection } from "@/components/sections/about-overview";
import { ToolsSection } from "@/components/sections/tools";
import { ExploreMoreSection } from "@/components/sections/explore-more";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = {
  title: "About",
  description: "Background, skills, core technologies, and education.",
};

export default function AboutPage() {
  const { cv } = getCvData();

  return (
    <>
      <PageHeader
        title="About Me"
        description="Get to know more about my background, skills, and what drives me as a frontend engineer."
      />

      <AboutOverviewSection cv={cv} />

      <ToolsSection cv={cv} />
      <ExploreMoreSection cv={cv} />
    </>
  );
}

