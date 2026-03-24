import type { Metadata } from "next";

import { getCvData } from "@/lib/cv";
import { ContactSection } from "@/components/sections/contact";
import { ExploreMoreSection } from "@/components/sections/explore-more";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch about projects and opportunities.",
};

export default function ContactPage() {
  const { cv } = getCvData();

  return (
    <>
      <PageHeader
        title="Get In Touch"
        description="I'm always interested in hearing about new projects and opportunities. Feel free to reach out!"
      />
      <ContactSection cv={cv} />
      <ExploreMoreSection cv={cv} />
    </>
  );
}

