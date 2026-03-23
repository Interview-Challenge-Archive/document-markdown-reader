import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const DEFAULT_HOST = process.env.E2E_HOST ?? '127.0.0.1'
const DEFAULT_PORT = Number(process.env.E2E_PORT ?? '4173')
const examplePath = process.env.E2E_EXAMPLE_PATH
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'

if (!examplePath) {
  throw new Error('Missing E2E_EXAMPLE_PATH environment variable.')
}

const exampleDir = resolve(examplePath)
const packageJsonPath = join(exampleDir, 'package.json')
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
const scripts = packageJson.scripts ?? {}
const tool = exampleDir.replace(/\\/g, '/').split('/').at(-1)

const REGISTERED_SIGNALS = ['SIGINT', 'SIGTERM']

function spawnCommand(command, args, cwd) {
  const commandSpec = process.platform === 'win32'
    ? { command: 'cmd', args: ['/c', command, ...args] }
    : { command, args }

  const child = spawn(commandSpec.command, commandSpec.args, {
    cwd,
    stdio: 'inherit'
  })

  for (const signal of REGISTERED_SIGNALS) {
    process.on(signal, () => {
      child.kill(signal)
    })
  }

  child.on('exit', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal)
      return
    }

    process.exit(code ?? 1)
  })
}

function resolveDevScriptName() {
  if (scripts.dev) {
    return 'dev'
  }

  if (scripts.start) {
    return 'start'
  }

  if (scripts.watch) {
    return 'watch'
  }

  return null
}

function buildScriptArgs(scriptName) {
  if (['vite', 'webpack', 'rspack', 'parcel'].includes(tool)) {
    return ['run', scriptName, '--', '--host', DEFAULT_HOST, '--port', String(DEFAULT_PORT)]
  }

  return ['run', scriptName]
}

async function main() {
  const scriptName = resolveDevScriptName()

  if (!scriptName) {
    throw new Error(`No dev/start/watch script found for example: ${exampleDir}`)
  }

  const args = buildScriptArgs(scriptName)
  spawnCommand(npmCommand, args, exampleDir)
}

await main()
