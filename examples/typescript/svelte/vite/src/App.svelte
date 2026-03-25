<script lang="ts">
  import { documentMarkdownReader } from '@interview-challenge-archive/document-markdown-reader';

  let markdown = '';
  let loading = false;
  let error = '';
  let fileInput: HTMLInputElement | undefined;

  const acceptedExtensions = documentMarkdownReader.acceptedExtensions;

  async function handleConvert() {
    const file = fileInput?.files?.[0];
    if (!file) {
      error = 'Please select a file first';
      markdown = '';
      return;
    }

    loading = true;
    error = '';
    markdown = '';

    try {
      markdown = await documentMarkdownReader.readDocument(file);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to read document';
    } finally {
      loading = false;
    }
  }
</script>

<main class="container">
  <h1>Document Markdown Reader</h1>
  <p>TypeScript + Svelte + Vite example</p>

  <input bind:this={fileInput} type="file" accept={acceptedExtensions} disabled={loading} />
  <button id="convert-btn" type="button" on:click={handleConvert} disabled={loading}>
    Convert to Markdown
  </button>

  <p>{loading ? 'Loading document...' : ''}</p>
  <p class="error">{error}</p>
  <pre id="output">{markdown}</pre>
</main>

<style>
  .container {
    font-family: system-ui, sans-serif;
    max-width: 800px;
    margin: 2rem auto;
    padding: 0 1rem;
  }

  button {
    margin-left: 0.5rem;
  }

  .error {
    color: #b00020;
  }

  pre {
    white-space: pre-wrap;
    background: #f5f5f5;
    padding: 1rem;
  }
</style>
