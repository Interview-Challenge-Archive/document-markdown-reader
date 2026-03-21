# TypeScript + React Example

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Interview-Challenge-Archive/document-markdown-reader/tree/main/examples/typescript/react/vite)

A TypeScript example using [React](https://react.dev/) as the UI framework with Vite as the build tool.

## How It Works

1. **User selects a file** using the `<input type="file">` element in the React component
2. **User clicks the "Convert" button** which triggers the conversion function
3. **React state manages** the file selection and conversion status
4. **We pass the file object** to `documentMarkdownReader.readDocument()`
5. **Library reads the file content** and converts it to markdown
6. **Result is displayed** in the component

## React Advantages

- **Component-based architecture** - Reusable UI components
- **State management** - Built-in useState and useEffect hooks
- **TypeScript support** - Full type safety with JSX
- **Large ecosystem** - Many libraries and tools available

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

- `src/App.tsx` - Main React application component
- `src/main.tsx` - React entry point
- `src/App.css` - Application styles
- `index.html` - HTML entry point
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration

## Key Features

- Uses React hooks (useState) for state management
- Type-safe event handlers
- Conditional rendering for loading/error states
- CSS modules for styling
