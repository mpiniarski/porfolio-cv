/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useMemo, useState } from "react";

import type { CvData } from "@/lib/resumeData";
import { ResumeDocument } from "./ResumeDocument";
import { Button } from "@/components/ui/button";

export function ResumePreview({ cv }: { cv: CvData["cv"] }) {
  const storageKey = "cv:resumePreviewEnabled";
  const [previewEnabled, setPreviewEnabled] = useState(true);

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);
    if (raw === "0") setPreviewEnabled(false);
    if (raw === "1") setPreviewEnabled(true);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "p" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        window.print();
        return;
      }
      if (e.key.toLowerCase() === "p") {
        setPreviewEnabled((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, previewEnabled ? "1" : "0");
  }, [previewEnabled]);

  const wrapperClassName = useMemo(() => {
    return previewEnabled ? "mx-auto max-w-[210mm]" : "mx-auto max-w-5xl px-6 py-10";
  }, [previewEnabled]);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-(--font-resume)">
      <div className={wrapperClassName}>
        {!previewEnabled ? (
          <div className="fixed right-4 top-4 z-50 flex items-center justify-end gap-2 rounded-md border border-slate-200 bg-white/85 px-2 py-1 backdrop-blur print:hidden">
            <Button variant="secondary" size="sm" onClick={() => setPreviewEnabled(true)}>
              Enable preview
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              Print
            </Button>
          </div>
        ) : null}

        <ResumeDocument cv={cv} previewEnabled={previewEnabled} />
      </div>
    </div>
  );
}

