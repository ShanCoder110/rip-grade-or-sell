import { chromium } from "@playwright/test";

const base = "http://localhost:3000";
const out = "/opt/cursor/artifacts";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on("console", (msg) => {
  const text = msg.text();
  if (msg.type() === "error" || /hydration|did not match/i.test(text)) errors.push(`${page.url()} :: ${text}`);
});
page.on("pageerror", (err) => errors.push(`pageerror ${err.message}`));

await page.addInitScript(() => localStorage.setItem("theme", "light"));
await page.goto(base + "/", { waitUntil: "networkidle" });
const accept = page.getByRole("button", { name: "Accept" });
if (await accept.isVisible().catch(() => false)) await accept.click();

const shots = [
  ["/", "screenshot-home.png"],
  ["/sets", "screenshot-sets.png"],
  ["/sets/sample-stellar-crown", "screenshot-sets-sample-stellar-crown.png"],
  ["/sets/sample-stellar-crown/booster-box-ev", "screenshot-product-ev.png"],
  ["/tools/grade-or-sell", "screenshot-tools-grade-or-sell.png"],
  ["/tools/fee-calculator", "screenshot-tools-fee-calculator.png"],
  ["/tools/pack-simulator", "screenshot-tools-pack-simulator.png"],
  ["/pricing", "screenshot-pricing.png"],
];

for (const [path, file] of shots) {
  await page.goto(base + path, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${out}/${file}`, fullPage: true });
}

await page.addInitScript(() => localStorage.setItem("theme", "dark"));
const dark = await browser.newPage({ viewport: { width: 1280, height: 900 }, colorScheme: "dark" });
await dark.addInitScript(() => localStorage.setItem("theme", "dark"));
await dark.goto(base + "/sets/sample-stellar-crown", { waitUntil: "networkidle" });
await dark.evaluate(() => document.documentElement.classList.add("dark"));
await dark.screenshot({ path: `${out}/screenshot-set-dark.png`, fullPage: true });
await dark.close();

await page.setViewportSize({ width: 390, height: 844 });
await page.goto(base + "/", { waitUntil: "networkidle" });
await page.screenshot({ path: `${out}/screenshot-home-mobile.png`, fullPage: true });

console.log(errors.length ? errors.join("\n") : "NO_CONSOLE_ERRORS");
await browser.close();
