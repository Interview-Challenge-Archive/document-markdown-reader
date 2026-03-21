[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Interview-Challenge-Archive/document-markdown-reader/tree/main/examples/javascript/solidjs/rollup)

# JavaScript SolidJS Rollup Example

This example shows how to use the document-markdown-reader library in a web application built with [SolidJS](https://www.solidjs.com/) and [Rollup](https://rollupjs.org/).

## What is SolidJS?

SolidJS is a declarative JavaScript library for creating user interfaces. Unlike React, it uses fine-grained reactivity with direct DOM updates without a virtual DOM, making it extremely performant.

## What is Rollup?

Rollup is a module bundler for JavaScript that compiles small pieces of code into something larger and more complex, like a library or application. It uses the standardized ES module format for code.

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

After running `npm run dev`, open your browser to the address shown in the terminal (usually http://localhost:10000).

## Project Structure

- `src/App.jsx` - The main SolidJS component that handles file selection and conversion
- `src/index.jsx` - The entry point that starts your SolidJS application
- `index.html` - The HTML page where your app loads
- `rollup.config.js` - Configuration for the Rollup bundler
- `package.json` - Lists all dependencies and scripts
