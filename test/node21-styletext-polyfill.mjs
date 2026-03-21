import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const util = require('node:util')
const originalStyleText = util.styleText

if (typeof originalStyleText === 'function') {
  util.styleText = (format, text, options) =>
    Array.isArray(format)
      ? format.reduce((value, style) => originalStyleText(style, value, options), text)
      : originalStyleText(format, text, options)
}
