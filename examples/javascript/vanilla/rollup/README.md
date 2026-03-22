# JavaScript Vanilla Rollup Example

This example shows how to use the document-markdown-reader library in a web application built with vanilla JavaScript and [Rollup](https://rollupjs.org/).

## Try It Online

Try this example instantly in your browser without any local setup using StackBlitz, a cloud-based development environment.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Interview-Challenge-Archive/document-markdown-reader/tree/main/examples/javascript/vanilla/rollup)

## What is Vanilla JavaScript?

Vanilla JavaScript refers to plain JavaScript without any frameworks or libraries. It provides complete control over your code without any additional abstraction layers.

## What is Rollup?

Rollup is a module bundler for JavaScript that compiles small pieces of code into something larger and more complex, such as a library or application. It's known for its tree-shaking capabilities that remove unused code.

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

- `src/index.js` - The main JavaScript file that handles file selection and conversion
- `index.html` - The HTML page where your app loads
- `rollup.config.js` - Configuration for the Rollup bundler
- `package.json` - Lists all dependencies and scripts
