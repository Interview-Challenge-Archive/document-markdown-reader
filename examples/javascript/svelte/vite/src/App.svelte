<script>
  import { DocumentMarkdownReader } from 'document-markdown-reader';

  let markdown = '';
  let error = '';
  let loading = false;

  async function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    loading = true;
    error = '';
    markdown = '';

    try {
      const reader = new DocumentMarkdownReader();
      markdown = await reader.read(file);
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }
</script>

<main>
  <h1>Document Markdown Reader</h1>
  
  <div class="upload-section">
    <input type="file" on:change={handleFileSelect} accept=".pdf,.docx,.odt,.pages,.rtf,.html,.md,.txt" />
  </div>

  {#if loading}
    <p>Loading...</p>
  {/if}

  {#if error}
    <p class="error">{error}</p>
  {/if}

  {#if markdown}
    <div class="result">
      <h2>Extracted Markdown:</h2>
      <pre>{markdown}</pre>
    </div>
  {/if}
</main>

<style>
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  .upload-section {
    margin: 2rem 0;
  }

  .error {
    color: #dc3545;
  }

  .result {
    margin-top: 2rem;
  }

  pre {
    background: #f4f4f4;
    padding: 1rem;
    overflow-x: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
</style>
