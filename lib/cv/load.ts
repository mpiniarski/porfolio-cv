import fs from "node:fs";
import path from "node:path";
import yaml from "yaml";

import type { CvData, CvExperienceItem } from "../resumeData";
import { deepMerge } from "../deepMerge";

type CvYamlSource = Partial<CvData> & { based_on?: string };

function toAbsolutePath(filePath: string): string {
  return path.resolve(filePath);
}

function resolveCvWithInheritance(filePath: string, visited: Set<string>): CvData {
  const absolutePath = toAbsolutePath(filePath);
  if (visited.has(absolutePath)) {
    throw new Error(`Circular based_on chain detected at: ${absolutePath}`);
  }
  visited.add(absolutePath);
  const parsed = yaml.parse(fs.readFileSync(absolutePath, "utf8")) as CvYamlSource;

  if (!parsed.based_on) {
    return parsed as CvData;
  }

  const parentPath = path.resolve(path.dirname(absolutePath), parsed.based_on);
  const parent = resolveCvWithInheritance(parentPath, visited);
  const merged = deepMerge(parent, parsed);
  delete (merged as CvYamlSource).based_on;
  return merged as CvData;
}

/** Apply variant `experience_overrides` (matched by exact company) onto the merged experience list, then strip the field. */
function applyExperienceOverrides(data: CvData): CvData {
  const overrides = data.cv.experience_overrides;
  if (!overrides?.length) return data;

  const experience = data.cv.experience ?? [];
  for (const override of overrides) {
    if (!experience.some((entry) => entry.company === override.company)) {
      throw new Error(`experience_overrides: no experience entry with company "${override.company}"`);
    }
  }

  const cv = {
    ...data.cv,
    experience: experience.map((entry) => {
      const override = overrides.find((o) => o.company === entry.company);
      return override ? (deepMerge(entry, override) as CvExperienceItem) : entry;
    }),
  };
  delete cv.experience_overrides;
  return { ...data, cv };
}

export function loadCvDataFromFile(filePath: string): CvData {
  return applyExperienceOverrides(resolveCvWithInheritance(filePath, new Set()));
}
