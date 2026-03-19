import { getCvData } from "@/lib/cv";
import { ProjectsSection } from "@/components/sections/projects";
import { ExploreMoreSection } from "@/components/sections/explore-more";
import { PageHeader } from "@/components/shared/page-header";

export default function ProjectsPage() {
  const { cv } = getCvData();
  const projects = cv.projects ?? [];

  return (
    <>
      <PageHeader
        title="Projects"
        description="Explore my portfolio of projects, from personal experiments to professional work that showcases my skills and passion for frontend development."
      />
      <ProjectsSection projects={projects} />
      <ExploreMoreSection cv={cv} />
    </>
  );
}

