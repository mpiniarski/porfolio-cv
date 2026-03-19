import { test, expect } from "@playwright/test";

const routes = [
  { path: "/", name: "home" },
  { path: "/resume", name: "resume" },
  { path: "/experience", name: "experience" },
  { path: "/about", name: "about" },
  { path: "/projects", name: "projects" },
  { path: "/contact", name: "contact" },
] as const;

for (const { path, name } of routes) {
  test(`visual: ${name} page`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
    });
  });
}
