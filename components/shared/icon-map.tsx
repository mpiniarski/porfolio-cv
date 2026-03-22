"use client";

import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bot,
  Briefcase,
  FolderOpen,
  Globe,
  Home,
  Layers,
  LayoutTemplate,
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
  BarChart3,
  Bot,
  Briefcase,
  FolderOpen,
  Globe,
  Home,
  Layers,
  LayoutTemplate,
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

