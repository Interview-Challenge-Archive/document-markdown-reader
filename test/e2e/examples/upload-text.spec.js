import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from '@playwright/test'

const __dirname = dirname(fileURLToPath(import.meta.url))
const textFixtureFilePath = join(__dirname, '..', '..', 'fixtures', 'real-documents', 'sample.txt')
const pdfFixtureCases = [
  {
    filePath: join(__dirname, '..', '..', 'fixtures', 'real-documents', 'sample.pdf'),
    expectedFileName: 'sample.pdf',
    expectedOutputPattern: /Normal text section/i
  },
  {
    filePath: join(__dirname, '..', '..', 'fixtures', 'real-documents', 'synthetic-insurance-company.pdf'),
    expectedFileName: 'synthetic-insurance-company.pdf',
    expectedOutputPattern: /technology-driven company building intelligent, real-time systems/i
  }
]

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

  expect(await readOutputText()).toBe('')

  const convertButtonById = page.locator('#convert-btn')
  const convertButton = convertButtonById.first()
  await expect(convertButton).toBeVisible()
  await convertButton.click()

  if (expectedOutputPattern) {
    await expect.poll(readOutputText).toMatch(expectedOutputPattern)
  }
}

test('uploads a text file', async ({ page }) => {
  await runUploadFlow(page, textFixtureFilePath, 'sample.txt')
})

for (const pdfFixtureCase of pdfFixtureCases) {
  test(`uploads PDF file ${pdfFixtureCase.expectedFileName}`, async ({ page }) => {
    await runUploadFlow(
      page,
      pdfFixtureCase.filePath,
      pdfFixtureCase.expectedFileName,
      pdfFixtureCase.expectedOutputPattern
    )
  })
}
