import { useRef, useState } from 'react';
import { documentMarkdownReader } from '@interview-challenge-archive/document-markdown-reader';
import './App.css';

function App() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [markdown, setMarkdown] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleConvert() {
    const selectedFile = fileInputRef.current?.files?.[0];
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
    <div className="container">
      <h1>Document Reader - React + TypeScript + Vite</h1>

      <div className="upload-section">
        <input ref={fileInputRef} type="file" accept={documentMarkdownReader.acceptedExtensions} />
        <button id="convert-btn" type="button" onClick={handleConvert} disabled={isLoading}>
          Convert to Markdown
        </button>
      </div>

      {isLoading && <div className="loading">Loading document...</div>}

      {error && <div className="error">{error}</div>}

      {markdown && (
        <div className="result">
          <h2>Markdown Output:</h2>
          <pre id="output">{markdown}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
