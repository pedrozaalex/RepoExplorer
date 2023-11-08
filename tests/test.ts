import { expect, test } from '@playwright/test';

test('index page has expected h1', async ({ page }) => {
	await page.goto('/');
	// Check that the main h1 has 'Repo Explorer' as text content.
	expect(await page.textContent('h1')).toMatch(/Repo Explorer/);
});
