import { useState, ChangeEvent } from 'react';
import { DocumentMarkdownReader } from 'document-markdown-reader';
import './App.css';

function App() {
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
    <div className="app">
      <h1>Document Markdown Reader</h1>
      <p>TypeScript + React + Parcel example</p>

      <div>
        <input
          type="file"
          accept=".pdf,.docx,.odt,.pages,.html,.md,.txt,.rtf"
          onChange={handleFileChange}
          disabled={loading}
        />
      </div>

      {loading && <p>Loading document...</p>}
      {error && <p className="error">{error}</p>}

      {content && (
        <div>
          <h2>Content:</h2>
          <pre>{content}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
