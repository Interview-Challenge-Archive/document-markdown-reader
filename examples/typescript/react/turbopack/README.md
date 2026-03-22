# TypeScript + React + Turbopack Example

A TypeScript example using [React](https://react.dev/) as the UI framework with Turbopack (via Next.js) as the build tool.

## Try It Online

Try this example instantly in your browser without any local setup using StackBlitz, a cloud-based development environment.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Interview-Challenge-Archive/document-markdown-reader/tree/main/examples/typescript/react/turbopack)

## What is React?

React is a JavaScript library for building user interfaces. It uses a component-based architecture and a virtual DOM to efficiently update the UI.

## What is TypeScript?

TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It adds optional static typing, classes, and interfaces to improve code quality and maintainability.

## What is Turbopack?

Turbopack is a lightning-fast bundler built in Rust, developed by Vercel as the successor to Webpack. It's integrated with Next.js and provides incremental compilation and extremely fast HMR.

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

# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

- `src/app/page.tsx` - Main React page component
- `src/app/layout.tsx` - Next.js root layout
- `tsconfig.json` - TypeScript configuration
- `package.json` - Dependencies and scripts
