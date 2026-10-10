import { test, expect } from "@playwright/test";

test("demo sign-in reaches watchlist", async ({ page }) => {
  const accept = page.getByRole("button", { name: "Accept all" });
  if (await accept.isVisible().catch(() => false)) {
    await accept.click();
  }
  await page.goto("/auth/login?next=/app/watchlist");
  const demo = page.getByRole("button", { name: /demo account/i });
  if (!(await demo.isVisible().catch(() => false))) {
    test.skip(true, "Demo sign-in only when Supabase is not configured at build time");
  }
  await demo.click();
  await page.waitForURL(/\/app\/watchlist/, { timeout: 15_000 });
  await expect(page.getByRole("heading", { name: "Watchlist" })).toBeVisible();
  await expect(page.getByText(/saved in this browser only/i)).toBeVisible();
});
