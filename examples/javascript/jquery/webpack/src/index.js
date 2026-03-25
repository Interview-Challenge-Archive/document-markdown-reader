import $ from 'jquery';
import { documentMarkdownReader } from '@interview-challenge-archive/document-markdown-reader';

const $fileInput = $('#file-input');
const $convertButton = $('#convert-btn');
const $loading = $('#loading');
const $error = $('#error');
const $output = $('#output');

$fileInput.attr('accept', documentMarkdownReader.acceptedExtensions);

async function handleConvert() {
  const input = $fileInput.get(0);
  const file = input?.files?.[0];

  if (!file) {
    $error.text('Please select a file first');
    $output.text('');
    return;
  }

  $loading.text('Loading document...');
  $error.text('');
  $output.text('');

  try {
    const markdown = await documentMarkdownReader.readDocument(file);
    $output.text(markdown);
  } catch (error) {
    $error.text(error instanceof Error ? error.message : 'Failed to read document');
  } finally {
    $loading.text('');
  }
}

$convertButton.on('click', () => {
  void handleConvert();
});
