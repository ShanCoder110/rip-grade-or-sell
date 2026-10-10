import { test, expect } from "@playwright/test";

async function dismissCookies(page: import("@playwright/test").Page) {
  const accept = page.getByRole("button", { name: "Accept all" });
  if (await accept.isVisible().catch(() => false)) {
    await accept.click();
  }
}

test("grade-or-sell money field clears and accepts a new dollar amount", async ({ page }) => {
  await dismissCookies(page);
  await page.goto("/tools/grade-or-sell");
  const raw = page.locator("#raw-price");
  await raw.waitFor({ state: "visible", timeout: 15_000 });
  await expect(raw).toHaveValue("");
  await expect(raw).toHaveAttribute("placeholder", "20");

  await raw.fill("");
  await raw.type("42.50");
  await expect(raw).toHaveValue("42.50");

  await raw.fill("");
  await raw.type("7");
  await expect(raw).toHaveValue("7");
  await expect(raw).not.toHaveValue(/^0/);
});

test("fee calculator money field clears and accepts decimals", async ({ page }) => {
  await dismissCookies(page);
  await page.goto("/tools/fee-calculator");
  const sale = page.locator("#sale-price");
  await sale.waitFor({ state: "visible", timeout: 15_000 });
  await expect(sale).toHaveValue("");

  await sale.fill("125.5");
  await expect(sale).toHaveValue("125.5");

  await sale.fill("");
  await sale.type("99");
  await expect(sale).toHaveValue("99");
});
