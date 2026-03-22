<template>
  <div class="app">
    <h1>Document to Markdown Converter</h1>
    <p>Select a document file to convert to Markdown:</p>
    <input type="file" @change="handleFileChange" :disabled="loading" />
    <p v-if="loading">Loading...</p>
    <p v-if="error" class="error">{{ error }}</p>
    <div v-if="markdown">
      <h2>Result:</h2>
      <pre>{{ markdown }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { DocumentMarkdownReader } from 'document-markdown-reader';

const markdown = ref<string>('');
const error = ref<string>('');
const loading = ref<boolean>(false);

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  loading.value = true;
  error.value = '';
  markdown.value = '';

  try {
    const reader = new DocumentMarkdownReader();
    const result = await reader.read(file);
    markdown.value = result;
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to read document';
  } finally {
    loading.value = false;
  }
};
</script>

<style>
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  font-size: 1.5rem;
}

input[type="file"] {
  margin-bottom: 1rem;
}

.error {
  color: red;
}

pre {
  white-space: pre-wrap;
  background: #f5f5f5;
  padding: 1rem;
}
</style>
