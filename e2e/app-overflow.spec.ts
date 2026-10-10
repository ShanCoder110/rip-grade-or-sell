import { test, expect } from "@playwright/test";
import { demoSignIn } from "./helpers/demo-sign-in";
import { waitForPathname } from "./helpers/navigation";

test.use({ viewport: { width: 375, height: 812 } });

const APP_PATHS = ["/app/watchlist", "/app/portfolio", "/app/alerts"] as const;

async function assertNoHorizontalOverflow(page: import("@playwright/test").Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
}

const NAV_LABEL: Record<(typeof APP_PATHS)[number], string> = {
  "/app/watchlist": "Watchlist",
  "/app/portfolio": "Portfolio",
  "/app/alerts": "Alerts",
};

test("app pages fit 375px viewport width", async ({ page }) => {
  await demoSignIn(page);
  for (const path of APP_PATHS) {
    if (new URL(page.url()).pathname !== path) {
      await page.getByRole("navigation", { name: "Account" }).getByRole("link", {
        name: NAV_LABEL[path],
      }).click();
      await waitForPathname(page, path);
    }
    await assertNoHorizontalOverflow(page);
  }
});
