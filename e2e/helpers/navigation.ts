import { expect, type Page } from "@playwright/test";

export function hasPathname(pathname: string) {
  return (url: URL) => url.pathname === pathname;
}

export async function waitForPathname(page: Page, pathname: string, timeout = 15_000) {
  await page.waitForURL(hasPathname(pathname), { timeout });
  expect(new URL(page.url()).pathname).toBe(pathname);
}
