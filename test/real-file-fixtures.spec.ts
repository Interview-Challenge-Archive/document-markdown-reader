import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { documentMarkdownReader } from '../src/index'
import type { DocumentFileLike } from '../src/index'

const __dirname = dirname(fileURLToPath(import.meta.url))
const FIXTURE_DIRECTORY_PATH = resolve(__dirname, 'fixtures', 'real-documents')

type FixtureCase = {
  fileName: string
  mimeType: string
  supportsRichFormatting: boolean
  expectsMarkdownListSyntax: boolean
}

const NORMAL_TEXT = 'Normal text section.'
const BOLD_TEXT = 'Bold text section'
const ITALIC_TEXT = 'Italic text section'
const LIST_ITEM_ONE = 'First list item'
const LIST_ITEM_TWO = 'Second list item'

const FIXTURE_CASES: ReadonlyArray<FixtureCase> = [
  {
    fileName: 'sample.doc',
    mimeType: 'application/msword',
    supportsRichFormatting: false,
    expectsMarkdownListSyntax: false
  },
  {
    fileName: 'sample.docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    supportsRichFormatting: true,
    expectsMarkdownListSyntax: true
  },
  {
    fileName: 'sample.docm',
    mimeType: 'application/vnd.ms-word.document.macroenabled.12',
    supportsRichFormatting: true,
    expectsMarkdownListSyntax: true
  },
  {
    fileName: 'sample.fodt',
    mimeType: 'application/vnd.oasis.opendocument.text-flat-xml',
    supportsRichFormatting: true,
    expectsMarkdownListSyntax: false
  },
  { fileName: 'sample.htm', mimeType: 'text/html', supportsRichFormatting: true, expectsMarkdownListSyntax: true },
  { fileName: 'sample.html', mimeType: 'text/html', supportsRichFormatting: true, expectsMarkdownListSyntax: true },
  {
    fileName: 'sample.markdown',
    mimeType: 'text/x-markdown',
    supportsRichFormatting: true,
    expectsMarkdownListSyntax: true
  },
  { fileName: 'sample.md', mimeType: 'text/markdown', supportsRichFormatting: true, expectsMarkdownListSyntax: true },
  { fileName: 'sample.mdx', mimeType: 'text/x-mdx', supportsRichFormatting: true, expectsMarkdownListSyntax: true },
  {
    fileName: 'sample.odt',
    mimeType: 'application/vnd.oasis.opendocument.text',
    supportsRichFormatting: true,
    expectsMarkdownListSyntax: false
  },
  {
    fileName: 'sample.pages',
    mimeType: 'application/vnd.apple.pages',
    supportsRichFormatting: false,
    expectsMarkdownListSyntax: false
  },
  { fileName: 'sample.pdf', mimeType: 'application/pdf', supportsRichFormatting: false, expectsMarkdownListSyntax: false },
  {
    fileName: 'sample.rtf',
    mimeType: 'application/rtf',
    supportsRichFormatting: true,
    expectsMarkdownListSyntax: false
  },
  { fileName: 'sample.txt', mimeType: 'text/plain', supportsRichFormatting: false, expectsMarkdownListSyntax: false }
]

describe('document-markdown-reader real fixture coverage', () => {
  it('covers every supported extension with fixture-based conversion checks', () => {
    expect(documentMarkdownReader.supportedExtensions).toEqual(
      [...new Set(FIXTURE_CASES.map((fixtureCase) => getFileExtension(fixtureCase.fileName)))].sort()
    )
  })

  for (const fixtureCase of FIXTURE_CASES) {
    it(`converts ${fixtureCase.fileName} with shared semantic content`, async () => {
      const file = await createFixtureFileLike(fixtureCase.fileName, fixtureCase.mimeType)
      const markdown = await documentMarkdownReader.readDocument(file)

      assertCommonContent(markdown)

      if (fixtureCase.supportsRichFormatting) {
        assertRichFormatting(markdown, fixtureCase.expectsMarkdownListSyntax)
      }
    })
  }
})

function assertCommonContent(markdown: string): void {
  const normalizedMarkdown = unescapeMarkdownControlCharacters(markdown)

  expect(normalizedMarkdown).toContain(NORMAL_TEXT)
  expect(normalizedMarkdown).toContain(BOLD_TEXT)
  expect(normalizedMarkdown).toContain(ITALIC_TEXT)
  expect(normalizedMarkdown).toContain(LIST_ITEM_ONE)
  expect(normalizedMarkdown).toContain(LIST_ITEM_TWO)
}

function assertRichFormatting(markdown: string, expectsMarkdownListSyntax: boolean): void {
  expect(markdown).toContain(`**${BOLD_TEXT}**`)
  expect(markdown).toContain(`*${ITALIC_TEXT}*`)

  if (expectsMarkdownListSyntax) {
    expect(markdown).toMatch(/(^|\n)(?:-\s+|\\-\s+)First list item($|\n)/)
    expect(markdown).toMatch(/(^|\n)(?:-\s+|\\-\s+)Second list item($|\n)/)
  }
}

function getFileExtension(fileName: string): string {
  const extensionSeparatorIndex = fileName.lastIndexOf('.')

  if (extensionSeparatorIndex < 0 || extensionSeparatorIndex === fileName.length - 1) {
    return ''
  }

  return fileName.slice(extensionSeparatorIndex + 1).toLowerCase()
}

function unescapeMarkdownControlCharacters(value: string): string {
  return value.replace(/\\(.)/g, '$1')
}

async function createFixtureFileLike(fileName: string, mimeType: string): Promise<DocumentFileLike> {
  const filePath = resolve(FIXTURE_DIRECTORY_PATH, fileName)
  const fileBuffer = await readFile(filePath)

  return {
    name: fileName,
    type: mimeType,
    async text() {
      return fileBuffer.toString('utf8')
    },
    async arrayBuffer() {
      return fileBuffer.buffer.slice(
        fileBuffer.byteOffset,
        fileBuffer.byteOffset + fileBuffer.byteLength
      )
    }
  }
}
