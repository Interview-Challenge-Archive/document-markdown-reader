import { useState, ChangeEvent } from 'react';
import { DocumentMarkdownReader } from 'document-markdown-reader';

function App() {
  const [markdown, setMarkdown] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setMarkdown('');

    try {
      const reader = new DocumentMarkdownReader();
      const result = await reader.read(file);
      setMarkdown(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to read document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Document to Markdown Converter</h1>
      <p>Select a document file to convert to Markdown:</p>
      <input type="file" onChange={handleFileChange} disabled={loading} />
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {markdown && (
        <div>
          <h2>Result:</h2>
          <pre>{markdown}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
