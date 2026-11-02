import { expect, test } from "@playwright/test";
import { env, openTopicSetup, options, registerLearner, signIn, solution, startPractice, submitButton, topicCard } from "./helpers";

test("signed-out visitors are sent to login, and bad logins get an error", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login/);
  await page.getByLabel("Email").fill("nobody@test.local");
  await page.getByLabel("Password").fill("wrong-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByText("Incorrect email or password.")).toBeVisible();
});

test("registration validates input", async ({ page }) => {
  await page.goto("/register");
  await page.getByLabel("Name").fill("A");
  await page.getByLabel("Email").fill("not-an-email");
  await page.getByLabel("Password").fill("short");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByText("Enter a valid email address.")).toBeVisible();
  await expect(page.getByText("Password must be at least 8 characters.")).toBeVisible();
});

test("a new learner sees honest empty states, not invented stats", async ({ page }) => {
  await registerLearner(page);
  await expect(page.getByRole("link", { name: "Start Topic-Wise Practice" })).toBeVisible();
  await expect(page.getByText("No sessions yet")).toBeVisible();
  await expect(page.getByText("0 days streak")).toBeVisible();

  for (const [path, text] of [
    ["/analytics", "No data yet"],
    ["/bookmarks", "No bookmarks yet"],
    ["/mistakes", "No mistakes recorded"],
    ["/history", "Nothing here yet"],
    ["/pyq", "No verified previous-year questions yet"],
  ]) {
    await page.goto(path);
    await expect(page.getByText(text)).toBeVisible();
  }
});

test("sidebar reaches all nine sections", async ({ page }) => {
  await registerLearner(page);
  const nav = page.getByRole("navigation", { name: "Main" });
  for (const [label, heading] of [
    ["Practice Questions", "Choose what you want to master"],
    ["Mock Tests", "Mock Tests"],
    ["Previous Year Questions", "Previous Year Questions"],
    ["Bookmarks", "Bookmarks"],
    ["My Mistakes", "My Mistakes"],
    ["Performance Analytics", "Performance Analytics"],
    ["Study History", "Study History"],
    ["Settings", "Settings"],
  ]) {
    await nav.getByRole("link", { name: label }).click();
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
  }
  await nav.getByRole("link", { name: "Dashboard" }).click();
  await expect(page.getByRole("link", { name: "Start Topic-Wise Practice" })).toBeVisible();
});

test("the practice hub shows only the selected exam's subjects and topics", async ({ page }) => {
  await registerLearner(page);
  await page.goto("/practice");
  const exams = page.getByRole("group", { name: "Examination" });
  await exams.getByRole("button", { name: "IBPS PO", exact: true }).click();
  await expect(page.getByRole("button", { name: /^Quantitative Aptitude/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /^Professional Knowledge/ })).toHaveCount(0);

  await exams.getByRole("button", { name: "IBPS SO IT", exact: true }).click();
  await expect(page.getByRole("button", { name: /^Professional Knowledge/ })).toBeVisible();

  // Clerk configuration leaves this topic out; PO keeps it.
  await page.goto("/practice?exam=ibps-clerk");
  await page.getByRole("button", { name: /^Quantitative Aptitude/ }).click();
  await expect(topicCard(page, "Percentage")).toBeVisible();
  await expect(topicCard(page, "Permutation and Combination")).toHaveCount(0);

  // The top-bar search lands on matching topics.
  await page.getByRole("searchbox", { name: "Search topics" }).fill("syllog");
  await page.getByRole("searchbox", { name: "Search topics" }).press("Enter");
  await expect(page).toHaveURL(/q=syllog/);
  await expect(topicCard(page, "Syllogism")).toBeVisible();
});

test("practice mode: answer, reveal, navigate, bookmark, mark, report, finish, and it all shows up", async ({ page }) => {
  await registerLearner(page);
  await startPractice(page, "IBPS PO", "English Language", "Noun");

  // Nothing is revealed up front, and submit needs a selection.
  await expect(page.getByRole("button", { name: "Show explanation" })).toBeVisible();
  await expect(solution(page)).toHaveCount(0);
  await expect(submitButton(page)).toBeDisabled();

  await options(page).first().click();
  await submitButton(page).click();
  await expect(solution(page)).toBeVisible();
  await expect(solution(page).getByText(/^(Correct|Incorrect)$/)).toBeVisible();
  await expect(options(page).first()).toBeDisabled();

  // Solution can be collapsed and reopened.
  const toggle = solution(page).getByRole("button", { name: /^(Hide|Show) solution$/ });
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();

  // Next and previous keep the answered state.
  await page.getByRole("button", { name: "Next question" }).click();
  await expect(page.getByText("Question 2 of", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Previous" }).click();
  await expect(solution(page)).toBeVisible();
  await page.getByRole("button", { name: "Next question" }).click();

  // Bookmark and mark for review.
  await page.getByRole("button", { name: "Bookmark question" }).click();
  await expect(page.getByRole("button", { name: "Remove bookmark" })).toBeVisible();
  await page.getByRole("button", { name: "Mark for review", exact: true }).click();
  await expect(page.getByRole("button", { name: "Marked for review", exact: true })).toBeVisible();

  // Report.
  await page.getByRole("button", { name: "Report incorrect question" }).click();
  await page.getByLabel("Details (optional)").fill("Option wording looks off.");
  await page.getByRole("button", { name: "Send report" }).click();
  await expect(page.getByText("An administrator will review")).toBeVisible();

  // Clear choice, then skip.
  await options(page).nth(1).click();
  await expect(options(page).nth(1)).toHaveAttribute("aria-checked", "true");
  await page.getByRole("button", { name: "Clear choice" }).click();
  await expect(options(page).nth(1)).toHaveAttribute("aria-checked", "false");
  await page.getByRole("button", { name: "Skip" }).click();
  await expect(page.getByText("Question 3 of", { exact: false })).toBeVisible();

  // Show explanation early locks the question.
  await page.getByRole("button", { name: "Show explanation" }).click();
  await page.getByRole("alertdialog").getByRole("button", { name: "Show explanation" }).click();
  await expect(page.getByText("Viewed without answering")).toBeVisible();

  // Progress survives a reload.
  await page.reload();
  await expect(page.getByText("Question 3 of", { exact: false })).toBeVisible();
  await expect(page.getByText("Viewed without answering")).toBeVisible();

  await page.getByRole("button", { name: "Finish" }).click();
  await page.getByRole("alertdialog").getByRole("button", { name: "Finish" }).click();
  await expect(page).toHaveURL(/\/results/);
  await expect(page.getByRole("heading", { name: "Solutions" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Practise this topic again" })).toBeVisible();

  // The answer now counts everywhere.
  await page.goto("/dashboard");
  await expect(page.getByText("+1 today")).toBeVisible();
  await page.goto("/history");
  await expect(page.getByRole("cell", { name: /Noun/ })).toBeVisible();
  await page.goto("/bookmarks");
  await expect(page.getByRole("heading", { name: /English Language · Noun/ })).toBeVisible();
  await page.goto("/analytics");
  await expect(page.getByText("Daily practice activity")).toBeVisible();
  await expect(page.locator(".recharts-surface").first()).toBeVisible();
});

test("test mode hides answers until the end, then shows every solution", async ({ page }) => {
  await registerLearner(page);
  await startPractice(page, "SBI PO", "Quantitative Aptitude", "Percentage", "Test mode");

  await options(page).first().click();
  await submitButton(page).click();
  await expect(page.getByText("Answer saved.")).toBeVisible();
  await expect(page.getByText("Question 2 of", { exact: false })).toBeVisible();
  await expect(page.getByRole("button", { name: "Show explanation" })).toHaveCount(0);

  await page.getByRole("button", { name: "Previous" }).click();
  await expect(solution(page)).toHaveCount(0);
  await expect(options(page).first()).toBeEnabled();
  await expect(page.getByRole("button", { name: "Update answer" })).toBeVisible();

  await page.getByRole("button", { name: "Finish" }).click();
  await page.getByRole("alertdialog").getByRole("button", { name: "Finish" }).click();
  await expect(page).toHaveURL(/\/results/);
  await expect(page.getByText("Explanation").first()).toBeVisible();
});

test("keyboard: number keys choose, Enter submits, arrows move", async ({ page }) => {
  await registerLearner(page);
  await startPractice(page, "IBPS PO", "English Language", "Verb");
  await page.locator("body").click({ position: { x: 1, y: 1 } });
  await page.keyboard.press("2");
  await expect(options(page).nth(1)).toHaveAttribute("aria-checked", "true");
  await page.keyboard.press("Enter");
  await expect(solution(page)).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByText("Question 2 of", { exact: false })).toBeVisible();
});

test("mistakes: a wrong answer lands in the notebook, and a correct retry fixes it", async ({ page }) => {
  await registerLearner(page);
  await startPractice(page, "IBPS PO", "English Language", "Adverb");

  // Option A is the key for only one of the four Adverb questions, so this finds a wrong one.
  let foundWrong = false;
  for (let i = 0; i < 4 && !foundWrong; i += 1) {
    await options(page).first().click();
    await submitButton(page).click();
    await expect(solution(page)).toBeVisible();
    foundWrong = await solution(page).getByText("Incorrect", { exact: true }).isVisible();
    if (!foundWrong && i < 3) await page.getByRole("button", { name: "Next question" }).click();
  }
  expect(foundWrong).toBe(true);

  await page.goto("/mistakes");
  await expect(page.getByText("Your answer").first()).toBeVisible();
  await expect(page.getByText("Correct answer").first()).toBeVisible();
  await expect(page.getByText(/Wrong 1 time/).first()).toBeVisible();

  // The option row inside the first notebook entry: letter, text, then the label.
  const correctText = (await page.locator("li li", { hasText: "Correct answer" }).first().innerText()).split("\n")[1];
  await page.getByRole("button", { name: "Retry", exact: true }).first().click();
  await expect(page).toHaveURL(/\/practice\/session\//);
  await options(page).filter({ hasText: correctText }).first().click();
  await submitButton(page).click();
  await expect(solution(page).getByText("Correct", { exact: true })).toBeVisible();

  await page.goto("/mistakes");
  await page.getByRole("button", { name: /^Fixed \(1\)/ }).click();
  await expect(page.getByText("Fixed on retry")).toBeVisible();
});

test("mini mock: timer, palette, negative marking note, section flow, summary and solutions", async ({ page }) => {
  await registerLearner(page);
  await page.goto("/mock-tests");
  const card = page.locator("section", { hasText: "IBPS PO" }).locator("section", { hasText: "IBPS PO Mini Mock" }).first();
  await card.getByRole("button", { name: "Start" }).click();
  await page.getByRole("alertdialog").getByRole("button", { name: "Start test" }).click();
  await expect(page).toHaveURL(/\/mock-tests\/attempt\//);

  const timer = page.getByRole("timer", { name: /Time left/ });
  await expect(timer).toBeVisible();
  await expect(page.getByText(/for correct/)).toBeVisible();
  const before = await timer.innerText();
  await expect(timer).not.toHaveText(before, { timeout: 5000 });

  // Later sections are locked under sectional timing.
  await expect(page.getByRole("navigation", { name: "Sections" }).getByRole("button").nth(1)).toBeDisabled();

  await options(page).first().click();
  await expect(options(page).first()).toHaveAttribute("aria-checked", "true");
  await page.getByRole("button", { name: /Mark for review/ }).click();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.getByText("Question 2", { exact: false })).toBeVisible();

  // Answers survive a reload.
  await page.reload();
  await expect(timer).toBeVisible();
  await expect(options(page).first()).toHaveAttribute("aria-checked", "true");

  // Move on, then submit.
  await page.getByRole("button", { name: "Next section" }).click();
  await page.getByRole("alertdialog").getByRole("button", { name: "End section" }).click();
  await expect(page.getByRole("navigation", { name: "Sections" }).getByRole("button").nth(1)).toBeEnabled();
  await expect(page.getByRole("navigation", { name: "Sections" }).getByRole("button").first()).toBeDisabled();

  await page.getByRole("button", { name: "Submit test" }).click();
  await page.getByRole("alertdialog").getByRole("button", { name: "Submit test" }).click();
  await expect(page).toHaveURL(/\/results/);
  await expect(page.getByRole("heading", { name: "Section-wise score" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Detailed solutions" })).toBeVisible();

  await page.goto("/mock-tests");
  await expect(page.getByRole("link", { name: /Last score/ }).first()).toBeVisible();
});

test("settings: saves target and exam, changes password, resets progress with confirmation", async ({ page }) => {
  const email = await registerLearner(page);
  await page.goto("/settings");
  await page.getByLabel("Daily question target").fill("9999");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText("Target must be 500 or fewer.")).toBeVisible();

  await page.getByLabel("Daily question target").fill("50");
  await page.getByLabel("Preferred exam").selectOption({ label: "SBI Clerk" });
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText("Settings saved.")).toBeVisible();
  await page.goto("/dashboard");
  await expect(page.getByText("/ 50 solved").first()).toBeVisible();
  await expect(page.getByText("Target: SBI Clerk")).toBeVisible();
  await page.goto("/practice");
  const exams = page.getByRole("group", { name: "Examination" });
  await expect(exams.getByRole("button", { name: "SBI Clerk", exact: true })).toHaveAttribute("aria-pressed", "true");

  // The top-bar switcher changes the target too.
  await page.getByLabel("Target exam").selectOption({ label: "IBPS PO" });
  await page.goto("/practice");
  await expect(exams.getByRole("button", { name: "IBPS PO", exact: true })).toHaveAttribute("aria-pressed", "true");

  await page.goto("/settings");
  await page.getByLabel("Current password").fill("wrong-password");
  await page.getByLabel("New password").fill("another-horse-2");
  await page.getByRole("button", { name: "Update password" }).click();
  await expect(page.getByText("Your current password is incorrect.")).toBeVisible();
  await page.getByLabel("Current password").fill("correct-horse-1");
  await page.getByRole("button", { name: "Update password" }).click();
  await expect(page.getByText("Password changed.")).toBeVisible();

  await page.getByRole("button", { name: "Reset my progress" }).click();
  await expect(page.getByRole("alertdialog")).toContainText("can't be undone");
  await page.getByRole("alertdialog").getByRole("button", { name: "Cancel" }).click();
  await expect(page.getByRole("alertdialog")).toHaveCount(0);

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/login/);
  await signIn(page, email, "another-horse-2");
});

test("another user's session is not reachable", async ({ browser }) => {
  const first = await browser.newContext();
  const pageA = await first.newPage();
  await registerLearner(pageA);
  await startPractice(pageA, "IBPS PO", "English Language", "Pronoun");
  const url = pageA.url();

  const second = await browser.newContext();
  const pageB = await second.newPage();
  await registerLearner(pageB);
  await pageB.goto(url);
  await expect(pageB.getByText("Page not found")).toBeVisible();
  await first.close();
  await second.close();
});

test("learners cannot open the admin panel", async ({ page }) => {
  await signIn(page, env.SEED_DEMO_EMAIL, env.SEED_DEMO_PASSWORD);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/dashboard/);
  await page.goto("/admin/questions");
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByRole("link", { name: "Admin panel" })).toHaveCount(0);
});

test("the setup dialog disables difficulties that have no questions, warns on shortfalls, and opens from a deep link", async ({ page }) => {
  await registerLearner(page);
  await openTopicSetup(page, "IBPS PO", "English Language", "Noun");
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "50", exact: true }).click();
  await expect(dialog.getByText(/so the session will have/)).toBeVisible();
  await dialog.getByLabel("Custom").fill("1000");
  await expect(dialog.getByText(/whole number between 1 and 100/)).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Start session" })).toBeDisabled();

  // Finish a session, then follow the results page's deep link back to the same topic.
  await dialog.getByLabel("Custom").fill("");
  await dialog.getByRole("button", { name: "Start session" }).click();
  await expect(page).toHaveURL(/\/practice\/session\//);
  await page.getByRole("button", { name: "Finish" }).click();
  await page.getByRole("alertdialog").getByRole("button", { name: "Finish" }).click();
  await expect(page).toHaveURL(/\/results/);
  await page.getByRole("link", { name: "Practise this topic again" }).click();
  await expect(page).toHaveURL(/\/practice\?/);
  await expect(page.getByRole("dialog").getByRole("heading", { name: "Noun" })).toBeVisible();
});
