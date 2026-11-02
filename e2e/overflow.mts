// Finds elements wider than the phone viewport: `npx tsx e2e/overflow.mts <port> <route>`.
import fs from "node:fs";
import { chromium } from "@playwright/test";

const base = `http://localhost:${process.argv[2] ?? "3200"}`;
const route = process.argv[3] ?? "/dashboard";
const env: Record<string, string> = {};
for (const line of fs.readFileSync(".env", "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)="?([^"]*)"?$/);
  if (m) env[m[1]] = m[2];
}
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
await page.goto(`${base}/login`);
await page.getByLabel("Email").fill(env.SEED_DEMO_EMAIL);
await page.getByLabel("Password").fill(env.SEED_DEMO_PASSWORD);
await page.getByRole("button", { name: "Sign in" }).click();
await page.waitForURL(/dashboard/);
await page.goto(`${base}${route}`);
await page.waitForTimeout(500);
const wide = await page.evaluate(() =>
  [...document.querySelectorAll<HTMLElement>("body *")]
    .map((el) => ({ el, rect: el.getBoundingClientRect() }))
    .filter(({ rect }) => rect.right > 391 && rect.width > 0)
    .slice(0, 12)
    .map(({ el, rect }) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 80)} right=${Math.round(rect.right)} text=${(el.textContent ?? "").trim().slice(0, 40)}`),
);
console.log(wide.join("\n") || "no overflow");
await browser.close();
