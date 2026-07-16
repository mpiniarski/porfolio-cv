import path from "node:path";
import fs from "node:fs";
import os from "node:os";

import { expect, test } from "@playwright/test";
import yaml from "yaml";

import { deriveCv, getCvData, loadCvDataFromFile } from "./cv";
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

function writeOverridesFixture(variantCv: Record<string, unknown>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "cv-overrides-"));
  fs.writeFileSync(
    path.join(dir, "base.yml"),
    yaml.stringify({
      cv: {
        experience: [
          { company: "A", position: "Dev", location: "X", highlights: ["a1", "a2"] },
          { company: "B", position: "Dev", highlights: ["b1"] },
        ],
      },
    }),
  );
  const variantPath = path.join(dir, "variant.yml");
  fs.writeFileSync(variantPath, yaml.stringify({ based_on: "./base.yml", cv: variantCv }));
  return variantPath;
}

test("experience_overrides replaces matched entry fields and keeps the rest", () => {
  const variantPath = writeOverridesFixture({
    experience_overrides: [{ company: "A", highlights: ["a-short"] }],
  });

  const data = loadCvDataFromFile(variantPath);

  expect(data.cv.experience[0].highlights).toEqual(["a-short"]);
  expect(data.cv.experience[0].position).toBe("Dev");
  expect(data.cv.experience[0].location).toBe("X");
  expect(data.cv.experience[1].highlights).toEqual(["b1"]);
  expect(data.cv.experience_overrides).toBeUndefined();
});

test("experience_overrides with unknown company throws", () => {
  const variantPath = writeOverridesFixture({
    experience_overrides: [{ company: "Nope", highlights: ["x"] }],
  });

  expect(() => loadCvDataFromFile(variantPath)).toThrow(/no experience entry with company "Nope"/);
});
