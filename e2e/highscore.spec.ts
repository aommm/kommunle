import { test, expect } from '@playwright/test';

test('Highscore should only be saved once per day', async ({ page }) => {
  // 1. Setup: Mock date and LocalStorage
  const FIXED_DATE = '2022-02-01'; // Matches a date format the app uses
  
  // Force the app to think "today" is FIXED_DATE
  // We can't easily mock imports in E2E, but we can rely on the app using system time 
  // or just let it use real time and we use the real date string.
  // Actually, using real date is safer for E2E without complex mocking.
  // Let's just use the real current date string for our guess.
  
  const today = new Date().toISOString().split('T')[0];
  
  const winningGuess = [
    {
      name: 'TestCountry',
      distance: 0,
      direction: 'N'
    }
  ];

  const userId = 'test-user-id';
  const username = 'Test User';

  // Inject data before page load
  await page.addInitScript(({ today, winningGuess, userId, username }) => {
    localStorage.setItem('guesses', JSON.stringify({ [today]: winningGuess }));
    localStorage.setItem('username', JSON.stringify(username)); // useLocalStorage uses JSON.stringify
    localStorage.setItem('userId', JSON.stringify(userId));
    localStorage.setItem('openHighscoreAutomatically', JSON.stringify("please do"));
  }, { today, winningGuess, userId, username });

  // Monitor Console Logs
  let saveLogCount = 0;
  page.on('console', msg => {
    if (msg.text().startsWith('Saving score for')) {
      saveLogCount++;
      console.log('TEST LOG DETECTED:', msg.text());
    }
  });

  // 2. Load Page
  await page.goto('http://localhost:3000');

  // 3. Wait for High Score modal (it opens automatically due to localStorage setting or we click)
  // The 'High score' button text or the modal title "High score"
  await page.waitForSelector('text=High score', { state: 'visible' });

  // Wait a bit for the useEffect to fire
  await page.waitForTimeout(2000);

  // 4. Assert initial save happened
  expect(saveLogCount).toBeGreaterThanOrEqual(1);
  const countAfterFirstOpen = saveLogCount;

  // 5. Close Modal (Click close button or background)
  // The panel has a close button, usually an X or we can click outside?
  // Looking at Panel.tsx (inferred), usually there's a close button.
  // We can press Escape to close react-modal usually, or click the close button.
  // Let's try pressing Escape.
  await page.keyboard.press('Escape');
  
  // Wait for modal to close
  await page.waitForTimeout(500);

  // 6. Open Modal Again
  await page.click('button:has-text("High score")');

  // Wait a bit
  await page.waitForTimeout(2000);

  // 7. Assert NO new save happened
  expect(saveLogCount).toBe(countAfterFirstOpen);
});
