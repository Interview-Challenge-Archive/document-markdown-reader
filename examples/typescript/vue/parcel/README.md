# TypeScript - Vue - Parcel

This example demonstrates how to use the Document Markdown Reader library with Vue.js, TypeScript, and Parcel bundler.

## Try It Online

StackBlitz is currently not available for Parcel-based examples. Run this example locally using the steps below.

## What is TypeScript?

TypeScript is a strongly typed programming language that builds on JavaScript. It adds static type definitions that help catch errors early and improve code quality through better tooling support.

## What is Vue.js?

Vue.js is a progressive JavaScript framework for building user interfaces. Unlike other monolithic frameworks, Vue is designed from the ground up to be incrementally adoptable. Its core library focuses on the view layer only, making it easy to integrate with other libraries or existing projects.

## What is Parcel?

Parcel is a zero-configuration bundler that automatically transforms your code with built-in support for JavaScript, TypeScript, CSS, and more. It provides fast bundling with parallel compilation and requires no setup.

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

- `src/App.vue` - The main Vue component that handles file selection and conversion
- `src/main.ts` - The entry point that starts your Vue application
- `src/index.html` - The HTML page where your app loads
- `tsconfig.json` - TypeScript configuration
- `package.json` - Lists all dependencies and scripts
