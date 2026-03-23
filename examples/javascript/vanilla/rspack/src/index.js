import { documentMarkdownReader } from '@interview-challenge-archive/document-markdown-reader';

const fileInput = document.getElementById('fileInput');
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const resultEl = document.getElementById('result');
const markdownEl = document.getElementById('markdown');

fileInput.addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

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
});
