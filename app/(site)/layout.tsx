import { getResumeData } from "@/lib/resumeData";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { SiteFooter } from "@/components/site-footer";
import { SiteTabs } from "@/components/site-tabs";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { cv } = getResumeData();

  return (
    <AuroraBackground>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 rounded-3xl border border-slate-200/80 bg-gradient-to-b from-slate-50/80 via-white/95 to-indigo-50/60 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl md:p-10 lg:p-12">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter cv={cv} social_networks={cv.social_networks ?? []} />
      </div>
    </AuroraBackground>
  );
}

function SiteHeader() {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200/80 pb-6 md:flex-row md:items-end md:justify-between">
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
          Marcin Piniarski
        </p>
        <p className="text-lg font-semibold text-slate-900 sm:text-xl">
          Senior Frontend Engineer
        </p>
      </div>
      <SiteTabs />
    </header>
  );
}

