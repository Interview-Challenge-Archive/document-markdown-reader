import { createSignal } from 'solid-js';
import { DocumentMarkdownReader } from 'document-markdown-reader';

function App() {
  const [markdown, setMarkdown] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal('');

  const handleFileChange = async (event) => {
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', "font-family": 'system-ui, sans-serif' }}>
      <h1>SolidJS Document Reader</h1>
      <p>Upload a document file (PDF, DOCX, ODT, Pages, RTF, HTML, Markdown, or TXT) to convert it to Markdown.</p>
      
      <input 
        type="file" 
        accept=".pdf,.docx,.odt,.pages,.rtf,.html,.md,.txt"
        onChange={handleFileChange}
        style={{ "margin-bottom": '20px' }}
      />
      
      {loading() && <p>Loading...</p>}
      
      {error() && (
        <div style={{ color: 'red', padding: '10px', background: '#fee', "border-radius": '4px' }}>
          Error: {error()}
        </div>
      )}
      
      {markdown() && (
        <div>
          <h2>Result:</h2>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '20px', 
            "border-radius": '4px',
            "white-space": 'pre-wrap',
            "word-wrap": 'break-word',
            "max-height": '500px',
            "overflow-y": 'auto'
          }}>
            {markdown()}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;
