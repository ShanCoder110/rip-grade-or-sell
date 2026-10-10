import { expect, type Page } from "@playwright/test";
import { waitForPathname } from "./navigation";

export async function demoSignIn(page: Page, nextPath = "/app/watchlist") {
  const accept = page.getByRole("button", { name: "Accept all" });
  if (await accept.isVisible().catch(() => false)) await accept.click();
  await page.goto(`/auth/login?next=${encodeURIComponent(nextPath)}`);
  const demo = page.getByRole("button", { name: /demo account/i });
  await expect(demo).toBeVisible();
  await demo.click();
  await waitForPathname(page, nextPath);
  await expect(page.getByRole("heading", { name: "Watchlist" })).toBeVisible();
}
