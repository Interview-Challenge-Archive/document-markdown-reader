'use client';

import { useState, ChangeEvent } from 'react';
import { DocumentMarkdownReader } from 'document-markdown-reader';

export default function Home() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setContent('');

    try {
      const reader = new DocumentMarkdownReader();
      const markdown = await reader.read(file);
      setContent(markdown);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to read document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>Document Markdown Reader</h1>
      <p>TypeScript + React + Turbopack example</p>

      <div>
        <input
          type="file"
          accept=".pdf,.docx,.odt,.pages,.html,.md,.txt,.rtf"
          onChange={handleFileChange}
          disabled={loading}
        />
      </div>

      {loading && <p>Loading document...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {content && (
        <div>
          <h2>Content:</h2>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#f5f5f5', padding: '1rem' }}>
            {content}
          </pre>
        </div>
      )}
    </main>
  );
}
