import { expect, test } from '@playwright/test';

test('counter increments/decrements, disables at limits, shows message', async ({ page }) => {
  await page.goto('/');

  const result = page.locator('#result');
  const plus = page.locator('#plus');
  const minus = page.locator('#minus');
  const message = page.locator('#message');

  await expect(result).toHaveText('0');
  await expect(result).toHaveClass(/result--neutral/);
  await expect(message).toHaveText('');

  await plus.click();
  await expect(result).toHaveText('1');
  await expect(result).toHaveClass(/result--positive/);

  await minus.click();
  await expect(result).toHaveText('0');
  await expect(result).toHaveClass(/result--neutral/);

  // Go to MAX
  for (let i = 0; i < 10; i++) await plus.click();
  await expect(result).toHaveText('10');
  await expect(plus).toBeDisabled();
  await expect(message).toContainText('экстремального');

  // Back to 9 -> should re-enable plus
  await minus.click();
  await expect(result).toHaveText('9');
  await expect(plus).toBeEnabled();
  await expect(message).toHaveText('');

  // Go to MIN
  for (let i = 0; i < 19; i++) await minus.click();
  await expect(result).toHaveText('-10');
  await expect(minus).toBeDisabled();
  await expect(message).toContainText('экстремального');
});
