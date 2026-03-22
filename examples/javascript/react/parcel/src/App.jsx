import React, { useState } from 'react';
import { DocumentMarkdownReader } from 'document-markdown-reader';

function App() {
  const [markdown, setMarkdown] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleFileUpload(event) {
    const input = event.target;
    const file = input.files?.[0];
    
    if (!file) return;
    
    setIsLoading(true);
    setError('');
    setMarkdown('');
    
    try {
      const reader = new DocumentMarkdownReader();
      setMarkdown(await reader.read(file));
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
        <input type="file" onChange={handleFileUpload} accept=".pdf,.docx,.odt,.pages,.rtf,.html,.md,.txt" />
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
