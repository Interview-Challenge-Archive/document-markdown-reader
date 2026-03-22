# TypeScript - React - Rollup

This example demonstrates how to use the Document Markdown Reader library with React and Rollup bundler.

## Try It Online

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Interview-Challenge-Archive/document-markdown-reader/tree/main/examples/typescript/react/rollup)

## What is React?

React is a JavaScript library for building user interfaces. It uses a component-based architecture and a virtual DOM to efficiently update the UI.

## What is TypeScript?

TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It adds optional static typing, classes, and interfaces to improve code quality and maintainability.

## What is Rollup?

Rollup is a module bundler for JavaScript that compiles small pieces of code into something larger and more complex, such as a library or application. It's known for its tree-shaking capabilities that remove unused code.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

This will start Rollup in watch mode. Open index.html in your browser.

## Build

```bash
npm run build
```

## Usage

The application provides a file upload interface that supports:
- PDF (.pdf)
- Word (.docx)
- OpenDocument (.odt)
- Pages (.pages)
- Rich Text (.rtf)
- HTML (.html)
- Markdown (.md)
- Plain text (.txt)

Select a file to see its contents converted to Markdown.

## Project Structure

- `src/App.tsx` - Main React application component
- `src/index.tsx` - React entry point
- `index.html` - HTML entry point
- `rollup.config.js` - Rollup configuration
- `tsconfig.json` - TypeScript configuration
