// Manual visual check: `npx tsx e2e/screens.mts <outDir> <port>` with a production server running.
import fs from "node:fs";
import path from "node:path";
import { chromium, type Page } from "@playwright/test";

const out = process.argv[2];
const base = `http://localhost:${process.argv[3] ?? "3200"}`;
fs.mkdirSync(out, { recursive: true });
const env: Record<string, string> = {};
for (const line of fs.readFileSync(".env", "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)="?([^"]*)"?$/);
  if (m) env[m[1]] = m[2];
}

const browser = await chromium.launch();
const errors: string[] = [];

async function session(colorScheme: "light" | "dark", viewport: { width: number; height: number }, email: string, password: string) {
  const context = await browser.newContext({ colorScheme, viewport });
  const page = await context.newPage();
  page.on("console", (m) => m.type() === "error" && errors.push(`${page.url()}: ${m.text()}`));
  page.on("pageerror", (e) => errors.push(`${page.url()}: ${e.message}`));
  await page.goto(`${base}/login`);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(/dashboard/);
  return page;
}

const shot = async (page: Page, name: string, full = true) => {
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(out, `${name}.png`), fullPage: full });
};

const page = await session("light", { width: 1366, height: 860 }, env.SEED_DEMO_EMAIL, env.SEED_DEMO_PASSWORD);

// Real history for the demo account so populated screens can be judged.
for (const topic of ["Noun", "Tenses"]) {
  await page.goto(`${base}/practice?exam=ibps-po`);
  await page.getByRole("button", { name: /^English Language/ }).click();
  await page.locator("article", { has: page.getByRole("heading", { level: 3, name: topic, exact: true }) }).getByRole("button", { name: "Start practice" }).click();
  if (topic === "Noun") await shot(page, "hub-setup-dialog", false);
  await page.getByRole("dialog").getByRole("button", { name: "Start session" }).click();
  await page.waitForURL(/session/);
  const total = await page.getByRole("complementary", { name: "Question palette" }).getByRole("button").count();
  for (let i = 0; i < total; i += 1) {
    await page.getByRole("radiogroup", { name: "Answer options" }).getByRole("radio").nth(i % 4).click();
    if (topic === "Noun" && i === 0) await shot(page, "question-selected", false);
    await page.getByRole("button", { name: /^Submit/ }).click();
    await page.getByTestId("solution").waitFor();
    if (topic === "Noun" && i === 0) await shot(page, "question-solution");
    if (i < total - 1) await page.getByRole("button", { name: "Next question" }).click();
  }
  await page.getByRole("button", { name: "See results" }).click();
  await page.waitForURL(/results/);
}
await shot(page, "results");

for (const [route, name] of [
  ["/dashboard", "dashboard"],
  ["/practice?exam=ibps-po", "hub"],
  ["/practice?exam=ibps-so-it", "hub-so-it"],
  ["/analytics", "analytics"],
  ["/mock-tests", "mock-list"],
  ["/mistakes", "mistakes"],
  ["/history", "history"],
  ["/settings", "settings"],
] as const) {
  await page.goto(`${base}${route}`);
  await shot(page, name);
}

await page.goto(`${base}/mock-tests`);
await page.locator("section", { hasText: "RBI Assistant" }).locator("section", { hasText: "Mini Mock" }).first().getByRole("button", { name: "Start" }).click();
await page.getByRole("alertdialog").getByRole("button", { name: "Start test" }).click();
await page.waitForURL(/attempt/);
await page.getByRole("radiogroup", { name: "Answer options" }).getByRole("radio").first().click();
await shot(page, "mock-runner", false);

const dark = await session("dark", { width: 1366, height: 860 }, env.SEED_DEMO_EMAIL, env.SEED_DEMO_PASSWORD);
await shot(dark, "dark-dashboard", false);
await dark.goto(`${base}/practice?exam=ibps-po`);
await shot(dark, "dark-hub", false);

const phone = await session("light", { width: 390, height: 800 }, env.SEED_DEMO_EMAIL, env.SEED_DEMO_PASSWORD);
for (const route of ["/dashboard", "/practice", "/mock-tests", "/analytics", "/mistakes", "/history", "/settings"]) {
  await phone.goto(`${base}${route}`);
  await phone.waitForTimeout(250);
  const width = await phone.evaluate(() => document.documentElement.scrollWidth);
  console.log(`phone ${route}: scrollWidth ${width}${width > 390 ? "  <-- OVERFLOW" : ""}`);
}
await phone.goto(`${base}/dashboard`);
await shot(phone, "phone-dashboard");
await phone.goto(`${base}/practice?exam=ibps-po`);
await shot(phone, "phone-hub", false);

const admin = await session("light", { width: 1366, height: 860 }, env.SEED_ADMIN_EMAIL, env.SEED_ADMIN_PASSWORD);
await admin.goto(`${base}/admin`);
await shot(admin, "admin-overview", false);
await admin.goto(`${base}/admin/questions`);
await shot(admin, "admin-questions", false);

console.log("console errors:", errors);
await browser.close();
