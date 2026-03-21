<template>
  <div class="container">
    <h1>Document Reader - Vue + JavaScript + Parcel</h1>
    
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

<script>
import { DocumentMarkdownReader } from 'document-markdown-reader';

export default {
  name: 'App',
  data() {
    return {
      markdown: '',
      isLoading: false,
      error: ''
    };
  },
  methods: {
    async handleFileUpload(event) {
      const file = event.target.files?.[0];
      
      if (!file) return;
      
      this.isLoading = true;
      this.error = '';
      this.markdown = '';
      
      try {
        const reader = new DocumentMarkdownReader();
        this.markdown = await reader.read(file);
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Failed to read document';
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style>
.container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
  border: 2px dashed #ccc;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
}

.loading {
  color: #666;
  padding: 20px;
  text-align: center;
}

.error {
  color: #d32f2f;
  padding: 15px;
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
