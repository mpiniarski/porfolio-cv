import fs from "node:fs";
import path from "node:path";
import yaml from "yaml";

import type { CvData } from "./resumeData";

function findDataYml(): string {
  const cwd = process.cwd();
  const fromLib = path.resolve(__dirname, "..", "..", "data.yml");
  const candidates = [path.join(cwd, "data.yml"), path.join(cwd, "..", "data.yml"), fromLib];
  for (const filePath of candidates) {
    if (fs.existsSync(filePath)) return filePath;
  }
  throw new Error(`data.yml not found. Tried: ${candidates.join(", ")}`);
}

export function getResumeData(): CvData {
  const filePath = findDataYml();
  const file = fs.readFileSync(filePath, "utf8");
  const parsed = yaml.parse(file) as CvData;
  return parsed;
}

