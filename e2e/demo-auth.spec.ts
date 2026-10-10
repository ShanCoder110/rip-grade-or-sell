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
  await page.waitForURL(/\/(app\/watchlist|auth\/login)/);
  if (page.url().includes("/auth/login")) {
    test.skip(true, "Runtime Supabase config requires real auth in this environment");
  }
  await expect(page.getByRole("heading", { name: "Watchlist" })).toBeVisible();
});
