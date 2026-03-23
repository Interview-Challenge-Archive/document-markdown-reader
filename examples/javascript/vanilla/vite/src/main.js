import { documentMarkdownReader } from '@interview-challenge-archive/document-markdown-reader'

async function readDocument(file) {
  try {
    return await documentMarkdownReader.readDocument(file)
  } catch (error) {
    console.error('Failed to read document:', error)
    throw error
  }
}

const fileInput = document.querySelector('#summary-file')
const convertBtn = document.querySelector('#convert-btn')
const output = document.querySelector('#output')

convertBtn.addEventListener('click', () => {
  const file = fileInput.files?.[0]

  if (file) {
    output.textContent = 'Converting...'

    readDocument(file)
      .then(markdown => {
        output.textContent = markdown
      })
      .catch((error) => {
        output.textContent = 'Error: ' + error.message
      })
  } else {
    output.textContent = 'Please select a file first'
  }
})

console.log('Supported extensions:', documentMarkdownReader.supportedExtensions)
console.log('HTML accept attribute:', documentMarkdownReader.acceptedExtensions)
