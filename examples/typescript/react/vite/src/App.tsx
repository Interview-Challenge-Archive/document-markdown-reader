import { useState, ChangeEvent } from 'react'
import { documentMarkdownReader } from 'document-markdown-reader'

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [markdown, setMarkdown] = useState<string>('')
  const [isConverting, setIsConverting] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setSelectedFile(file || null)
    setMarkdown('')
    setError('')
  }

  const handleConvert = async () => {
    if (!selectedFile) {
      setError('Please select a file first')
      return
    }

    setIsConverting(true)
    setError('')

    try {
      const result = await documentMarkdownReader.readDocument(selectedFile)
      setMarkdown(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to convert document')
    } finally {
      setIsConverting(false)
    }
  }

  return (
    <div className="container">
      <h1>Upload a Document</h1>
      <p>Select a file to convert to Markdown:</p>
      
      <input
        type="file"
        id="summary-file"
        accept=".pdf,.docx,.doc,.txt,.md,.html,.rtf,.odt,.pages"
        onChange={handleFileChange}
      />
      
      <button 
        id="convert-btn" 
        onClick={handleConvert}
        disabled={isConverting}
      >
        {isConverting ? 'Converting...' : 'Convert to Markdown'}
      </button>

      {error && <div className="error">{error}</div>}
      
      {markdown && (
        <pre className="output">{markdown}</pre>
      )}
    </div>
  )
}

export default App
