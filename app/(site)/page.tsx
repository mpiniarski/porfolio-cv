import { getCvData } from "@/lib/cv";
import { HeroSection } from "@/components/sections/hero";
import { WorkedWithSection } from "@/components/sections/worked-with";
import { OverviewQuickSection } from "@/components/sections/overview-quick";
import { SelectedWorkSection } from "@/components/sections/selected-work";
import { ServicesSection } from "@/components/sections/services";
import { ProjectsSection } from "@/components/sections/projects";
import { ExploreMoreSection } from "@/components/sections/explore-more";
import { ContactSection } from "@/components/sections/contact";

export default function Home() {
  const { cv, derived } = getCvData();
  return (
    <>
      <div id="home">
        <HeroSection
          cv={cv}
          yearsOfExperience={derived.yearsOfExperience}
          topEducationLabel={derived.topEducationLabel}
        />
      </div>
      <div id="worked-with">
        <WorkedWithSection
          cv={cv}
          yearsOfExperience={derived.yearsOfExperience}
          companies={derived.workedWith}
        />
      </div>
      <div id="selected-work">
        <SelectedWorkSection cv={cv} />
      </div>
      <div id="overview">
        <OverviewQuickSection cv={cv} />
      </div>
      <div id="services">
        <ServicesSection cv={cv} />
      </div>
      <ProjectsSection
        projects={cv.projects ?? []}
        title="Featured Projects"
        description="Personal projects showcasing frontend development skills and modern web technologies."
      />
      <div className="bg-secondary/5">
        <ExploreMoreSection cv={cv} excludeHrefs={["/contact"]} />
      </div>
      <ContactSection cv={cv} />
    </>
  );
}
