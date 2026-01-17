import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env automatically
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  
  /* Maximum time one test can run for (in ms) */
  timeout: 30000,
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail build on CI if test.only left in code */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Opt out of parallel on CI */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter: HTML + List */
  reporter: [
    ['html', { open: 'always' }],  // Open manually with `npx playwright show-report`
    ['list'],
    // ['allure-playwright'],  // Uncomment after npm i allure-playwright
  ],
  
  /* Global settings for ALL projects */
  use: {
  baseURL: process.env.BASE_URL || 'https://admin.dev.au.membr.com',
  screenshot: 'on',
  video: 'on',
  trace: 'on',
  actionTimeout: 10000,
},

  /* Output folders */
  outputDir: 'playwright-report/',
  
  /* Projects - only Chromium for dev (uncomment others for full matrix) */
  projects: [
  {
    name: 'chromium',
    use: { 
      ...devices['Desktop Chrome'],
      headless: !process.env.CI,  // Headed locally
    },
  },
  // Add later: firefox, webkit
],
  
  /* WebServer (uncomment if you have local app) */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
