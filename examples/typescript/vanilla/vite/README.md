# TypeScript + Vite Example

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Interview-Challenge-Archive/document-markdown-reader/tree/main/examples/typescript/vanilla/vite)

A TypeScript example using [Vite](https://vitejs.dev/) as the build tool for fast development and optimized production builds.

## How It Works

1. **User selects a file** using the `<input type="file">` element
2. **User clicks the "Convert" button** which triggers the TypeScript code
3. **TypeScript gets the file** from `fileInput.files[0]` with proper typing
4. **We pass this file object** to `documentMarkdownReader.readDocument()`
5. **Library reads the file content** and converts it to markdown
6. **Result is displayed** in the `<pre>` element

## Vite Advantages

- **Fast HMR** - Instant hot module replacement during development
- **Optimized builds** - Automatic code splitting and optimization
- **Native ES modules** - No bundling required during development
- **TypeScript support** - Built-in TypeScript compilation

## Running the Example

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

- `src/main.ts` - Main application entry point
- `src/App.ts` - Main application component
- `index.html` - HTML entry point
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
