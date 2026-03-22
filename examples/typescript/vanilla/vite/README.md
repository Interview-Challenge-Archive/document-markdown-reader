# TypeScript Vanilla Vite Example

This example shows how to use the document-markdown-reader library in a web application built with [TypeScript](https://www.typescriptlang.org/) and [Vite](https://vitejs.dev/).

## Try It Online

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Interview-Challenge-Archive/document-markdown-reader/tree/main/examples/typescript/vanilla/vite)

## What is Vanilla TypeScript?

Vanilla TypeScript refers to plain TypeScript without any frameworks or libraries. It provides complete control over your code without any additional abstraction layers, with the benefits of TypeScript's static typing.

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

- `src/main.ts` - The main TypeScript file that handles file selection and conversion
- `index.html` - The HTML page where your app loads
- `vite.config.ts` - Configuration for the Vite build tool
- `tsconfig.json` - TypeScript configuration
- `package.json` - Lists all dependencies and scripts
