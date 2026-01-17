import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Membr Admin Login POM', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('valid login', async () => {
    await loginPage.login();
    await loginPage.assertLoginSuccess();
  });

  test('invalid login shows error', async ({ page }) => {
    await loginPage.login('wrong@yc.com', 'wrong');
    await loginPage.assertLoginError();
  });
});
