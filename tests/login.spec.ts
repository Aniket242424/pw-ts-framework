import { test, expect } from '@playwright/test';


// // 1) TEST DEFINITION
// test('membr admin login page - basic login flow', async ({ page }) => {

//   // 2) NAVIGATE TO LOGIN PAGE
//   await page.goto('https://admin.dev.au.membr.com/login?e2e=1', { waitUntil: 'load' });

//   // 3) ENTER USERNAME
//   await page.getByPlaceholder('Email').fill('admin@yc.com');

//   // 4) ENTER PASSWORD
//   await page.getByPlaceholder('Password').fill('');

//   // 5) CLICK LOGIN BUTTON
//   await page.getByRole('button', { name: 'Log in' }).click();

//   // 6) ASSERT SOMETHING AFTER LOGIN (we’ll refine later)
//   await expect(page).toHaveURL(/.*company-management/i);
// });