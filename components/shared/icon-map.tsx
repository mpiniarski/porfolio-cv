"use client";

import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  FolderOpen,
  Globe,
  Home,
  Layers,
  Lightbulb,
  Mail,
  Package,
  Rocket,
  TestTube,
  User,
  Users,
  Zap,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Briefcase,
  FolderOpen,
  Globe,
  Home,
  Layers,
  Lightbulb,
  Mail,
  Package,
  Rocket,
  TestTube,
  User,
  Users,
  Zap,
};

export function getLucideIcon(name: string | undefined): LucideIcon | null {
  if (!name) return null;
  return ICONS[name] ?? null;
}

