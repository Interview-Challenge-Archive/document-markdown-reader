import { createSignal } from 'solid-js';
import { DocumentMarkdownReader } from 'document-markdown-reader';

function App() {
  const [content, setContent] = createSignal<string>('');
  const [isLoading, setIsLoading] = createSignal<boolean>(false);
  const [error, setError] = createSignal<string>('');

  const handleFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) {
      return;
    }

    setIsLoading(true);
    setError('');
    setContent('');

    try {
      const reader = new DocumentMarkdownReader();
      const markdown = await reader.read(file);
      setContent(markdown);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to read document');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', 'font-family': 'system-ui, sans-serif' }}>
      <h1>Document Markdown Reader - SolidJS</h1>

      <div style={{ 'margin-bottom': '20px' }}>
        <input
          type="file"
          accept=".pdf,.docx,.odt,.pages,.rtf,.html,.md,.txt"
          onChange={handleFileChange}
          style={{ 'font-size': '16px' }}
        />
      </div>

      {isLoading() && <p>Loading...</p>}

      {error() && (
        <p style={{ color: 'red' }}>{error()}</p>
      )}

      {content() && (
        <div>
          <h2>Content:</h2>
          <pre style={{ background: '#f5f5f5', padding: '10px', 'white-space': 'pre-wrap' }}>
            {content()}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;
