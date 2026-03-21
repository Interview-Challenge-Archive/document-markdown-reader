# JavaScript + React + Turbopack Example

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Interview-Challenge-Archive/document-markdown-reader/tree/main/examples/javascript/react/turbopack)

A JavaScript example using [React](https://react.dev/) as the UI framework with Turbopack (via Next.js) as the build tool.

## How It Works

1. **User selects a file** using the file input element in the React component
2. **React state** manages the file selection and conversion state
3. **We pass the file object** to `documentMarkdownReader.readDocument()`
4. **Library reads the file content** and converts it to markdown
5. **Result is displayed** in the component

## Turbopack Advantages

- **Lightning-fast bundling** - Built in Rust, up to 10x faster than Webpack
- **Incremental compilation** - Extremely fast HMR
- **Next.js integration** - Full-stack React framework

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

- `src/app/page.jsx` - Main React page component
- `src/app/layout.js` - Next.js root layout
- `package.json` - Dependencies and scripts
