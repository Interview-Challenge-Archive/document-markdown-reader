import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from '@playwright/test'

const __dirname = dirname(fileURLToPath(import.meta.url))
const fixtureFilePath = join(__dirname, '..', '..', 'fixtures', 'real-documents', 'sample.txt')
const requireConvertButton = process.env.E2E_REQUIRE_CONVERT_BUTTON !== '0'

test('uploads a text file', async ({ page }) => {
  const startupErrors = []

  page.on('pageerror', (error) => {
    startupErrors.push(error.message)
  })

  page.on('console', (message) => {
    if (message.type() === 'error') {
      startupErrors.push(message.text())
    }
  })

  await page.goto('/')

  const startupErrorMatchers = [
    /util\.inherits is not a function/i,
    /Module "stream" has been externalized for browser compatibility/i,
    /Cannot access "stream\.Transform" in client code/i,
    /Class extends value undefined is not a constructor or null/i
  ]

  for (const startupErrorMatcher of startupErrorMatchers) {
    const startupError = startupErrors.find((message) => startupErrorMatcher.test(message))
    expect(
      startupError,
      `Unexpected startup error detected:\n${startupErrors.join('\n')}`
    ).toBeUndefined()
  }

  const fileInput = page.locator('input[type="file"]').first()
  await expect(fileInput).toBeVisible({ timeout: 45_000 })
  await fileInput.setInputFiles(fixtureFilePath)
  const uploadedFileName = await fileInput.evaluate((input) => input.files?.[0]?.name ?? '')
  expect(uploadedFileName).toBe('sample.txt')

  const readOutputText = async () => {
    return await page.evaluate(() => {
      const selectors = ['#output', '#markdown', '.result pre', 'pre']

      for (const selector of selectors) {
        const element = globalThis.document.querySelector(selector)
        if (element) {
          return (element.textContent ?? '').trim()
        }
      }

      return ''
    })
  }

  if (requireConvertButton) {
    expect(await readOutputText()).not.toContain('Normal text section')
  }

  const convertButtonById = page.locator('#convert-btn')
  const convertButton = (await convertButtonById.count())
    ? convertButtonById.first()
    : page.getByRole('button', { name: /convert/i }).first()

  await expect(convertButton).toBeVisible()
  await convertButton.click()
  await expect.poll(readOutputText).toContain('Normal text section')
})
