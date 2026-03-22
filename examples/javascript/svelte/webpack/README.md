
# JavaScript Svelte Webpack Example

This example shows how to use the document-markdown-reader library in a web application built with [Svelte](https://svelte.dev/) and [Webpack](https://webpack.js.org/).


## Try It Online

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Interview-Challenge-Archive/document-markdown-reader/tree/main/examples/javascript/svelte/webpack)
## What is Svelte?

Svelte is a radical new approach to building user interfaces. Unlike traditional frameworks like React and Vue, Svelte compiles your code to tiny, framework-less vanilla JS, resulting in highly optimized code with minimal overhead.

## What is Webpack?

Webpack is a powerful static module bundler for JavaScript applications. It takes your code, assets, and dependencies and bundles them into optimized files for the browser.

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

- `src/App.svelte` - The main Svelte component that handles file selection and conversion
- `src/main.js` - The entry point that starts your Svelte application
- `index.html` - The HTML page where your app loads
- `webpack.config.js` - Configuration for the Webpack bundler
- `package.json` - Lists all dependencies and scripts
