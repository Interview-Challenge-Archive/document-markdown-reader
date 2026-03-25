<template>
  <div class="app">
    <h1>Document Markdown Reader</h1>
    <p>TypeScript + Vue + Parcel example</p>

    <div>
      <input
        type="file"
        accept=".pdf,.docx,.odt,.pages,.html,.md,.txt,.rtf"
        @change="handleFileSelection"
        :disabled="loading"
      />
      <button type="button" id="convert-btn" @click="handleConvert" :disabled="loading || !selectedFile">
        Convert to Markdown
      </button>
    </div>

    <p v-if="loading">Loading document...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="content">
      <h2>Content:</h2>
      <pre>{{ content }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { documentMarkdownReader } from '@interview-challenge-archive/document-markdown-reader';

const content = ref('');
const loading = ref(false);
const error = ref('');
const selectedFile = ref<File | null>(null);

const handleFileSelection = (event: Event) => {
  const target = event.target as HTMLInputElement;
  selectedFile.value = target.files?.[0] ?? null;
  error.value = '';
  content.value = '';
};

const handleConvert = async () => {
  const file = selectedFile.value;
  if (!file) return;

  loading.value = true;
  error.value = '';
  content.value = '';

  try {
    const markdown = await documentMarkdownReader.readDocument(file);
    content.value = markdown;
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
