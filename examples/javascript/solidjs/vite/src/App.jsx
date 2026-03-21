import { createSignal } from 'solid-js';
import { DocumentMarkdownReader } from 'document-markdown-reader';

function App() {
  const [markdownContent, setMarkdownContent] = createSignal('');
  const [error, setError] = createSignal('');

  const reader = new DocumentMarkdownReader();

  async function handleFileSelect(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setError('');
      const content = await reader.read(file);
      setMarkdownContent(content);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to read document');
      setMarkdownContent('');
    }
  }

  return (
    <main>
      <h1>Document Markdown Reader</h1>
      
      <div class="upload-section">
        <input 
          type="file" 
          accept=".pdf,.docx,.odt,.pages,.rtf,.html,.md,.txt"
          onChange={handleFileSelect}
        />
      </div>

      {error() && (
        <div class="error">
          {error()}
        </div>
      )}

      {markdownContent() && (
        <div class="result">
          <h2>Extracted Markdown:</h2>
          <pre>{markdownContent()}</pre>
        </div>
      )}
    </main>
  );
}

export default App;
