import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  timeout: 80000,

  fullyParallel: true,

  forbidOnly: false,

  retries: process.env.CI ? 3 : 0,

  workers: 1,

  reporter: [['html'], ['allure-playwright', {
    detail: true,
    outputFolder: "allure-results",
    suiteTitle: false,
    categories: [
      {
        name: "Outdated tests",
        messageRegex: ".*FileNotFound.*",
      },
    ],
    environmentInfo: {
      framework: "playwright",
    },
  }]],
  use: {
    trace: 'off',
    screenshot: "only-on-failure",
    video: 'retain-on-failure',
  },

  projects: [

    { name: 'setup', testMatch: /.*\.setup\.ts/ },

    {
      name: 'chromium',
      testDir: './tests/web',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: "playwright/.auth/user.json",
        baseURL: process.env.URL,
        viewport: { width: 1920, height: 1080}
       },
       dependencies: ["setup"],
    },

    {
      name: 'firefox',
      testDir: './tests/web',
      use: { 
        ...devices['Desktop Firefox'],
        storageState: "playwright/.auth/user.json",
        baseURL: process.env.URL,
        viewport: { width: 1920, height: 1080},
       },
       dependencies: ["setup"],
    },

    {
      name: 'webkit',
      testDir: './tests/web',
      use: { 
        ...devices['Desktop Safari'],
        storageState: "playwright/.auth/user.json",
        baseURL: process.env.URL,
        viewport: { width: 1920, height: 1080}
       },
       dependencies: ["setup"],
    },

    {
      name: 'Mobile Chrome',
      testDir: './tests/mobile',
      use: {
        browserName: 'chromium',
        storageState: "playwright/.auth/user.json",
        ...devices['Pixel 5'],
        viewport: { width: 393, height: 851 },
        baseURL: process.env.URL,
      },
      dependencies: ["setup"],
    },

    {
      name: 'Mobile Safari',
      testDir: './tests/mobile',
      use: {
        browserName: 'webkit',
        storageState: "playwright/.auth/user.json",
        ...devices['iPhone 14'],
        viewport: { width: 390, height: 844 },
        baseURL: process.env.URL,
      },
      dependencies: ["setup"],
    },

    {
      name: 'Performance',
      testDir: './tests/performance-tests',
      use: {
        browserName: 'firefox',
        baseURL: process.env.URL,
      },
    },
  ]
});
