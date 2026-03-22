# JavaScript + React + Webpack Example

A JavaScript example using [React](https://react.dev/) as the UI framework with Webpack as the build tool.

## Try It Online

Try this example instantly in your browser without any local setup using StackBlitz, a cloud-based development environment.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Interview-Challenge-Archive/document-markdown-reader/tree/main/examples/javascript/react/webpack)

## How It Works

1. **User selects a file** using the file input element in the React component
2. **React state** manages the file selection and conversion state
3. **We pass the file object** to `documentMarkdownReader.readDocument()`
4. **Library reads the file content** and converts it to markdown
5. **Result is displayed** in the component

## React Advantages

- **Component-based architecture** - Reusable UI components
- **Virtual DOM** - Efficient rendering
- **State management** - React hooks for stateful logic

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
- `webpack.config.js` - Webpack configuration
