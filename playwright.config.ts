import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env automatically
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  
  /* Maximum time one test can run for */
  timeout: 30000,
  
  /* Run tests in parallel */
  fullyParallel: true,
  
  /* Fail on CI if test.only used */
  forbidOnly: !!process.env.CI,
  
  /* Retries */
  retries: process.env.CI ? 2 : 0,
  
  /* Workers */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporters */
  reporter: [
    ['html', { open: 'always' }],
    ['list'],
  ],
  
  /* Shared settings */
  use: {
    baseURL: process.env.BASE_URL || 'https://admin.dev.au.membr.com',
    screenshot: 'on',
    video: 'on',
    trace: 'on',
    actionTimeout: 10000,
  },

  /* Output */
  outputDir: 'playwright-report/',

  /* Projects */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        headless: true,  // ✅ HEADLESS EVERYWHERE
      },
    },
  ],
});
