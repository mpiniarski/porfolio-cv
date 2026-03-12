"use client";

import { useEffect, useState } from "react";
import type { CvExperienceItem } from "@/lib/resumeData";
import { PageBreakPreview } from "@/components/PageBreakPreview";

type Props = {
  items: CvExperienceItem[];
};

export function ResumeExperienceWithPreview({ items }: Props) {
  const [guessHeightPx, setGuessHeightPx] = useState(650);

  useEffect(() => {
    // Allows tweaking from browser console: setGuessHeightPx(900)
    // @ts-expect-error attaching helper to window
    window.setGuessHeightPx = (value: number) => {
      if (typeof value === "number" && Number.isFinite(value)) {
        setGuessHeightPx(value);
      }
    };
  }, []);

  return <PageBreakPreview items={items} guessHeightPx={guessHeightPx} />;
}

