# TypeScript - React - Parcel

This example demonstrates how to use the Document Markdown Reader library with React and Parcel bundler.

## Try It Online

Try this example instantly in your browser without any local setup using StackBlitz, a cloud-based development environment.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Interview-Challenge-Archive/document-markdown-reader/tree/main/examples/typescript/react/parcel)

## What is React?

React is a JavaScript library for building user interfaces. It uses a component-based architecture and a virtual DOM to efficiently update the UI.

## What is TypeScript?

TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It adds optional static typing, classes, and interfaces to improve code quality and maintainability.

## What is Parcel?

Parcel is a zero-configuration bundler that automatically transforms your code with built-in support for JavaScript, CSS, and more. It provides fast bundling with parallel compilation and requires no setup.

## Installation

```bash
npm install
```

## Development

```bash
npm start
```

This will start the Parcel dev server. Open http://localhost:1234 in your browser.

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
- `src/index.html` - HTML entry point
- `tsconfig.json` - TypeScript configuration
