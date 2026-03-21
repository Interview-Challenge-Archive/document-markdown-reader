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

## TypeScript usage

### HTML Setup

First, add a file input to your HTML:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Document Reader Example</title>
</head>
<body>
    <h1>Upload a Document</h1>
    <input type="file" id="summary-file" accept=".pdf,.docx,.doc,.txt,.md,.html,.rtf,.odt,.pages">
    <button id="convert-btn">Convert to Markdown</button>
    <pre id="output"></pre>
    
    <script src="your-typescript-script.js"></script>
</body>
</html>
```

### TypeScript Code

Now, in your TypeScript file:

```ts
import { documentMarkdownReader } from 'document-markdown-reader'

// Define types for better type safety
interface HTMLElementEvent<T extends HTMLElement> extends Event {
  target: T
}

async function readDocument(file: File): Promise<string> {
  try {
    // This line converts your document (Word, PDF, etc.) to markdown text
    return await documentMarkdownReader.readDocument(file)
  } catch (error) {
    console.error('Failed to read document:', error)
    throw error
  }
}

// Get references to HTML elements with proper typing
const fileInput = document.querySelector<HTMLInputElement>('#summary-file')!
const convertBtn = document.querySelector<HTMLButtonElement>('#convert-btn')!
const output = document.querySelector<HTMLPreElement>('#output')!

// Handle button click with proper event typing
convertBtn.addEventListener('click', (event: MouseEvent) => {
  const file = fileInput.files?.[0] // Get the selected file (optional chaining)
  
  if (file) {
    // Show loading message
    output.textContent = 'Converting...'
    
    // Convert the file and display the result
    readDocument(file)
      .then(markdown => {
        output.textContent = markdown // Show converted text
      })
      .catch((error: Error) => {
        output.textContent = 'Error: ' + error.message
      })
  } else {
    output.textContent = 'Please select a file first'
  }
})

// Optional: Check supported formats
console.log('Supported extensions:', documentMarkdownReader.supportedExtensions)
console.log('HTML accept attribute:', documentMarkdownReader.acceptedExtensions)
```

**How it works step by step:**
1. **User selects a file** using the `<input type="file">` element
2. **User clicks the "Convert" button** which triggers our TypeScript code
3. **TypeScript gets the file** from `fileInput.files[0]` with proper typing
4. **File object (type: File)** contains the file name, size, and content
5. **We pass this file object** to `documentMarkdownReader.readDocument()`
6. **Library reads the file content** and converts it to markdown
7. **Result is displayed** in the `<pre>` element

**TypeScript advantages:**
- **Type safety** - `document.querySelector<HTMLInputElement>()` ensures correct element type
- **Optional chaining** - `fileInput.files?.[0]` safely handles null cases
- **Error typing** - `(error: Error)` provides proper error type
- **File type** - `file: File` parameter ensures correct file object type
- **Better IDE support** - Autocomplete and error checking

**Key points:**
- `!` (non-null assertion) tells TypeScript we know the element exists
- `fileInput.files?.[0]` safely gets the first selected file
- The `File` type is built into TypeScript for file objects
- All DOM elements are properly typed for better development experience

## JavaScript usage

### HTML Setup

First, add a file input to your HTML:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Document Reader Example</title>
</head>
<body>
    <h1>Upload a Document</h1>
    <input type="file" id="summary-file" accept=".pdf,.docx,.doc,.txt,.md,.html,.rtf,.odt,.pages">
    <button id="convert-btn">Convert to Markdown</button>
    <pre id="output"></pre>
    
    <script src="your-script.js"></script>
</body>
</html>
```

### JavaScript Code

Now, in your JavaScript file:

```js
const { documentMarkdownReader } = require('document-markdown-reader')

async function readDocument(file) {
  try {
    // This line converts your document (Word, PDF, etc.) to markdown text
    return await documentMarkdownReader.readDocument(file)
  } catch (error) {
    console.error('Failed to read document:', error)
    throw error
  }
}

// Get references to HTML elements
const fileInput = document.querySelector('#summary-file')
const convertBtn = document.querySelector('#convert-btn')
const output = document.querySelector('#output')

// Handle button click
convertBtn.addEventListener('click', () => {
  const file = fileInput.files[0] // Get the selected file
  
  if (file) {
    // Show loading message
    output.textContent = 'Converting...'
    
    // Convert the file and display the result
    readDocument(file)
      .then(markdown => {
        output.textContent = markdown // Show converted text
      })
      .catch(error => {
        output.textContent = 'Error: ' + error.message
      })
  } else {
    output.textContent = 'Please select a file first'
  }
})
```

**How it works step by step:**
1. **User selects a file** using the `<input type="file">` element
2. **User clicks the "Convert" button** which triggers our JavaScript
3. **JavaScript gets the file** from `fileInput.files[0]` (this is an array of selected files)
4. **File object contains** the file name, size, and content
5. **We pass this file object** to `documentMarkdownReader.readDocument()`
6. **Library reads the file content** and converts it to markdown
7. **Result is displayed** in the `<pre>` element

**Key points:**
- `fileInput.files[0]` gives you the first selected file
- The file object includes the actual file content that gets read
- No need to manually read the file - the library handles that internally

## API Reference

### `documentMarkdownReader.readDocument(file: DocumentFileLike): Promise<string>`

Reads a document file and returns its content as Markdown.

**Parameters:**
- `file`: A File-like object (browser `File` object or object with `name`, `arrayBuffer()`, `text()` methods)

**Returns:** Promise resolving to a string containing the Markdown content

**Throws:**
- `UnsupportedFormatError` - When the file format is not supported
- `InvalidDocxError` - When the DOCX/DOCM file is invalid or corrupted
- `InvalidOdtError` - When the ODT/FODT file is invalid or corrupted
- `InvalidPagesError` - When the Pages file is invalid or corrupted
- `InvalidPdfError` - When the PDF file is invalid or corrupted
- `UnreadableDocError` - When the DOC file content cannot be read
- `UnreadablePagesError` - When the Pages file content cannot be read
- `UnreadablePdfError` - When the PDF file content cannot be read

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
