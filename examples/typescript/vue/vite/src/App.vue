<script setup lang="ts">
import { ref } from 'vue'
import { DocumentMarkdownReader } from 'document-markdown-reader'

const markdown = ref('')
const isLoading = ref(false)
const error = ref('')

async function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  
  if (!file) return
  
  isLoading.value = true
  error.value = ''
  markdown.value = ''
  
  try {
    const reader = new DocumentMarkdownReader()
    markdown.value = await reader.read(file)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to read document'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="container">
    <h1>Document Reader - Vue + TypeScript + Vite</h1>
    
    <div class="upload-section">
      <input type="file" @change="handleFileUpload" accept=".pdf,.docx,.odt,.pages,.rtf,.html,.md,.txt" />
    </div>
    
    <div v-if="isLoading" class="loading">Loading document...</div>
    
    <div v-if="error" class="error">{{ error }}</div>
    
    <div v-if="markdown" class="result">
      <h2>Markdown Output:</h2>
      <pre>{{ markdown }}</pre>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: system-ui, -apple-system, sans-serif;
}

.upload-section {
  margin: 2rem 0;
}

.error {
  color: #dc3545;
  padding: 1rem;
  background: #fee;
  border-radius: 4px;
}

.loading {
  color: #666;
  padding: 1rem;
}

.result pre {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
