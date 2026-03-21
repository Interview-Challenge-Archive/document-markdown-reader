# JavaScript SolidJS Parcel Example

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Interview-Challenge-Archive/document-markdown-reader/tree/main/examples/javascript/solidjs/parcel)

This example shows how to use the document-markdown-reader library in a web application built with [SolidJS](https://www.solidjs.com/) and [Parcel](https://parceljs.org/).

## What is SolidJS?

SolidJS is a declarative JavaScript library for creating user interfaces. Unlike React, it uses fine-grained reactivity with direct DOM updates without a virtual DOM, making it extremely performant.

## What is Parcel?

Parcel is a zero-configuration bundler that automatically transforms your code with built-in support for JavaScript, TypeScript, CSS, and more. It provides fast bundling with parallel compilation.

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

After running `npm run dev`, open your browser to the address shown in the terminal (usually http://localhost:1234).

## Project Structure

- `src/App.jsx` - The main SolidJS component that handles file selection and conversion
- `src/index.jsx` - The entry point that starts your SolidJS application
- `src/index.html` - The HTML page where your app loads
- `package.json` - Lists all dependencies and scripts
