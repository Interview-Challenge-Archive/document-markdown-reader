import { DocumentMarkdownReader } from 'document-markdown-reader';

const reader = new DocumentMarkdownReader();

const fileInput = document.getElementById('fileInput') as HTMLInputElement;
const output = document.getElementById('output') as HTMLDivElement;

fileInput?.addEventListener('change', async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  try {
    const markdown = await reader.loadDocument(file);
    output.innerHTML = `<pre>${markdown}</pre>`;
  } catch (error) {
    output.innerHTML = `<p style="color: red;">Error: ${(error as Error).message}</p>`;
  }
});
