import { Page, Locator, expect } from '@playwright/test';
import { CryptoHelper } from '../utils/crypto';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorBlock: Locator;

  constructor(page: Page) {
    super(page);
    
    this.emailInput = page.getByPlaceholder('Email');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Log in' });
    this.errorBlock = page.locator('#login-error.alert-danger');
  }

  async navigate() {
    await this.page.goto('/login?e2e=1');
  }

  async login(email?: string, password?: string) {
    // ✅ FIXED: Multiple selectors + force + longer timeout
    const consentSelectors = [
      '#usercentrics-root button[mode="primary"]',
      '#usercentrics-root button:has-text("Accept"), #usercentrics-root button:has-text("Agree")',
      '[data-usercentrics] button',
      '#usercentrics-root [role="button"]'
    ];
    
    for (const selector of consentSelectors) {
      const consentBtn = this.page.locator(selector);
      if (await consentBtn.count() > 0) {
        console.log(`🎯 Dismissing consent: ${selector}`);
        await consentBtn.first().click({ force: true });
        await this.page.waitForTimeout(2000);
        break;
      }
    }

    // Credentials
    email = email || process.env.EMAIL!;
    const decryptedPass = password || CryptoHelper.decrypt(process.env.ENCRYPTED_PASSWORD!);
    
    await this.emailInput.fill(email);
    await this.passwordInput.fill(decryptedPass);
    
    // ✅ FIXED: Force click + 20s timeout
    await this.loginButton.click({ 
      force: true, 
      timeout: 20000 
    });
  }

  async assertLoginSuccess() {
    await expect(this.page).toHaveURL(/company-management|dashboard|home/i, { timeout: 10000 });
  }

  async assertLoginError() {
    await expect(this.errorBlock).toBeVisible({ timeout: 5000 });
  }
}
