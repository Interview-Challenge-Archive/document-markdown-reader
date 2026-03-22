# JavaScript + React + Rspack Example

A JavaScript example using [React](https://react.dev/) as the UI framework with Rspack as the build tool.

## Try It Online

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Interview-Challenge-Archive/document-markdown-reader/tree/main/examples/javascript/react/rspack)

## How It Works

1. **User selects a file** using the file input element in the React component
2. **React state** manages the file selection and conversion state
3. **We pass the file object** to `documentMarkdownReader.readDocument()`
4. **Library reads the file content** and converts it to markdown
5. **Result is displayed** in the component

## Rspack Advantages

- **Lightning-fast builds** - Built in Rust, significantly faster than Webpack
- **Compatible with Webpack** - Most Webpack plugins work with Rspack
- **Great performance** - Optimized for modern web development

## Running the Example

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

- `src/App.jsx` - Main React application component
- `src/index.jsx` - React entry point
- `index.html` - HTML entry point
- `rspack.config.js` - Rspack configuration
