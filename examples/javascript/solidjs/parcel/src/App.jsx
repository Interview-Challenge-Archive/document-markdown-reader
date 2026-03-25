import { createSignal } from 'solid-js';
import { documentMarkdownReader } from '@interview-challenge-archive/document-markdown-reader';
import './App.css';

function App() {
  let fileInputRef;
  const [markdown, setMarkdown] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal('');

  async function handleConvert() {
    const selectedFile = fileInputRef?.files?.[0];
    if (!selectedFile) {
      setError('Please select a file first');
      setMarkdown('');
      return;
    }

    setIsLoading(true);
    setError('');
    setMarkdown('');

    try {
      setMarkdown(await documentMarkdownReader.readDocument(selectedFile));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to read document');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div class="container">
      <h1>Document Reader - SolidJS + JavaScript + Parcel</h1>

      <div class="upload-section">
        <input ref={fileInputRef} type="file" accept={documentMarkdownReader.acceptedExtensions} />
        <button id="convert-btn" type="button" onClick={handleConvert} disabled={isLoading()}>
          Convert to Markdown
        </button>
      </div>

      {isLoading() && <div class="loading">Loading document...</div>}

      {error() && <div class="error">{error()}</div>}

      {markdown() && (
        <div class="result">
          <h2>Markdown Output:</h2>
          <pre>{markdown()}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
