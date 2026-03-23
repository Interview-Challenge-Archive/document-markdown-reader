import { appendFileSync, existsSync, readdirSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

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
  const matrix = collectExamples(repoRoot)
  setOutput('matrix', JSON.stringify(matrix))
}

main()
