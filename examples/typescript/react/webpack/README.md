# TypeScript + React + Webpack Example

A TypeScript example using [React](https://react.dev/) as the UI framework with Webpack as the build tool.

## Try It Online

Try this example instantly in your browser without any local setup using StackBlitz, a cloud-based development environment.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Interview-Challenge-Archive/document-markdown-reader/tree/main/examples/typescript/react/webpack)

## What is React?

React is a JavaScript library for building user interfaces. It uses a component-based architecture and a virtual DOM to efficiently update the UI.

## What is TypeScript?

TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It adds optional static typing, classes, and interfaces to improve code quality and maintainability.

## What is Webpack?

Webpack is a powerful static module bundler for JavaScript applications. It takes your code, assets, and dependencies and bundles them into optimized files for the browser.

## How It Works

1. **User selects a file** using the file input element in the React component
2. **React state** manages the file selection and conversion state
3. **We pass the file object** to `documentMarkdownReader.readDocument()`
4. **Library reads the file content** and converts it to markdown
5. **Result is displayed** in the component

## Running the Example

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## Project Structure

- `src/App.tsx` - Main React application component
- `src/index.tsx` - React entry point
- `index.html` - HTML entry point
- `webpack.config.js` - Webpack configuration
- `tsconfig.json` - TypeScript configuration
