# TypeScript SolidJS Vite Example

This example shows how to use the document-markdown-reader library in a web application built with [SolidJS](https://www.solidjs.com/) and [Vite](https://vitejs.dev/).

## Try It Online

[![StackBlitz](https://img.shields.io/badge/try_on-stackblitz-blue?logo=stackblitz)](https://stackblitz.com/github/Interview-Challenge-Archive/document-markdown-reader/tree/main/examples/typescript/solidjs/vite)

## What is SolidJS?

SolidJS is a declarative JavaScript library for building user interfaces. It uses a fine-grained reactivity model — instead of a virtual DOM, SolidJS compiles your JSX templates into direct DOM operations, making it exceptionally fast and memory-efficient.

## What is Vite?

Vite is a fast, modern build tool that provides a lightning-fast development server using native ES modules, and bundles your code with Rollup for production.

## How It Works

When you use this application:

1. **Select a file** - Click the "Choose File" button to select any document from your computer
2. **Convert** - Click the "Convert to Markdown" button
3. **See the result** - The document's content appears as formatted Markdown text on the screen

The library automatically detects what type of file you've selected (PDF, Word, etc.) and converts it appropriately.

## Running the Example

Follow these steps to run this example on your computer:

**Install dependencies** - This downloads all the necessary packages:

```bash
npm install
```

**Start the development server** - This opens your web application:

```bash
npm run dev
```

**Build for production** - When you're ready to deploy your application:

```bash
npm run build
```

After running `npm run dev`, open your browser to the address shown in the terminal (usually http://localhost:3000).

## Project Structure

- `src/App.tsx` - The main SolidJS component that handles file selection and conversion
- `src/index.tsx` - The entry point that renders the SolidJS application
- `index.html` - The HTML page where your app loads
- `src/App.css` - The styles for the application
- `vite.config.ts` - Vite configuration with SolidJS plugin
- `tsconfig.json` - TypeScript configuration
- `package.json` - Lists all dependencies and scripts
