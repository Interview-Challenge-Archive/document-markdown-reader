'use client';

import { useState } from 'react';
import { DocumentMarkdownReader } from 'document-markdown-reader';

export default function Home() {
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
      <h1>Document Reader - React + JavaScript + Turbopack</h1>
      
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

      <style jsx>{`
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
      `}</style>
    </div>
  );
}
