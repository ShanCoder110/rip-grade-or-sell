import { test, expect } from "@playwright/test";

async function dismissCookies(page: import("@playwright/test").Page, acceptAll = true) {
  const accept = page.getByRole("button", { name: acceptAll ? "Accept all" : "Essential only" });
  if (await accept.isVisible().catch(() => false)) {
    await accept.click();
  }
}

test("home and set page render", async ({ page }) => {
  await dismissCookies(page);
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Rip, grade, or sell/i })).toBeVisible();
  await page.goto("/sets/sample-stellar-crown");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/Stellar Crown/i);
});

test("grade-or-sell calculator", async ({ page }) => {
  await dismissCookies(page);
  await page.goto("/tools/grade-or-sell");
  await expect(page.getByRole("heading", { name: /Grade or sell/i })).toBeVisible();
  await page.locator("#raw-price").waitFor({ state: "visible", timeout: 15_000 });
  await expect(page.getByText(/Expected net vs selling raw/i)).toBeVisible();
});

test("cookie consent banner", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("dialog", { name: "Cookie consent" })).toBeVisible();
  await page.getByRole("button", { name: "Essential only" }).click();
  await expect(page.getByRole("dialog", { name: "Cookie consent" })).toBeHidden();
});

test("legacy pricing URL redirects home", async ({ page }) => {
  await dismissCookies(page);
  await page.goto("/pricing");
  await expect(page).toHaveURL("/");
});
