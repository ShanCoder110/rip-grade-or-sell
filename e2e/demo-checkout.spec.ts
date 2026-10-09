import { expect, test } from "@playwright/test";

async function dismissCookies(page: import("@playwright/test").Page) {
  const accept = page.getByRole("button", { name: "Accept" });
  if (await accept.isVisible().catch(() => false)) await accept.click();
}

test("demo sign-in grants Pro and unlocks portfolio", async ({ page }) => {
  await page.goto("/auth/login?next=/pricing");
  await dismissCookies(page);
  await page.getByRole("button", { name: "Continue with demo account" }).click();
  await page.waitForURL(/\/pricing/);
  await expect(page.getByText(/Demo checkout is on/i)).toBeVisible();
  await page.getByRole("button", { name: "Subscribe monthly" }).click();
  await expect(page.getByText(/Pro is active/i)).toBeVisible();

  await page.goto("/app/portfolio");
  await expect(page.getByRole("heading", { name: "Portfolio" })).toBeVisible();
  await expect(page.getByText(/Import holdings/i)).toBeVisible();
  await expect(page.getByText(/is a Pro feature/i)).toHaveCount(0);

  await page.goto("/app/alerts");
  await expect(page.getByRole("heading", { name: "Alerts" })).toBeVisible();
  await expect(page.getByText(/is a Pro feature/i)).toHaveCount(0);

  await page.goto("/app/watchlist");
  await expect(page.getByText(/Pro is unlocked/i)).toBeVisible();
});
