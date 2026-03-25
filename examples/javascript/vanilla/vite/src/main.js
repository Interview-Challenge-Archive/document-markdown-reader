import { Buffer } from 'buffer'

if (typeof globalThis.Buffer === 'undefined') {
  globalThis.Buffer = Buffer
}

const documentMarkdownReaderPromise = import('@interview-challenge-archive/document-markdown-reader')
  .then((module) => module.documentMarkdownReader)

async function readDocument(file) {
  try {
    const documentMarkdownReader = await documentMarkdownReaderPromise
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

documentMarkdownReaderPromise
  .then((documentMarkdownReader) => {
    fileInput.setAttribute('accept', documentMarkdownReader.acceptedExtensions)
    console.log('Supported extensions:', documentMarkdownReader.supportedExtensions)
    console.log('HTML accept attribute:', documentMarkdownReader.acceptedExtensions)
  })
  .catch((error) => {
    console.error('Failed to load document reader:', error)
  })
