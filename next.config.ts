import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { NextConfig } from "next";

function readPackageVersion(): string {
  try {
    const raw = readFileSync(join(process.cwd(), "package.json"), "utf8");
    const pkg = JSON.parse(raw) as { version?: string };
    return pkg.version ?? "";
  } catch {
    return "";
  }
}

function git(args: string): string {
  try {
    return execSync(args, {
      encoding: "utf8",
      cwd: process.cwd(),
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

/** First line only; safe for env embedding and console. */
function commitSubject(raw: string): string {
  if (!raw) return "";
  const line = raw.split(/\r?\n/).find((l) => l.trim()) ?? "";
  return line.trim().slice(0, 500);
}

const siteVersion = readPackageVersion();
const gitCommit =
  process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ||
  git("git rev-parse --short HEAD");
const gitCommitDate = git("git log -1 --format=%cI");
const gitCommitMessage = commitSubject(
  process.env.VERCEL_GIT_COMMIT_MESSAGE ||
    process.env.GIT_COMMIT_MESSAGE ||
    git("git log -1 --format=%s"),
);
const buildTimeIso = new Date().toISOString();

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SITE_VERSION: siteVersion,
    NEXT_PUBLIC_GIT_COMMIT: gitCommit,
    NEXT_PUBLIC_GIT_COMMIT_MESSAGE: gitCommitMessage,
    NEXT_PUBLIC_GIT_COMMIT_DATE: gitCommitDate,
    NEXT_PUBLIC_BUILD_TIME_ISO: buildTimeIso,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.jsdelivr.net" },
      { protocol: "https", hostname: "playwright.dev" },
      { protocol: "https", hostname: "www.cursor.com" },
      { protocol: "https", hostname: "claude.ai" },
      { protocol: "https", hostname: "cdn.oaistatic.com" },
      { protocol: "https", hostname: "uxwing.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "logosandtypes.com" },
      { protocol: "https", hostname: "cotypist.app" },
    ],
  },
};

export default nextConfig;
