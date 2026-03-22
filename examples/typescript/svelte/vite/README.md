# TypeScript Svelte Vite Example

This example shows how to use the document-markdown-reader library in a web application built with [Svelte](https://svelte.dev/), [TypeScript](https://www.typescriptlang.org/), and [Vite](https://vitejs.dev/).

## Try It Online

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Interview-Challenge-Archive/document-markdown-reader/tree/main/examples/typescript/svelte/vite)

## What is Svelte?

Svelte is a radical new approach to building user interfaces. Unlike traditional frameworks like React and Vue, Svelte compiles your code to tiny, framework-less vanilla JS, resulting in highly optimized code with minimal overhead.

## What is TypeScript?

TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It adds optional static typing, classes, and interfaces to improve code quality and maintainability.

## What is Vite?

Vite is a modern build tool that makes web development faster and easier. It provides instant server startup and hot module replacement, which means you see your changes immediately without refreshing the page.

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

After running `npm run dev`, open your browser to the address shown in the terminal (usually http://localhost:5173).

## Project Structure

- `src/App.svelte` - The main Svelte component that handles file selection and conversion
- `src/main.ts` - The entry point that starts your Svelte application
- `index.html` - The HTML page where your app loads
- `vite.config.ts` - Configuration for the Vite build tool
- `tsconfig.json` - TypeScript configuration
- `package.json` - Lists all dependencies and scripts
