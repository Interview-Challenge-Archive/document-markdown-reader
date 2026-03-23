import { defineConfig, devices } from '@playwright/test'

const port = Number(process.env.E2E_PORT ?? '4173')
const host = process.env.E2E_HOST ?? '127.0.0.1'
const baseURL = process.env.E2E_BASE_URL ?? `http://${host}:${port}`
const examplePath = process.env.E2E_EXAMPLE_PATH
const webServerCommand = process.env.E2E_WEB_SERVER_COMMAND ?? 'node test/e2e/examples/run-example-server.mjs'

export default defineConfig({
  testDir: './test/e2e/examples',
  timeout: 120_000,
  expect: {
    timeout: 45_000
  },
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    ...devices['Desktop Chrome'],
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  webServer: examplePath
    ? {
        command: webServerCommand,
        cwd: process.cwd(),
        url: baseURL,
        timeout: 300_000,
        reuseExistingServer: !process.env.CI
      }
    : undefined
})
