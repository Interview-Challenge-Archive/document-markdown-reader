import { documentMarkdownReader } from '@interview-challenge-archive/document-markdown-reader';

const fileInput = document.getElementById('fileInput') as HTMLInputElement;
const convertButton = document.getElementById('convert-btn') as HTMLButtonElement;
const loadingEl = document.getElementById('loading') as HTMLParagraphElement;
const errorEl = document.getElementById('error') as HTMLParagraphElement;
const resultEl = document.getElementById('result') as HTMLDivElement;
const markdownEl = document.getElementById('markdown') as HTMLPreElement;

async function convertSelectedFile() {
  const file = fileInput.files?.[0];
  if (!file) {
    errorEl.textContent = 'Please select a file first';
    resultEl.style.display = 'none';
    return;
  }

  loadingEl.textContent = 'Loading...';
  errorEl.textContent = '';
  resultEl.style.display = 'none';

  try {
    const result = await documentMarkdownReader.readDocument(file);
    markdownEl.textContent = result;
    resultEl.style.display = 'block';
  } catch (err) {
    errorEl.textContent = err instanceof Error ? err.message : 'Failed to read document';
  } finally {
    loadingEl.textContent = '';
  }
}

convertButton.addEventListener('click', () => {
  void convertSelectedFile();
});
