import { LitElement, html } from 'lit';
import { documentMarkdownReader } from '@interview-challenge-archive/document-markdown-reader';

class DocumentReaderApp extends LitElement {
  static properties = {
    markdown: { state: true },
    loading: { state: true },
    error: { state: true }
  };

  declare markdown: string;
  declare loading: boolean;
  declare error: string;

  constructor() {
    super();
    this.markdown = '';
    this.loading = false;
    this.error = '';
  }

  createRenderRoot() {
    return this;
  }

  async handleConvert() {
    const fileInput = this.querySelector('#file-input') as HTMLInputElement | null;
    const file = fileInput?.files?.[0];

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

  render() {
    return html`
      <style>
        body {
          font-family: system-ui, sans-serif;
        }

        .container {
          max-width: 800px;
          margin: 2rem auto;
          padding: 0 1rem;
        }

        #convert-btn {
          margin-left: 0.5rem;
        }

        #output {
          white-space: pre-wrap;
          background: #f5f5f5;
          padding: 1rem;
        }

        .error {
          color: #b00020;
        }
      </style>
      <div class="container">
        <h1>Document Markdown Reader</h1>
        <p>TypeScript + Lit + Vite example</p>
        <input
          id="file-input"
          type="file"
          ?disabled=${this.loading}
          accept=${documentMarkdownReader.acceptedExtensions}
        />
        <button
          id="convert-btn"
          type="button"
          @click=${this.handleConvert}
          ?disabled=${this.loading}
        >
          Convert to Markdown
        </button>
        <p>${this.loading ? 'Loading document...' : ''}</p>
        <p class="error">${this.error}</p>
        <pre id="output">${this.markdown}</pre>
      </div>
    `;
  }
}

customElements.define('document-reader-app', DocumentReaderApp);
