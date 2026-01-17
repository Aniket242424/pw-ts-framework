import { Page, Locator, expect } from '@playwright/test';
import { CryptoHelper } from '../utils/crypto';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {  // ✅ Inherits page from BasePage
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorBlock: Locator;

  constructor(page: Page) {
    super(page);  // ✅ Passes page to BasePage
    
    // ✅ NO "this.page = page;" here - inherited from BasePage
    this.emailInput = page.getByPlaceholder('Email');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Log in' });
    this.errorBlock = page.locator('#login-error.alert-danger');
  }

  async navigate() {
    await this.page.goto('/login?e2e=1');  // ✅ this.page from BasePage
  }

  async login(email?: string, password?: string) {
    email = email || process.env.EMAIL!;
    const decryptedPass = password || CryptoHelper.decrypt(process.env.ENCRYPTED_PASSWORD!);
    
    await this.emailInput.fill(email);
    await this.passwordInput.fill(decryptedPass);
    await this.loginButton.click();
  }

  async assertLoginSuccess() {
    await expect(this.page).toHaveURL(/company-management/);  // ✅ Inherited page
  }

  async assertLoginError() {
    await expect(this.errorBlock).toBeVisible({ timeout: 5000 });
  }
}
