import fs from "node:fs";
import path from "node:path";
import { expect, type Page } from "@playwright/test";

function readEnv(): Record<string, string> {
  const env: Record<string, string> = {};
  for (const line of fs.readFileSync(path.resolve(__dirname, "../.env"), "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z_]+)="?([^"]*)"?$/);
    if (match) env[match[1]] = match[2];
  }
  return env;
}

export const env = readEnv();

export async function signIn(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

/** A brand-new learner, so tests never depend on or disturb each other's progress. */
export async function registerLearner(page: Page) {
  const email = `e2e-${Date.now()}-${Math.floor(Math.random() * 1e6)}@test.local`;
  await page.goto("/register");
  await page.getByLabel("Name").fill("Priya Test");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("correct-horse-1");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  return email;
}

export const signInAdmin = (page: Page) => signIn(page, env.SEED_ADMIN_EMAIL, env.SEED_ADMIN_PASSWORD);

/** The topic card on the practice hub, found by its heading. */
export const topicCard = (page: Page, topic: string) =>
  page.locator("article", { has: page.getByRole("heading", { level: 3, name: topic, exact: true }) });

/** Exam pill, subject card, topic card, then the setup dialog is open. */
export async function openTopicSetup(page: Page, exam: string, subject: string, topic: string) {
  await page.goto("/practice");
  await page.getByRole("group", { name: "Examination" }).getByRole("button", { name: exam, exact: true }).click();
  await page.getByRole("button", { name: new RegExp(`^${subject}`) }).click();
  await topicCard(page, topic).getByRole("button", { name: "Start practice" }).click();
  await expect(page.getByRole("dialog").getByRole("heading", { name: topic })).toBeVisible();
}

export async function startPractice(page: Page, exam: string, subject: string, topic: string, mode: "Practice mode" | "Test mode" = "Practice mode") {
  await openTopicSetup(page, exam, subject, topic);
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: new RegExp(`^${mode}`) }).click();
  await dialog.getByRole("button", { name: "Start session" }).click();
  await expect(page).toHaveURL(/\/practice\/session\//);
  await expect(page.getByRole("radiogroup", { name: "Answer options" })).toBeVisible();
}

/** The answer buttons of the current question. */
export const options = (page: Page) => page.getByRole("radiogroup", { name: "Answer options" }).getByRole("radio");

/** The submit button, whatever mode names it. */
export const submitButton = (page: Page) => page.getByRole("button", { name: /^(Submit|Save answer|Update answer)/ });

export const solution = (page: Page) => page.getByTestId("solution");
