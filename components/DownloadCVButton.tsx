"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const CV_PATH = "/" + encodeURIComponent("Resume · Marcin Piniarski.pdf");
const PDF_FILENAME = "Marcin Piniarski - CV.pdf";

export function DownloadCVButton({
  variant = "outline",
  size = "lg",
  className,
  children,
}: {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg" | "xs";
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <Button variant={variant} size={size} className={className} asChild>
      <a href={CV_PATH} download={PDF_FILENAME}>
        {children ?? (
          <>
            <Download className="mr-2 h-5 w-5" />
            Download CV
          </>
        )}
      </a>
    </Button>
  );
}
