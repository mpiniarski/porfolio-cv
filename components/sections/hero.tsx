"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import Image from "next/image";

import { formatCvLocationLine, type CvData } from "@/lib/resumeData";
import { Button } from "@/components/ui/button";
import { DownloadCVButton } from "@/components/DownloadCVButton";

export function HeroSection({
  cv,
  yearsOfExperience,
  topEducationLabel,
}: {
  cv: CvData["cv"];
  yearsOfExperience: number | null;
  topEducationLabel: { top: string; bottom: string } | null;
}) {
  const [showScroll, setShowScroll] = useState(true);

  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY <= 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const intro = cv.short_summary ?? cv.summary;
  const linkedin = cv.social_networks?.find((n) => n.network.toLowerCase() === "linkedin")?.username;
  const github = cv.social_networks?.find((n) => n.network.toLowerCase() === "github")?.username;
  const education = topEducationLabel;
  const years = yearsOfExperience;
  const heroStats = cv.hero_stats?.length ? cv.hero_stats.slice(0, 3) : null;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-background via-background to-primary/5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-48 h-48 bg-secondary/30 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 gap-4 h-full">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="border-r border-foreground/10 h-full" />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8 text-center lg:text-left order-2 lg:order-2">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl tracking-tight">
                <span className="block">Hello, I&apos;m</span>
                <span className="block bg-linear-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
                  {cv.name}
                </span>
              </h1>

              <div className="space-y-4">
                <p className="text-xl sm:text-2xl text-muted-foreground max-w-lg">
                  {intro ?? cv.headline}
                </p>
                <p className="text-lg text-muted-foreground/80 max-w-md">
                  Led frontend development across multiple products, introducing design systems, engineering
                  standards, and performance improvements.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="w-full sm:w-auto px-8" asChild>
                <a
                  href="#worked-with"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("worked-with")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  View My Work
                </a>
              </Button>
              <DownloadCVButton
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-8"
              />
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8" asChild>
                <Link href="/contact">Contact Me</Link>
              </Button>
            </div>

            <div className="flex gap-4 justify-center lg:justify-start">
              {github ? (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-background/50 backdrop-blur-sm border border-primary/10 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300"
                >
                  <Github className="h-5 w-5" />
                </a>
              ) : null}
              {linkedin ? (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-background/50 backdrop-blur-sm border border-primary/10 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              ) : null}
              <a
                href={`mailto:${cv.email}`}
                className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-background/50 backdrop-blur-sm border border-primary/10 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8">
              {heroStats ? (
                heroStats.map((s) => (
                  <div key={`${s.top}|${s.bottom}`} className="text-center lg:text-left">
                    <div className="text-2xl md:text-3xl mb-1">{s.top}</div>
                    <div className="text-sm text-muted-foreground">{s.bottom}</div>
                  </div>
                ))
              ) : (
                <>
                  <div className="text-center lg:text-left">
                    <div className="text-2xl md:text-3xl mb-1">{education?.top ?? "M.Sc"}</div>
                    <div className="text-sm text-muted-foreground">{education?.bottom ?? "Computer Science"}</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-2xl md:text-3xl mb-1">{years != null ? `${years}+` : "9+"}</div>
                    <div className="text-sm text-muted-foreground">Years experience</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-2xl md:text-3xl mb-1">Remote</div>
                    <div className="text-sm text-muted-foreground">{formatCvLocationLine(cv)}</div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-center items-start order-1 lg:order-1 lg:-mt-12">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-72 h-72 bg-linear-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl opacity-60" />
              <div className="absolute -bottom-4 -right-4 w-64 h-64 bg-linear-to-tl from-accent/30 to-primary/10 rounded-full blur-3xl opacity-40" />
              <div className="relative z-10 group">
                <div className="relative w-96 h-96 lg:w-md lg:h-112 rounded-full overflow-hidden bg-linear-to-br from-primary/10 to-secondary/10 backdrop-blur-sm border-4 border-background/50 shadow-2xl">
                  {cv.photo ? (
                    <Image
                      src={cv.photo}
                      alt={`${cv.name} profile photo`}
                      fill
                      sizes="(min-width: 1024px) 28rem, 24rem"
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      style={{ objectPosition: "50% 20%" }}
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/5" />
                  )}
                </div>
                <div className="absolute -bottom-6 -right-6 bg-background/90 backdrop-blur-sm border border-primary/20 rounded-2xl px-6 py-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm">
                      {cv.open_for_opportunities ? "Open for opportunities" : "Not currently available"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`fixed bottom-12 left-1/2 transform -translate-x-1/2 transition-opacity duration-500 ${
            showScroll ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-sm text-muted-foreground">Scroll to explore</span>
            <ArrowDown className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </div>
    </section>
  );
}

