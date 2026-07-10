import { expect, test } from "@playwright/test";

import { deepMerge } from "./deepMerge";

test("keeps base when override is undefined", () => {
  expect(deepMerge("base", undefined)).toBe("base");
  expect(deepMerge(123, undefined)).toBe(123);
  expect(deepMerge({ a: 1 }, undefined)).toEqual({ a: 1 });
});

test("allows null as explicit override", () => {
  expect(deepMerge("base", null)).toBeNull();
  expect(deepMerge({ a: 1 }, { a: null })).toEqual({ a: null });
});

test("replaces arrays instead of concatenating", () => {
  expect(deepMerge([1, 2, 3], [9])).toEqual([9]);
  expect(deepMerge({ items: [1, 2] }, { items: [3] })).toEqual({ items: [3] });
});

test("deep merges nested objects", () => {
  const base = {
    name: "cv",
    nested: {
      keep: "yes",
      update: "old",
      deep: { value: 1, keep: true },
    },
  };
  const override = {
    nested: {
      update: "new",
      deep: { value: 2 },
    },
  };

  expect(deepMerge(base, override)).toEqual({
    name: "cv",
    nested: {
      keep: "yes",
      update: "new",
      deep: { value: 2, keep: true },
    },
  });
});
