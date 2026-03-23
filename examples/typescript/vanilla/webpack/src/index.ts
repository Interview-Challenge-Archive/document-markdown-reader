import { DocumentMarkdownReader } from '@interview-challenge-archive/document-markdown-reader';

const fileInput = document.getElementById('fileInput') as HTMLInputElement;
const loadingEl = document.getElementById('loading') as HTMLParagraphElement;
const errorEl = document.getElementById('error') as HTMLParagraphElement;
const resultEl = document.getElementById('result') as HTMLDivElement;
const markdownEl = document.getElementById('markdown') as HTMLPreElement;

fileInput.addEventListener('change', async (event: Event) => {
  const file = fileInput.files?.[0];
  if (!file) return;

  loadingEl.textContent = 'Loading...';
  errorEl.textContent = '';
  resultEl.style.display = 'none';

  try {
    const reader = new DocumentMarkdownReader();
    const result = await reader.read(file);
    markdownEl.textContent = result;
    resultEl.style.display = 'block';
  } catch (err) {
    errorEl.textContent = err instanceof Error ? err.message : 'Failed to read document';
  } finally {
    loadingEl.textContent = '';
  }
});
