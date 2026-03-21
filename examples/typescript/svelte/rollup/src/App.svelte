<script lang="ts">
  import { DocumentMarkdownReader } from 'document-markdown-reader';

  let markdownContent = '';
  let error = '';

  const reader = new DocumentMarkdownReader();

  async function handleFileSelect(event: Event): Promise<void> {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) {
      return;
    }

    try {
      error = '';
      markdownContent = await reader.read(file);
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to read document';
      markdownContent = '';
    }
  }
</script>

<main>
  <h1>Document Markdown Reader</h1>
  
  <div class="upload-section">
    <input 
      type="file" 
      accept=".pdf,.docx,.odt,.pages,.rtf,.html,.md,.txt"
      on:change={handleFileSelect}
    />
  </div>

  {#if error}
    <div class="error">
      {error}
    </div>
  {/if}

  {#if markdownContent}
    <div class="result">
      <h2>Extracted Markdown:</h2>
      <pre>{markdownContent}</pre>
    </div>
  {/if}
</main>

<style>
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  h1 {
    color: #333;
  }

  .upload-section {
    margin: 20px 0;
  }

  input[type="file"] {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
    box-sizing: border-box;
  }

  .error {
    color: #d32f2f;
    padding: 10px;
    background-color: #ffebee;
    border-radius: 4px;
    margin: 10px 0;
  }

  .result {
    margin-top: 20px;
  }

  pre {
    background-color: #f5f5f5;
    padding: 15px;
    border-radius: 4px;
    overflow-x: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
</style>
