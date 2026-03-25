import { render } from '@builder.io/qwik';
import { documentMarkdownReader } from '@interview-challenge-archive/document-markdown-reader';

render(
  document.getElementById('app') as HTMLElement,
  <main class="container">
    <h1>Document Markdown Reader</h1>
    <p>TypeScript + Qwik + Vite example</p>

    <input id="file-input" type="file" accept={documentMarkdownReader.acceptedExtensions} />
    <button id="convert-btn" type="button">Convert to Markdown</button>

    <p id="loading"></p>
    <p id="error" class="error"></p>
    <pre id="output"></pre>
  </main>
);

async function handleConvert() {
  const fileInput = document.getElementById('file-input') as HTMLInputElement | null;
  const loadingElement = document.getElementById('loading');
  const errorElement = document.getElementById('error');
  const outputElement = document.getElementById('output');
  const file = fileInput?.files?.[0];

  if (!file) {
    if (errorElement) {
      errorElement.textContent = 'Please select a file first';
    }
    if (outputElement) {
      outputElement.textContent = '';
    }
    return;
  }

  if (loadingElement) {
    loadingElement.textContent = 'Loading document...';
  }
  if (errorElement) {
    errorElement.textContent = '';
  }
  if (outputElement) {
    outputElement.textContent = '';
  }

  try {
    const markdown = await documentMarkdownReader.readDocument(file);
    if (outputElement) {
      outputElement.textContent = markdown;
    }
  } catch (error) {
    if (errorElement) {
      errorElement.textContent = error instanceof Error ? error.message : 'Failed to read document';
    }
  } finally {
    if (loadingElement) {
      loadingElement.textContent = '';
    }
  }
}

document.addEventListener('click', (event: MouseEvent) => {
  const target = event.target;
  if (!(target instanceof Element) || target.id !== 'convert-btn') {
    return;
  }

  void handleConvert();
});

const style = document.createElement('style');
style.textContent = `
  .container {
    font-family: system-ui, sans-serif;
    max-width: 800px;
    margin: 2rem auto;
    padding: 0 1rem;
  }

  #convert-btn {
    margin-left: 0.5rem;
  }

  #output {
    white-space: pre-wrap;
    background: #f5f5f5;
    padding: 1rem;
  }

  .error {
    color: #b00020;
  }
`;
document.head.appendChild(style);
