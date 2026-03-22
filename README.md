[![npm version](https://img.shields.io/npm/v/document-markdown-reader.svg)](https://www.npmjs.com/package/document-markdown-reader)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

# Document Markdown Reader

A simple JavaScript library that converts various document formats into clean, readable Markdown text. Perfect for web applications that need to display content from uploaded files like Word documents, PDFs, or rich text files.

Instead of struggling with different file formats, this library automatically detects the file type and converts it to Markdown for you. Whether your users upload Word documents, PDFs, HTML files, or plain text, you'll always get consistent Markdown output that's easy to display or process further.

## Supported file formats

- **Microsoft Word** - `.doc`, `.docx`, `.docm`
- **PDF documents** - `.pdf`
- **HTML files** - `.html`, `.htm`
- **Markdown files** - `.md`, `.markdown`, `.mdx`
- **Rich Text Format** - `.rtf`
- **OpenDocument** - `.odt`, `.fodt`
- **Plain Text** - `.txt`
- **Apple Pages** - `.pages`

## Install

```bash
npm install document-markdown-reader
```

## Examples

Check out the [examples](./examples) folder for complete working examples. Each example includes:
- A `README.md` with instructions and explanations
- A `package.json` with all required dependencies

Examples are organized by language, framework, and build tool in the format: `examples/{language}/{framework}/{tool}`.

For a complete overview of all examples, see [examples/README.md](./examples/README.md).

## API Reference

### `documentMarkdownReader.readDocument(file: DocumentFileLike): Promise<string>`

Reads a document file and returns its content as Markdown.

**Parameters:**
- `file`: A File-like object (browser `File` object or object with `name`, `arrayBuffer()`, `text()` methods)

**Returns:** Promise resolving to a string containing the Markdown content

**Throws:**
- `UnsupportedFormatError` - When the file format is not supported
- `InvalidDocumentError` - When a DOCX/DOCM, ODT/FODT, Pages, or PDF file is invalid or corrupted
- `UnreadableDocumentError` - When a DOC, Pages, or PDF file content cannot be read


### Properties

- `supportedExtensions: ReadonlyArray<string>` - Array of all supported file extensions
- `acceptedExtensions: string` - Comma-separated string suitable for HTML `accept` attribute

## Browser Compatibility

This library is designed for browser environments where the following APIs are available:

| API | Description | First appeared in | Last browser added | Polyfill |
|-----|-------------|-------------------|-------------------|----------|
| **[File API](https://developer.mozilla.org/en-US/docs/Web/API/File)** | For handling file objects | [Firefox 3.6 (2009)](https://caniuse.com/fileapi) | [Edge 12 (2015)](https://caniuse.com/fileapi) | Not needed |
| **[DOMParser](https://developer.mozilla.org/en-US/docs/Web/API/DOMParser)** | For parsing HTML/XML content | [Firefox 1 (2004)](https://caniuse.com/domparser) | [Edge 12 (2015)](https://caniuse.com/domparser) | Not needed |
| **[TextDecoder](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder)** | For decoding text from ArrayBuffer | [Firefox 19 (2013)](https://caniuse.com/textencoder) | [Edge 79 (2020)](https://caniuse.com/textencoder) | [text-encoding](https://www.npmjs.com/package/text-encoding) |
| **[ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)** | For handling binary data | [Firefox 4 (2011)](https://caniuse.com/typedarrays) | [Edge 12 (2015)](https://caniuse.com/typedarrays) | Not needed |

No Node.js-specific APIs are used, making it compatible with modern browsers and browser-like environments.

## Contributing

We'd love your help! Whether you're fixing a bug, adding support for a new format, or just spotting a typo in the docs, your contributions make this project better for everyone.

### Getting started

1. **Fork & Clone**: Grab your own copy of the repo and pull it down to your machine.
2. **Setup**: Run `npm install` to get all the dependencies ready.
3. **Branch**: Create a new branch for your work: `git checkout -b my-awesome-improvement`.

### Development workflow

We use a few simple commands to keep everything running smoothly:

- **Build**: `npm run build` - Compiles the project and generates type declarations.
- **Test**: `npm run test` - Run this to make sure everything is working as expected. Use `npm run test:watch` while you're coding for instant feedback.
- **Quality check**: Run `npm run lint` and `npm run typecheck` before submitting to catch any style issues or TypeScript errors.

### Sharing your changes

- **Keep it simple**: Try to keep your pull request focused on one specific change. It makes it much easier (and faster!) for us to review.
- **Tell us about it**: When you open your pull request, give us a quick summary of what you've done and why it's helpful.

We're excited to see what you build! Thanks for being part of the community.
make
