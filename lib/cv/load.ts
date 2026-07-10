import fs from "node:fs";
import path from "node:path";
import yaml from "yaml";

import type { CvData } from "../resumeData";
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

export function loadCvDataFromFile(filePath: string): CvData {
  return resolveCvWithInheritance(filePath, new Set());
}
