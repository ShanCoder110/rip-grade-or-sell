import { test, expect } from "@playwright/test";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";

async function demoSignIn(page: import("@playwright/test").Page) {
  const accept = page.getByRole("button", { name: "Accept all" });
  if (await accept.isVisible().catch(() => false)) await accept.click();
  await page.goto("/auth/login?next=/app/watchlist");
  const demo = page.getByRole("button", { name: /demo account/i });
  await expect(demo).toBeVisible();
  await demo.click();
  await page.waitForURL(/\/app\/watchlist/);
}

test("demo watchlist edit and remove", async ({ page }) => {
  await demoSignIn(page);
  await page.getByRole("button", { name: "Add sample card" }).click();
  await expect(page.getByText("Sample Rare Holo")).toBeVisible();
  await page.getByRole("button", { name: "Edit" }).click();
  await page.getByLabel("Watchlist label").fill("Edited chase card");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Edited chase card")).toBeVisible();
  await page.getByRole("button", { name: "Remove" }).click();
  await expect(page.getByText("Edited chase card")).toHaveCount(0);
});

test("demo portfolio import edit remove and clear all", async ({ page }) => {
  await demoSignIn(page);
  await page.getByRole("link", { name: "Portfolio" }).click();
  await page.waitForURL(/\/app\/portfolio/);

  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "rgs-csv-"));
  const csvPath1 = path.join(dir, "holdings-1.csv");
  const csvPath2 = path.join(dir, "holdings-2.csv");
  await fs.writeFile(csvPath1, "card_id,quantity\ndemo-card-1,2\n");
  await fs.writeFile(csvPath2, "card_id,quantity\ndemo-card-2,3\n");

  await page.getByLabel("CSV file").setInputFiles(csvPath1);
  await expect(page.getByText("demo-card-1")).toBeVisible();

  await page.getByRole("button", { name: "Edit" }).click();
  await page.getByRole("spinbutton", { name: "Quantity" }).fill("5");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("×5")).toBeVisible();

  await page.getByRole("button", { name: "Remove" }).click();
  await expect(page.getByText("demo-card-1")).toHaveCount(0);

  await page.getByLabel("CSV file").setInputFiles(csvPath2);
  await expect(page.getByText("demo-card-2")).toBeVisible();
  page.on("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Clear all holdings" }).click();
  await expect(page.getByText("No holdings")).toBeVisible();
  await expect(page.getByText("demo-card-2")).toHaveCount(0);
});

test("demo alerts edit and remove", async ({ page }) => {
  await demoSignIn(page);
  await page.getByRole("link", { name: "Alerts" }).click();
  await page.waitForURL(/\/app\/alerts/);
  await page.getByPlaceholder("Raw under $25").fill("Price dip");
  await page.getByRole("button", { name: "Add rule" }).click();
  await expect(page.getByText(/Price dip/)).toBeVisible();
  await page.getByRole("button", { name: "Edit" }).click();
  await page.getByLabel("Alert label").fill("Updated alert");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText(/Updated alert/)).toBeVisible();
  await page.getByRole("button", { name: "Remove" }).click();
  await expect(page.getByText(/Updated alert/)).toHaveCount(0);
});
