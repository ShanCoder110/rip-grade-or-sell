import { test, expect } from "@playwright/test";

test("home and set page render", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Rip, grade, or sell/i })).toBeVisible();
  await page.goto("/sets/sample-stellar-crown");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/Stellar Crown/i);
});

test("grade-or-sell calculator", async ({ page }) => {
  await page.goto("/tools/grade-or-sell");
  await expect(page.getByRole("heading", { name: /Grade or sell/i })).toBeVisible();
  await expect(page.getByText(/Expected net vs selling raw/i)).toBeVisible();
});

test("pricing page loads", async ({ page }) => {
  await page.goto("/pricing");
  await expect(page.getByRole("heading", { name: "Pricing" })).toBeVisible();
  await expect(page.getByText("Pro")).toBeVisible();
});
