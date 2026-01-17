import { test, expect } from '@playwright/test';
import * as CryptoJS from 'crypto-js';
import * as dotenv from 'dotenv';

dotenv.config();

test('simple login with encrypted password', async ({ page }) => {
  // Navigate
  await page.goto('https://admin.dev.au.membr.com/login?e2e=1');

  // Decrypt password
  const email = process.env.EMAIL || 'admin@yc.com';
  const encryptedPass = process.env.ENCRYPTED_PASSWORD || '';
  const secretKey = process.env.ENCRYPTION_KEY || 'mySecretKey123!';
  const bytes = CryptoJS.AES.decrypt(encryptedPass, secretKey);
  const password = bytes.toString(CryptoJS.enc.Utf8);

  console.log('Using email:', email);
  console.log('Password length:', password.length, 'chars');

  // TODO: Replace with YOUR REAL locators
  await page.getByPlaceholder('Email').fill(email);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Log in' }).click();


  // Screenshot after login (manual)
  await page.screenshot({ path: 'login-result.png', fullPage: true });

  // Basic assertion
  await expect(page).toHaveTitle(/Membr|Admin|Dashboard/i);
});
