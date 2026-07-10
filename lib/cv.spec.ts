import path from "node:path";
import fs from "node:fs";

import { expect, test } from "@playwright/test";
import yaml from "yaml";

import { deriveCv, getCvData } from "./cv";
import type { CvData } from "./resumeData";

function sortDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortDeep);
  if (value != null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, entryValue]) => entryValue !== undefined)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, entryValue]) => [key, sortDeep(entryValue)]),
    );
  }
  return value;
}

test("frontend variant resolves to current CV data", () => {
  const projectRoot = process.cwd();
  const previousDataYml = fs.readFileSync(path.join(projectRoot, "tests", "fixtures", "data.yml"), "utf8");
  const previous = yaml.parse(previousDataYml) as CvData;
  const current = {
    cv: previous.cv,
    derived: deriveCv(previous.cv),
  };

  const frontend = getCvData({ variant: "fe" });

  expect(sortDeep(frontend.cv)).toEqual(sortDeep(current.cv));
  expect(sortDeep(frontend.derived)).toEqual(sortDeep(current.derived));
});

test("unsupported or empty variant falls back to fe", () => {
  const fe = getCvData({ variant: "fe" });
  expect(sortDeep(getCvData({ variant: "unknown" }).cv)).toEqual(sortDeep(fe.cv));
  expect(sortDeep(getCvData({ variant: "" }).cv)).toEqual(sortDeep(fe.cv));
  expect(() => getCvData({ variant: " FE " })).not.toThrow();
  expect(sortDeep(getCvData({ variant: ["fe"] as unknown }).cv)).toEqual(sortDeep(fe.cv));
});

test("default variant equals explicit fe variant", () => {
  const implicit = getCvData();
  const explicit = getCvData({ variant: "fe" });

  expect(sortDeep(implicit.cv)).toEqual(sortDeep(explicit.cv));
  expect(sortDeep(implicit.derived)).toEqual(sortDeep(explicit.derived));
});
