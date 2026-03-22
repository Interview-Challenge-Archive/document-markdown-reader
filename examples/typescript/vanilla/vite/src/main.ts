import { documentMarkdownReader } from 'document-markdown-reader'

async function readDocument(file: File): Promise<string> {
  try {
    return await documentMarkdownReader.readDocument(file)
  } catch (error) {
    console.error('Failed to read document:', error)
    throw error
  }
}

const fileInput = document.querySelector<HTMLInputElement>('#summary-file')!
const convertBtn = document.querySelector<HTMLButtonElement>('#convert-btn')!
const output = document.querySelector<HTMLPreElement>('#output')!

convertBtn.addEventListener('click', () => {
  const file = fileInput.files?.[0]

  if (file) {
    output.textContent = 'Converting...'

    readDocument(file)
      .then(markdown => {
        output.textContent = markdown
      })
      .catch((error: Error) => {
        output.textContent = 'Error: ' + error.message
      })
  } else {
    output.textContent = 'Please select a file first'
  }
})

console.log('Supported extensions:', documentMarkdownReader.supportedExtensions)
console.log('HTML accept attribute:', documentMarkdownReader.acceptedExtensions)
