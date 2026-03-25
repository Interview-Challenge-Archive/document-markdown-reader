# TypeScript Vue Webpack Example

This example shows how to use the document-markdown-reader library in a web application built with [Vue.js](https://vuejs.org/), TypeScript, and [Webpack](https://webpack.js.org/).

## Try It Online

Try this example instantly in your browser without any local setup using StackBlitz, a cloud-based development environment.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Interview-Challenge-Archive/document-markdown-reader/tree/main/examples/typescript/vue/webpack)

## What is TypeScript?

TypeScript is a strongly typed programming language that builds on JavaScript. It adds static type definitions that help catch errors early and improve code quality through better tooling support.

## What is Vue.js?

Vue.js is a progressive JavaScript framework for building user interfaces. It focuses on declarative rendering and component-based architecture for interactive web apps.

## What is Webpack?

Webpack is a module bundler that processes JavaScript, TypeScript, Vue components, and assets into optimized browser bundles. It also provides a development server for local iteration.

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

After running `npm run dev`, open your browser to the address shown in the terminal (usually http://localhost:8080).

## Project Structure

- `src/App.vue` - The main Vue component that handles file selection and conversion
- `src/main.ts` - The entry point that starts your Vue application
- `src/shims-vue.d.ts` - Type declarations for Vue single-file components
- `index.html` - The HTML page where your app loads
- `webpack.config.js` - Configuration for the Webpack bundler
- `tsconfig.json` - TypeScript configuration
- `package.json` - Lists all dependencies and scripts
