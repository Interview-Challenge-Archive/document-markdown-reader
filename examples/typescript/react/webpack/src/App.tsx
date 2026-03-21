import React, { useState } from 'react';
import { DocumentMarkdownReader } from 'document-markdown-reader';

const reader = new DocumentMarkdownReader();

function App() {
  const [markdown, setMarkdown] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setMarkdown('');

    try {
      const result = await reader.read(file);
      setMarkdown(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to read document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Document to Markdown Converter</h1>
      <p>Select a document to convert to markdown format.</p>

      <div className="upload-section">
        <input
          type="file"
          accept=".pdf,.docx,.odt,.pages,.rtf,.html,.md,.txt"
          onChange={handleFileChange}
        />
      </div>

      {loading && <div className="loading">Loading document...</div>}

      {error && <div className="error">{error}</div>}

      {markdown && (
        <div className="result">
          <h2>Result:</h2>
          <pre>{markdown}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
