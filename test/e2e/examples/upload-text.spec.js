import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from '@playwright/test'

const __dirname = dirname(fileURLToPath(import.meta.url))
const textFixtureFilePath = join(__dirname, '..', '..', 'fixtures', 'real-documents', 'sample.txt')
const pdfFixtureFilePath = join(__dirname, '..', '..', 'fixtures', 'real-documents', 'sample.pdf')

async function runUploadFlow(page, fixtureFilePath, expectedFileName, expectedOutputPattern = /Normal text section/i) {
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
  expect(uploadedFileName).toBe(expectedFileName)

  const convertButtonById = page.locator('#convert-btn')
  if (await convertButtonById.count()) {
    await convertButtonById.first().click()
  } else {
    const convertButtonByText = page.getByRole('button', { name: /convert/i })
    if (await convertButtonByText.count()) {
      await convertButtonByText.first().click()
    }
  }

  if (expectedOutputPattern) {
    await expect.poll(
      async () => await page.locator('body').innerText(),
      {
        timeout: 45_000,
        message: `Expected converted markdown output. Console/page errors:\n${startupErrors.join('\n')}`
      }
    ).toMatch(expectedOutputPattern)
  }
}

test('uploads a text file', async ({ page }) => {
  await runUploadFlow(page, textFixtureFilePath, 'sample.txt')
})

test('uploads a PDF file', async ({ page }) => {
  await runUploadFlow(page, pdfFixtureFilePath, 'sample.pdf', null)
})
