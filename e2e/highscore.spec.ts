import { test, expect } from "@playwright/test";

test("Highscore should only be saved once per day", async ({ page }) => {
  // 1. Setup: Inject winning guess and user data into LocalStorage
  const today = new Date().toISOString().split("T")[0];

  const winningGuess = [
    {
      name: "TestCountry",
      distance: 0,
      direction: "N",
    },
  ];

  const userId = "test-user-id";
  const username = "Test User";

  await page.addInitScript(
    ({ today, winningGuess, userId, username }) => {
      localStorage.setItem(
        "guesses",
        JSON.stringify({ [today]: winningGuess })
      );
      localStorage.setItem("username", JSON.stringify(username));
      localStorage.setItem("userId", JSON.stringify(userId));
      localStorage.setItem(
        "openHighscoreAutomatically",
        JSON.stringify("please do")
      );
    },
    { today, winningGuess, userId, username }
  );

  // 2. Monitor Console Logs for save and abort messages
  let saveLogCount = 0;
  let abortLogCount = 0;
  page.on("console", (msg) => {
    if (msg.text().startsWith("Saving score for")) {
      saveLogCount++;
      console.log("TEST LOG DETECTED:", msg.text());
    }
    if (
      msg
        .text()
        .includes("there's an existing score for this user, don't update")
    ) {
      abortLogCount++;
      console.log("TEST LOG DETECTED (ABORT):", msg.text());
    }
  });

  // 3. Load Page
  await page.goto("http://localhost:3000");

  // 4. Wait for High Score modal (opens automatically)
  await page.waitForSelector("text=High score", { state: "visible" });
  await page.waitForTimeout(2000); // Allow time for useEffect

  // Assert initial save happened
  expect(saveLogCount).toBeGreaterThanOrEqual(1);

  // 5. Close Modal
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);

  // 6. Open Modal Again
  await page.click('button:has-text("High score")');
  await page.waitForTimeout(2000); // Allow time for useEffect

  // 7. Verify correct behavior
  // We expect the "abort" log to appear, verifying the transaction blocked the duplicate write.
  expect(abortLogCount).toBeGreaterThan(0);
});
