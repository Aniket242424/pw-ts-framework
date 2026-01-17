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
    console.log('🔍 Page URL before login:', this.page.url());
    
    // 🔥 NUCLEAR COOKIE DISMISS (dismiss + hide + remove)
    await this.dismissAllConsents();
    
    // Credentials
    email = email || process.env.EMAIL!;
    const decryptedPass = password || CryptoHelper.decrypt(process.env.ENCRYPTED_PASSWORD!);
    
    console.log('📧 Using email:', email);
    console.log('🔑 Password length:', decryptedPass.length);
    
    await this.emailInput.fill(email);
    await this.passwordInput.fill(decryptedPass);
    
    // 🔥 MULTIPLE CLICK STRATEGIES
    await this.clickLoginNuclear();
    
    // Wait for navigation/change
    await this.page.waitForURL('**/dashboard**', { timeout: 10000 });
    console.log('✅ Final URL:', this.page.url());
  }

  private async dismissAllConsents() {
    // 1. Click common buttons
    const consentClicks = [
      '#usercentrics-root button',
      '#usercentrics-root [role="button"]',
      '[data-usercentrics] button',
      'button:has-text("Accept")',
      'button:has-text("Agree")',
      'button:has-text("OK")',
      '.uc-button-accept-all'
    ];
    
    for (const selector of consentClicks) {
      const btn = this.page.locator(selector);
      if (await btn.count() > 0) {
        console.log(`🎯 Clicking consent: ${selector}`);
        await btn.first().click({ force: true });
        await this.page.waitForTimeout(1000);
      }
    }
    
    // 2. JS force-hide Usercentrics
    await this.page.addStyleTag({ content: `
      #usercentrics-root { display: none !important; visibility: hidden !important; pointer-events: none !important; }
      .usercentrics-root * { display: none !important; }
    `});
    
    await this.page.waitForTimeout(2000);
  }

  private async clickLoginNuclear() {
    // Try 3 methods
    const methods = [
      () => this.loginButton.click({ force: true, timeout: 5000 }),
      () => this.page.locator('[data-cy="login-submit"]').click({ force: true }),
      () => this.page.evaluate(() => {
        const btn = document.querySelector('button[data-cy="login-submit"]') as any;
        btn?.click();
      })
    ];
    
    for (let i = 0; i < methods.length; i++) {
      try {
        console.log(`⚡ Login attempt #${i + 1}`);
        await methods[i]();
        await this.page.waitForTimeout(2000);
        return;
      } catch (e) {
        console.log(`❌ Method ${i + 1} failed:`, e.message);
      }
    }
    
    throw new Error('All login click methods failed');
  }

  async assertLoginSuccess() {
    // Flexible success check
    await expect(this.page).toHaveURL(/dashboard|management|home/i, { timeout: 15000 });
  }

  async assertLoginError() {
    // Wait for submit + check error
    await this.page.waitForTimeout(3000);
    await expect(this.errorBlock).toBeVisible({ timeout: 5000 });
  }
}
