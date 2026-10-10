import { test, expect, type Page } from "@playwright/test";
import { demoSignIn } from "./helpers/demo-sign-in";
import { waitForPathname } from "./helpers/navigation";

const APP_PATHS = ["/app/watchlist", "/app/portfolio", "/app/alerts"] as const;

const NAV_LABEL: Record<(typeof APP_PATHS)[number], string> = {
  "/app/watchlist": "Watchlist",
  "/app/portfolio": "Portfolio",
  "/app/alerts": "Alerts",
};

async function dismissCookies(page: Page) {
  const accept = page.getByRole("button", { name: "Accept all" });
  if (await accept.isVisible().catch(() => false)) await accept.click();
}

async function assertNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
}

async function assertMenuButtonInViewport(page: Page) {
  const menu = page.getByRole("button", { name: /^Menu$/ });
  await expect(menu).toBeVisible();
  const box = await menu.boundingBox();
  expect(box).not.toBeNull();
  const viewport = page.viewportSize();
  expect(viewport).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(viewport!.width + 0.5);
}

async function openMobileMenu(page: Page) {
  const menu = page.getByRole("button", { name: /^Menu$/ });
  await menu.click();
  await expect(page.getByRole("navigation", { name: "Mobile" })).toBeVisible();
}

for (const width of [320, 375] as const) {
  test.describe(`${width}px viewport`, () => {
    test.use({ viewport: { width, height: 812 } });

    test(`signed out: no overflow and mobile menu opens (${width}px)`, async ({ page }) => {
      await page.goto("/");
      await dismissCookies(page);
      await assertNoHorizontalOverflow(page);
      await assertMenuButtonInViewport(page);
      await openMobileMenu(page);
      if (width < 640) {
        await expect(page.getByRole("navigation", { name: "Mobile" }).getByRole("link", { name: "Sign in" })).toBeVisible();
      }
    });

    test(`signed in: header menu and account links (${width}px)`, async ({ page }) => {
      await demoSignIn(page);
      await assertNoHorizontalOverflow(page);
      await assertMenuButtonInViewport(page);
      await openMobileMenu(page);
      const mobileNav = page.getByRole("navigation", { name: "Mobile" });
      await expect(mobileNav.getByRole("link", { name: "My lists" })).toBeVisible();
      await expect(mobileNav.getByRole("button", { name: "Sign out" })).toBeVisible();
      if (width === 320 && process.env.SAVE_HEADER_SCREENSHOTS === "1") {
        await page.screenshot({
          path: "/opt/cursor/artifacts/header-320-signed-in-closed.png",
          fullPage: false,
        });
        await page.screenshot({
          path: "/opt/cursor/artifacts/header-320-menu-open.png",
          fullPage: false,
        });
      }
    });

    test(`signed in: app pages fit (${width}px)`, async ({ page }) => {
      await demoSignIn(page);
      for (const path of APP_PATHS) {
        if (new URL(page.url()).pathname !== path) {
          await page.getByRole("navigation", { name: "Account" }).getByRole("link", {
            name: NAV_LABEL[path],
          }).click();
          await waitForPathname(page, path);
        }
        await assertNoHorizontalOverflow(page);
        await assertMenuButtonInViewport(page);
      }
    });
  });
}
