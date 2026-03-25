# TypeScript SolidJS Webpack Example

This example shows how to use the document-markdown-reader library in a web application built with [SolidJS](https://www.solidjs.com/) and [Webpack](https://webpack.js.org/).

## What is SolidJS?

SolidJS is a declarative JavaScript library for building user interfaces. It uses a fine-grained reactivity model — instead of a virtual DOM, SolidJS compiles your JSX templates into direct DOM operations, making it exceptionally fast and memory-efficient.

## What is Webpack?

Webpack is a powerful, highly configurable module bundler for JavaScript applications. It processes your source files and their dependencies to generate optimized bundles for the browser.

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
npm start
```

**Build for production** - When you're ready to deploy your application:

```bash
npm run build
```

After running `npm start`, open your browser to the address shown in the terminal (usually http://localhost:8080).

## Project Structure

- `src/App.tsx` - The main SolidJS component that handles file selection and conversion
- `src/index.tsx` - The entry point that renders the SolidJS application
- `index.html` - The HTML page where your app loads
- `src/App.css` - The styles for the application
- `webpack.config.js` - Webpack configuration with Babel and SolidJS support
- `tsconfig.json` - TypeScript configuration
- `package.json` - Lists all dependencies and scripts
