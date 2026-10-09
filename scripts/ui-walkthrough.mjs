import { chromium } from "@playwright/test";

const base = "http://localhost:3000";
const issues = [];

function note(msg) {
  issues.push(msg);
  console.log("ISSUE:", msg);
}

const browser = await chromium.launch({
  headless: process.env.HEADED ? false : true,
  slowMo: process.env.HEADED ? 250 : 0,
});
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on("console", (msg) => {
  const text = msg.text();
  if (msg.type() === "error" || /hydration|did not match/i.test(text)) {
    note(`console ${page.url()}: ${text}`);
  }
});
page.on("pageerror", (err) => note(`pageerror ${page.url()}: ${err.message}`));
page.on("response", (res) => {
  const url = res.url();
  if (url.startsWith(base) && res.status() >= 500) {
    note(`http ${res.status()} ${url}`);
  }
});

async function go(path, allow404 = false) {
  const res = await page.goto(base + path, { waitUntil: "networkidle" });
  const status = res?.status() ?? 0;
  if (!res || (status >= 400 && !(allow404 && status === 404))) note(`nav ${path} status ${status}`);
  await page.waitForTimeout(200);
}

await page.addInitScript(() => localStorage.setItem("theme", "light"));
await go("/");
const cookie = page.getByRole("button", { name: "Accept" });
if (await cookie.isVisible().catch(() => false)) await cookie.click();

await go("/sets");
await page.getByRole("link", { name: /Stellar Crown/i }).click();
await page.waitForURL(/sample-stellar-crown/);
await page.getByRole("link", { name: /Booster Box/i }).click();
await page.waitForURL(/booster-box-ev/);
await page.goBack();
await page.getByRole("link", { name: /Sample Rare Holo/i }).click();
await page.waitForURL(/grade/);

await go("/tools/grade-or-sell?raw=2500&psa9=4000&psa10=9000&fee=2500&ship=400&platform=ebay&condition=mint");
const raw = page.getByLabel("Raw price (cents)");
if ((await raw.inputValue()) !== "2500") note("grade URL param raw not applied");
await page.getByRole("button", { name: /Copy share link|Link copied/ }).click();

await go("/tools/fee-calculator");
await page.getByLabel("Sale price (cents)").fill("8000");
await page.getByText(/net/).first().waitFor();

await go("/tools/pack-simulator");
await page.getByRole("button", { name: /Open virtual pack/ }).click();
await page.getByText("Last hit").waitFor({ timeout: 4000 });

await go("/pricing");
await page.getByRole("button", { name: "Subscribe monthly" }).click();
await page.getByRole("status").waitFor({ timeout: 5000 });

await go("/auth/login");
await page.getByLabel("Email").fill("collector@example.com");
await page.getByRole("button", { name: "Send magic link" }).click();
await page.getByText(/Supabase is not configured/i).waitFor({ timeout: 4000 });

await go("/app/watchlist");
if (!page.url().includes("/auth/login")) note(`watchlist did not gate, url ${page.url()}`);
await go("/app/portfolio");
if (!page.url().includes("/auth/login")) note(`portfolio did not gate, url ${page.url()}`);
await go("/app/alerts");
if (!page.url().includes("/auth/login")) note(`alerts did not gate, url ${page.url()}`);

for (const path of [
  "/about",
  "/methodology",
  "/privacy",
  "/terms",
  "/refund",
  "/affiliate-disclosure",
  "/changelog",
  "/sets/delta-reign",
  "/sets/missing-set",
]) {
  await go(path, path.includes("missing"));
}

await go("/sets/sample-stellar-crown");
await page.getByLabel("Email").fill("fan@example.com");
await page.getByRole("button", { name: "Subscribe" }).click();
await page.getByText(/on the list|Could not|Invalid/i).waitFor({ timeout: 4000 });

await go("/sets/sample-stellar-crown");
await page.getByRole("button", { name: "Toggle color theme" }).click();
const dark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
if (!dark) note("dark mode toggle did not add .dark");

await page.setViewportSize({ width: 390, height: 844 });
await go("/");
await page.getByRole("button", { name: "Menu" }).click();
const mobile = page.getByRole("navigation", { name: "Mobile" });
if (!(await mobile.isVisible())) note("mobile menu did not open");
await page.getByRole("link", { name: "Fees" }).click();
await page.waitForURL(/fee-calculator/);

await browser.close();
console.log(issues.length ? `FOUND ${issues.length}` : "CLEAN");
process.exit(issues.length ? 1 : 0);
