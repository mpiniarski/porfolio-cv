"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface AuroraBackgroundProps {
  children: ReactNode;
  className?: string;
}

export function AuroraBackground({ children, className }: AuroraBackgroundProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-screen items-start justify-center overflow-hidden bg-slate-950/5 pb-16 pt-10 md:pt-16",
        className,
      )}
    >
      {/* Soft aurora-style gradients inspired by Aceternity UI */}
      <div className="pointer-events-none absolute inset-0 -z-20">
        <div className="absolute -top-40 left-1/2 h-80 w-[32rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.40),transparent_65%)] blur-3xl" />
        <div className="absolute -bottom-40 left-0 h-80 w-[28rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.35),transparent_65%)] blur-3xl" />
        <div className="absolute -bottom-32 right-0 h-72 w-[26rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.32),transparent_65%)] blur-3xl" />
      </div>

      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="pointer-events-none absolute inset-x-0 top-40 -z-10 h-[28rem] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.85),transparent_60%),radial-gradient(circle_at_bottom,_rgba(224,231,255,0.85),transparent_70%)] opacity-70 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        className="relative z-10 w-full px-4 sm:px-6 lg:px-8"
      >
        {children}
      </motion.div>
    </div>
  );
}

