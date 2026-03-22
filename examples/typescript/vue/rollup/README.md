# TypeScript Vue Rollup Example

This example demonstrates how to use `document-markdown-reader` in a Vue 3 application bundled with Rollup.

## Try It Online

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Interview-Challenge-Archive/document-markdown-reader/tree/main/examples/typescript/vue/rollup)

## What is TypeScript?

TypeScript is a strongly typed programming language that builds on JavaScript. It adds static type definitions that help catch errors early and improve code quality through better tooling support.

## What is Vue.js?

Vue.js is a progressive JavaScript framework for building user interfaces. Unlike other monolithic frameworks, Vue is designed from the ground up to be incrementally adoptable. Its core library focuses on the view layer only, making it easy to integrate with other libraries or existing projects.

## What is Rollup?

Rollup is a module bundler for JavaScript/TypeScript that compiles small pieces of code into something larger and more complex, such as a library or application. It's known for its tree-shaking capabilities that remove unused code.

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

The build output will be in the `dist` folder.

## Project Structure

- `src/App.vue` - The main Vue component that handles file selection and conversion
- `src/main.ts` - The entry point that starts your Vue application
- `index.html` - The HTML page where your app loads
- `rollup.config.js` - Configuration for the Rollup bundler
- `tsconfig.json` - TypeScript configuration
- `package.json` - Lists all dependencies and scripts
