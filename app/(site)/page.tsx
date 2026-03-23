import { getCvData } from "@/lib/cv";
import { HeroSection } from "@/components/sections/hero";
import { WorkedWithSection } from "@/components/sections/worked-with";
import { OverviewQuickSection } from "@/components/sections/overview-quick";
import { CaseStudiesSection } from "@/components/sections/case-studies";
import { ServicesSection } from "@/components/sections/services";
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
      <CaseStudiesSection
        block={cv.case_studies}
        companyLogos={cv.company_logos}
        maxItems={3}
        viewAllHref="/projects#case-studies"
        viewAllLabel="See all work →"
      />
      <div id="overview">
        <OverviewQuickSection cv={cv} />
      </div>
      <div id="services">
        <ServicesSection cv={cv} />
      </div>
      <div className="bg-secondary/5">
        <ExploreMoreSection cv={cv} excludeHrefs={["/contact"]} />
      </div>
      <ContactSection cv={cv} />
    </>
  );
}
