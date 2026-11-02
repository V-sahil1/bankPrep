import { expect, test } from "@playwright/test";
import { env, registerLearner, signInAdmin, startPractice } from "./helpers";

const stamp = Date.now();

async function fillQuestion(page: import("@playwright/test").Page, text: string) {
  await page.getByLabel("Primary exam").selectOption({ label: "IBPS PO" });
  await page.getByLabel("Subject", { exact: true }).selectOption({ label: "Quantitative Aptitude" });
  await page.getByLabel("Topic", { exact: true }).selectOption({ label: "Average" });
  await page.getByLabel("Question text").fill(text);
  for (const [i, letter] of ["A", "B", "C", "D"].entries()) {
    await page.getByLabel(`Option ${letter}`, { exact: true }).fill(`Choice ${i + 1}`);
  }
  await page.getByLabel("Explanation").fill("Because the working shows it.");
}

test("overview shows live bank statistics", async ({ page }) => {
  await signInAdmin(page);
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Question bank overview" })).toBeVisible();
  await expect(page.getByText("Illustrative samples")).toBeVisible();
});

test("question form validates, then a question is added, edited and deleted", async ({ page }) => {
  await signInAdmin(page);
  await page.goto("/admin/questions/new");
  await page.getByRole("button", { name: "Add question" }).click();
  await expect(page.getByText("Select an exam.")).toBeVisible();
  await expect(page.getByText("Enter the question text.")).toBeVisible();

  const text = `E2E average question ${stamp}?`;
  await fillQuestion(page, text);
  await page.getByRole("button", { name: "Add question" }).click();
  await expect(page).toHaveURL(/\/admin\/questions$/);

  await page.goto(`/admin/questions?q=${encodeURIComponent(text)}`);
  await expect(page.getByText(text)).toBeVisible();
  await page.getByRole("link", { name: "Edit question" }).click();
  await page.getByLabel("Question text").fill(`${text} edited`);
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page).toHaveURL(/\/admin\/questions$/);

  await page.goto(`/admin/questions?q=${encodeURIComponent(`${text} edited`)}`);
  await page.getByLabel("Difficulty", { exact: true }).last().selectOption("HARD");
  await expect(page.getByText("Difficulty updated.")).toBeVisible();

  await page.getByRole("button", { name: "Delete question" }).click();
  await page.getByRole("alertdialog").getByRole("button", { name: "Delete" }).click();
  await expect(page.getByText("Question deleted.")).toBeVisible();
  await expect(page.getByText("No questions match")).toBeVisible();
});

test("a PYQ needs a source and stays hidden from learners until verified", async ({ page, browser }) => {
  await signInAdmin(page);
  await page.goto("/admin/questions/new");
  const text = `E2E pyq question ${stamp}?`;
  await fillQuestion(page, text);
  await page.getByLabel("Source type").selectOption("PYQ");
  await page.getByRole("button", { name: "Add question" }).click();
  await expect(page.getByText("A previous-year question needs its source")).toBeVisible();

  await page.getByLabel(/Source reference/).fill("IBPS PO test source, shift 1");
  await page.getByRole("button", { name: "Add question" }).click();
  await expect(page).toHaveURL(/\/admin\/questions$/);

  const learner = await browser.newContext();
  const learnerPage = await learner.newPage();
  await registerLearner(learnerPage);
  await learnerPage.goto("/pyq");
  await expect(learnerPage.getByText("Average")).toHaveCount(0);

  await page.goto("/admin/pyq");
  const item = page.locator("li", { hasText: text });
  await expect(item.getByText("Unverified PYQ")).toBeVisible();
  await item.getByRole("button", { name: "Verify" }).click();
  await page.getByRole("alertdialog").getByRole("button", { name: "Verify" }).click();
  await expect(item.getByText("Verified PYQ")).toBeVisible();

  await learnerPage.goto("/pyq");
  await expect(learnerPage.getByText(/Average/)).toBeVisible();
  await learner.close();

  // Clean up so this question doesn't linger in the bank.
  await page.goto(`/admin/questions?q=${encodeURIComponent(text)}`);
  await page.getByRole("button", { name: "Delete question" }).click();
  await page.getByRole("alertdialog").getByRole("button", { name: "Delete" }).click();
  await expect(page.getByText("Question deleted.")).toBeVisible();
});

test("bulk import reports row errors, then imports a clean file", async ({ page }) => {
  await signInAdmin(page);
  await page.goto("/admin/import");
  const header =
    "examSlug,subjectSlug,topic,subtopic,questionText,optionA,optionB,optionC,optionD,correct,explanation,difficulty,tags,relevantExamSlugs,sourceType,sourceReference";
  const good = `ibps-po,quant,Average,,E2E import ${stamp}?,1,2,3,4,B,Two is the average here.,EASY,avg,sbi-po,,`;
  const bad = `no-exam,quant,Average,,E2E broken ${stamp}?,1,2,3,4,Z,Short.,EASY,,,,`;

  await page.locator('input[type="file"]').setInputFiles({ name: "q.csv", mimeType: "text/csv", buffer: Buffer.from(`${header}\n${good}\n${bad}\n`) });
  await expect(page.getByText("1 with errors")).toBeVisible();
  await expect(page.getByRole("button", { name: /Import \d+ questions/ })).toBeDisabled();

  await page.locator('input[type="file"]').setInputFiles({ name: "q2.csv", mimeType: "text/csv", buffer: Buffer.from(`${header}\n${good}\n`) });
  await expect(page.getByText("1 valid")).toBeVisible();
  await page.getByRole("button", { name: "Import 1 questions" }).click();
  await expect(page.getByText("Imported 1 questions.")).toBeVisible();

  await page.locator('input[type="file"]').setInputFiles({ name: "q.json", mimeType: "application/json", buffer: Buffer.from("{not json") });
  await expect(page.getByText("That file is not valid JSON.")).toBeVisible();

  await page.goto(`/admin/questions?q=${encodeURIComponent(`E2E import ${stamp}`)}`);
  await page.getByRole("button", { name: "Delete question" }).click();
  await page.getByRole("alertdialog").getByRole("button", { name: "Delete" }).click();
  await expect(page.getByText("Question deleted.")).toBeVisible();
});

test("catalog: add, rename and remove a topic; deletion of a topic in use is refused", async ({ page }) => {
  await signInAdmin(page);
  await page.goto("/admin/catalog");
  const subject = page.locator("details", { hasText: "Quantitative Aptitude" });
  await subject.locator("summary").click({ position: { x: 5, y: 5 } });
  await subject.getByRole("button", { name: "Add topic" }).click();
  await page.getByLabel("Name", { exact: true }).fill(`Zeta ${stamp}`);
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Saved.").first()).toBeVisible();
  await expect(subject.getByRole("button", { name: `Rename Zeta ${stamp}` })).toBeVisible();

  await subject.getByRole("button", { name: `Rename Zeta ${stamp}` }).click();
  await page.getByLabel("Name", { exact: true }).fill(`Zeta2 ${stamp}`);
  await page.getByRole("button", { name: "Save" }).click();
  await expect(subject.getByRole("button", { name: `Rename Zeta2 ${stamp}` })).toBeVisible();

  await subject.getByRole("button", { name: `Delete Zeta2 ${stamp}` }).click();
  await page.getByRole("alertdialog").getByRole("button", { name: "Delete topic" }).click();
  await expect(subject.getByRole("button", { name: `Rename Zeta2 ${stamp}` })).toHaveCount(0);

  await subject.getByRole("button", { name: "Delete Percentage" }).click();
  await page.getByRole("alertdialog").getByRole("button", { name: "Delete topic" }).click();
  await expect(page.getByText("This topic still has questions.")).toBeVisible();
});

test("exam patterns can be edited, and editing voids verification", async ({ page }) => {
  await signInAdmin(page);
  await page.goto("/admin/patterns");
  await page.getByLabel("Exam", { exact: true }).selectOption({ label: "SBI Clerk" });
  const panel = page.locator("section", { hasText: "Mock tests on this pattern" }).first();
  await panel.getByRole("button", { name: "Mark verified" }).click();
  await page.getByRole("alertdialog").getByRole("button", { name: "Mark verified" }).click();
  await expect(panel.getByRole("button", { name: "Remove", exact: true })).toBeVisible();

  await panel.getByRole("button", { name: "Save pattern" }).click();
  await expect(page.getByText(/needs verifying again/)).toBeVisible();
  await expect(panel.getByRole("button", { name: "Mark verified" })).toBeVisible();
});

test("AI generation is disabled, with an explanation, when no key is configured", async ({ page }) => {
  test.skip(Boolean(env.GEMINI_API_KEY), "A key is configured.");
  await signInAdmin(page);
  await page.goto("/admin/ai");
  await expect(page.getByText(/AI generation is off/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Generate" })).toBeDisabled();
  await page.goto("/admin/review");
  await expect(page.getByText("Nothing to review")).toBeVisible();

  // The curated bank keeps working without a key.
  await startPractice(page, "IBPS PO", "English Language", "Tenses");
});

test("reports reach the admin queue and can be resolved", async ({ page, browser }) => {
  const learner = await browser.newContext();
  const learnerPage = await learner.newPage();
  await registerLearner(learnerPage);
  await startPractice(learnerPage, "IBPS PO", "English Language", "Articles");
  const details = `Looks wrong ${stamp}`;
  await learnerPage.getByRole("button", { name: "Report incorrect question" }).click();
  await learnerPage.getByLabel("Details (optional)").fill(details);
  await learnerPage.getByRole("button", { name: "Send report" }).click();
  await expect(learnerPage.getByText("An administrator will review")).toBeVisible();
  await learner.close();

  await signInAdmin(page);
  await page.goto("/admin/reports");
  const report = page.locator("li", { hasText: details });
  await expect(report).toBeVisible();
  await report.getByRole("button", { name: "Mark resolved" }).click();
  await expect(page.locator("li", { hasText: details })).toHaveCount(0);
});
