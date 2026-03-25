# JavaScript Alpine.js Webpack Example

This example shows how to use the document-markdown-reader library in a web application built with [Alpine.js](https://alpinejs.dev/) and [Webpack](https://webpack.js.org/).

## Try It Online

Try this example instantly in your browser without any local setup using StackBlitz, a cloud-based development environment.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Interview-Challenge-Archive/document-markdown-reader/tree/main/examples/javascript/alpinejs/webpack)

## What is Alpine.js?

Alpine.js is a lightweight framework for adding declarative behavior to HTML with minimal JavaScript.

## What is Webpack?

Webpack is a module bundler that processes JavaScript and assets into optimized browser bundles. It also provides a development server for local iteration.

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

- `src/index.js` - Registers Alpine data and conversion logic
- `index.html` - The HTML page where your app loads
- `webpack.config.js` - Configuration for the Webpack bundler
- `package.json` - Lists all dependencies and scripts
