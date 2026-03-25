import Alpine from 'alpinejs';
import { documentMarkdownReader } from '@interview-challenge-archive/document-markdown-reader';

Alpine.data('documentReader', () => ({
  markdown: '',
  loading: false,
  error: '',
  acceptedExtensions: documentMarkdownReader.acceptedExtensions,

  async handleConvert() {
    const file = this.$refs.fileInput?.files?.[0];
    if (!file) {
      this.error = 'Please select a file first';
      this.markdown = '';
      return;
    }

    this.loading = true;
    this.error = '';
    this.markdown = '';

    try {
      this.markdown = await documentMarkdownReader.readDocument(file);
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to read document';
    } finally {
      this.loading = false;
    }
  }
}));

window.Alpine = Alpine;
Alpine.start();
