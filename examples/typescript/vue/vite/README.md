[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Interview-Challenge-Archive/document-markdown-reader/tree/main/examples/typescript/vue/vite)

# TypeScript + Vue + Vite Example

A TypeScript example using [Vue 3](https://vuejs.org/) as the UI framework with Vite as the build tool.

## How It Works

1. **User selects a file** using the file input element in the Vue component
2. **User clicks the "Convert" button** which triggers the conversion function
3. **Vue reactivity** handles the file selection and conversion state
4. **We pass the file object** to `documentMarkdownReader.readDocument()`
5. **Library reads the file content** and converts it to markdown
6. **Result is displayed** in the component

## Vue Advantages

- **Reactive data binding** - Automatic UI updates
- **Composition API** - Flexible state management with composables
- **TypeScript support** - Full type safety out of the box
- **Single File Components** - Clean component organization

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

- `src/App.vue` - Main Vue application component
- `src/main.ts` - Vue entry point
- `src/style.css` - Application styles
- `index.html` - HTML entry point
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
