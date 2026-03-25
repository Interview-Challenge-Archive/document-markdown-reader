import { documentMarkdownReader } from '@interview-challenge-archive/document-markdown-reader';

const fileInput = document.getElementById('fileInput');
const convertButton = document.getElementById('convert-btn');
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const resultEl = document.getElementById('result');
const markdownEl = document.getElementById('markdown');

fileInput.accept = documentMarkdownReader.acceptedExtensions;

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
