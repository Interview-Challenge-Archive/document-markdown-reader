# TypeScript Vue Vite Example

This example shows how to use the document-markdown-reader library in a web application built with [Vue.js](https://vuejs.org/), TypeScript, and [Vite](https://vitejs.dev/).

## Try It Online

Try this example instantly in your browser without any local setup using StackBlitz, a cloud-based development environment.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Interview-Challenge-Archive/document-markdown-reader/tree/main/examples/typescript/vue/vite)

## What is TypeScript?

TypeScript is a strongly typed programming language that builds on JavaScript. It adds static type definitions that help catch errors early and improve code quality through better tooling support.

## What is Vue.js?

Vue.js is a progressive JavaScript framework for building user interfaces. It focuses on declarative rendering and component-driven architecture, making interactive app development straightforward.

## What is Vite?

Vite is a modern frontend build tool with a fast development server and optimized production builds. It uses native ES modules in development and bundles efficiently for deployment.

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

- `src/App.vue` - The main Vue component that handles file selection and conversion
- `src/main.ts` - The entry point that starts your Vue application
- `src/env.d.ts` - Vite client type declarations
- `index.html` - The HTML page where your app loads
- `vite.config.ts` - Configuration for the Vite build tool
- `tsconfig.json` - TypeScript configuration
- `package.json` - Lists all dependencies and scripts
