import React, { useState } from 'react';
import { documentMarkdownReader } from '@interview-challenge-archive/document-markdown-reader';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [markdown, setMarkdown] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  function handleFileSelection(event) {
    const input = event.target;
    const file = input.files?.[0];

    setSelectedFile(file ?? null);
    setError('');
    setMarkdown('');
  }

  async function handleConvert() {
    if (!selectedFile) {
      setError('Please select a file first');
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
      <h1>Document Reader - React + JavaScript + Parcel</h1>
      
      <div className="upload-section">
        <input type="file" onChange={handleFileSelection} accept=".pdf,.docx,.odt,.pages,.rtf,.html,.md,.txt" />
        <button id="convert-btn" type="button" onClick={handleConvert} disabled={isLoading || !selectedFile}>
          Convert to Markdown
        </button>
      </div>
      
      {isLoading && <div className="loading">Loading document...</div>}
      
      {error && <div className="error">{error}</div>}
      
      {markdown && (
        <div className="result">
          <h2>Markdown Output:</h2>
          <pre>{markdown}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
