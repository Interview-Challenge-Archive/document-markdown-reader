import { spawn } from 'node:child_process'
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve } from 'node:path'
import mimeTypes from 'mime-types'

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

function runCommand(command, args, cwd) {
  return new Promise((resolvePromise, rejectPromise) => {
    const commandSpec = process.platform === 'win32'
      ? { command: 'cmd', args: ['/c', command, ...args] }
      : { command, args }

    const child = spawn(commandSpec.command, commandSpec.args, {
      cwd,
      stdio: 'inherit'
    })

    child.on('exit', (code) => {
      if (code === 0) {
        resolvePromise()
        return
      }

      rejectPromise(new Error(`Command failed: ${command} ${args.join(' ')}`))
    })

    child.on('error', rejectPromise)
  })
}

function sendFile(res, filePath) {
  const resolvedContentType = mimeTypes.contentType(extname(filePath)) ?? 'application/octet-stream'
  res.writeHead(200, { 'Content-Type': resolvedContentType })
  createReadStream(filePath).pipe(res)
}

function createStaticServer(rootDir, host, port) {
  return new Promise((resolvePromise, rejectPromise) => {
    const server = createServer((req, res) => {
      const requestPath = decodeURIComponent((req.url ?? '/').split('?')[0])
      const normalizedPath = normalize(requestPath).replace(/^(\.\.[/\\])+/, '')
      const relativePath = normalizedPath === '/' ? 'index.html' : normalizedPath.slice(1)
      const absolutePath = resolve(rootDir, relativePath)

      if (!absolutePath.startsWith(rootDir)) {
        res.writeHead(403)
        res.end('Forbidden')
        return
      }

      if (!existsSync(absolutePath) || !statSync(absolutePath).isFile()) {
        const fallbackFilePath = resolve(rootDir, 'index.html')
        if (existsSync(fallbackFilePath)) {
          sendFile(res, fallbackFilePath)
          return
        }

        res.writeHead(404)
        res.end('Not found')
        return
      }

      sendFile(res, absolutePath)
    })

    for (const signal of REGISTERED_SIGNALS) {
      process.on(signal, () => {
        server.close(() => process.exit(0))
      })
    }

    server.listen(port, host, () => resolvePromise(server))
    server.on('error', rejectPromise)
  })
}

function resolveDevScriptName() {
  if (tool === 'rollup') {
    return null
  }

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
  if (tool === 'turbopack') {
    return ['run', scriptName, '--', '--hostname', DEFAULT_HOST, '--port', String(DEFAULT_PORT)]
  }

  if (['vite', 'webpack', 'rspack', 'parcel'].includes(tool)) {
    return ['run', scriptName, '--', '--host', DEFAULT_HOST, '--port', String(DEFAULT_PORT)]
  }

  return ['run', scriptName]
}

async function main() {
  if (tool === 'rollup') {
    await runCommand(npmCommand, ['run', 'build'], exampleDir)
    await createStaticServer(exampleDir, DEFAULT_HOST, DEFAULT_PORT)
    return
  }

  const scriptName = resolveDevScriptName()

  if (!scriptName) {
    throw new Error(`No dev/start/watch script found for example: ${exampleDir}`)
  }

  const args = buildScriptArgs(scriptName)
  spawnCommand(npmCommand, args, exampleDir)
}

await main()
