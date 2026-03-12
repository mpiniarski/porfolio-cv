import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getResumeData } from "@/lib/resumeData";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { cv } = getResumeData();
  const social_networks = cv.social_networks ?? [];
  const projects = cv.projects ?? [];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <main className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-12">
        <SiteHeader
          cv={{ name: cv.name, headline: cv.headline, location: cv.location }}
          showProjectsNav={projects.length > 0}
        />
        {children}
        <SiteFooter
          cv={{ email: cv.email }}
          social_networks={social_networks}
        />
      </main>
    </div>
  );
}

