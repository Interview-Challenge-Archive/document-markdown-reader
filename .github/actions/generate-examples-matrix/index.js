import { appendFileSync, existsSync, readdirSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

function parseChangedFiles(value) {
  if (!value) {
    return []
  }

  try {
    const parsed = JSON.parse(value)
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed
      .filter((item) => typeof item === 'string')
      .map((item) => item.replaceAll('\\', '/'))
  } catch {
    return []
  }
}

function isFullRunTrigger(filePath) {
  return (
    filePath.startsWith('test/e2e/examples/') ||
    filePath === 'playwright.config.js' ||
    filePath === '.github/workflows/examples-e2e.yml'
  )
}

function collectChangedExamples(changedFiles) {
  const changedExamples = new Set()

  for (const filePath of changedFiles) {
    if (!filePath.startsWith('examples/')) {
      continue
    }

    const parts = filePath.split('/')
    if (parts.length < 4) {
      continue
    }

    changedExamples.add(parts.slice(0, 4).join('/'))
  }

  return changedExamples
}

function collectExamples(repoRoot) {
  const examplesRoot = resolve(repoRoot, 'examples')
  const result = []

  for (const language of readdirSync(examplesRoot, { withFileTypes: true })) {
    if (!language.isDirectory()) {
      continue
    }

    const languagePath = join(examplesRoot, language.name)
    for (const framework of readdirSync(languagePath, { withFileTypes: true })) {
      if (!framework.isDirectory()) {
        continue
      }

      const frameworkPath = join(languagePath, framework.name)
      for (const tool of readdirSync(frameworkPath, { withFileTypes: true })) {
        if (!tool.isDirectory()) {
          continue
        }

        const examplePath = join(frameworkPath, tool.name)
        if (!existsSync(join(examplePath, 'package.json'))) {
          continue
        }

        result.push(relative(repoRoot, examplePath).replaceAll('\\', '/'))
      }
    }
  }

  result.sort((a, b) => a.localeCompare(b))
  return result
}

function setOutput(name, value) {
  const outputFile = process.env.GITHUB_OUTPUT
  if (!outputFile) {
    throw new Error('GITHUB_OUTPUT is not set.')
  }

  appendFileSync(outputFile, `${name}=${value}\n`, 'utf8')
}

function main() {
  const repoRoot = process.cwd()
  const allExamples = collectExamples(repoRoot)
  const changedFiles = parseChangedFiles(process.env.INPUT_CHANGED_FILES_JSON)

  if (changedFiles.length === 0) {
    setOutput('matrix', JSON.stringify(allExamples))
    return
  }

  if (changedFiles.some(isFullRunTrigger)) {
    setOutput('matrix', JSON.stringify(allExamples))
    return
  }

  if (!changedFiles.every((filePath) => filePath.startsWith('examples/'))) {
    setOutput('matrix', JSON.stringify(allExamples))
    return
  }

  const changedExamples = collectChangedExamples(changedFiles)
  if (changedExamples.size === 0) {
    setOutput('matrix', JSON.stringify(allExamples))
    return
  }

  const filteredExamples = allExamples.filter((examplePath) => changedExamples.has(examplePath))
  setOutput('matrix', JSON.stringify(filteredExamples.length > 0 ? filteredExamples : allExamples))
}

main()
