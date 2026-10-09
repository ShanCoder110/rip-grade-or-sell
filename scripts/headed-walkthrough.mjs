import { chromium } from "@playwright/test";

const browser = await chromium.launch({
  headless: false,
  slowMo: 180,
  args: ["--window-size=1280,800"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.addInitScript(() => localStorage.setItem("theme", "light"));
const base = "http://localhost:3000";

async function go(path) {
  await page.goto(base + path, { waitUntil: "networkidle" });
  const accept = page.getByRole("button", { name: "Accept" });
  if (await accept.isVisible().catch(() => false)) await accept.click();
  await page.waitForTimeout(400);
}

await go("/");
await page.mouse.wheel(0, 700);
await page.waitForTimeout(500);
await go("/sets");
await page.getByRole("link", { name: /Stellar Crown/i }).click();
await page.waitForTimeout(600);
await go("/tools/pack-simulator");
await page.getByRole("button", { name: /Open virtual pack/ }).click();
await page.getByText("Last hit").waitFor();
await page.waitForTimeout(500);
await go("/pricing");
await page.getByRole("link", { name: "Sign in to subscribe" }).click();
await page.getByRole("button", { name: "Continue with demo account" }).click();
await page.waitForURL(/pricing/);
await page.getByRole("button", { name: "Subscribe monthly" }).click();
await page.getByText(/Pro is active/i).waitFor();
await page.waitForTimeout(400);
await go("/app/portfolio");
await page.waitForTimeout(400);
await go("/sets/sample-stellar-crown");
await page.getByRole("button", { name: "Toggle color theme" }).click();
await page.waitForTimeout(700);
await browser.close();
