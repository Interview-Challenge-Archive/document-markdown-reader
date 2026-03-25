import 'htmx.org';
import { documentMarkdownReader } from '@interview-challenge-archive/document-markdown-reader';

const fileInput = document.getElementById('file-input');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');
const outputElement = document.getElementById('output');

if (fileInput) {
  fileInput.setAttribute('accept', documentMarkdownReader.acceptedExtensions);
}

window.handleConvert = async () => {
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
};
