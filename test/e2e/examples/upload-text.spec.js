import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from '@playwright/test'

const __dirname = dirname(fileURLToPath(import.meta.url))
const fixtureFilePath = join(__dirname, '..', '..', 'fixtures', 'real-documents', 'sample.txt')

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

  const utilInheritsError = startupErrors.find((message) => /util\.inherits is not a function/i.test(message))
  expect(
    utilInheritsError,
    `Unexpected startup error detected:\n${startupErrors.join('\n')}`
  ).toBeUndefined()

  const fileInput = page.locator('input[type="file"]').first()
  await expect(fileInput).toBeVisible({ timeout: 45_000 })
  await fileInput.setInputFiles(fixtureFilePath)
  const uploadedFileName = await fileInput.evaluate((input) => input.files?.[0]?.name ?? '')
  expect(uploadedFileName).toBe('sample.txt')

  const convertButtonById = page.locator('#convert-btn')
  if (await convertButtonById.count()) {
    await convertButtonById.first().click()
  } else {
    const convertButtonByText = page.getByRole('button', { name: /convert/i })
    if (await convertButtonByText.count()) {
      await convertButtonByText.first().click()
    }
  }
})
