/* eslint-disable @typescript-eslint/no-explicit-any */
import { JSDOM } from 'jsdom';

// Create a JSDOM instance with full browser APIs
const dom = new JSDOM('<!DOCTYPE html>', {
  pretendToBeVisual: true,
  runScripts: 'dangerously'
});
const { window } = dom;

// Set up globalThis with all browser APIs from jsdom BEFORE any imports
// This must happen before pdfjs-dist or any other library tries to use these
Object.getOwnPropertyNames(window).forEach((key) => {
  if (!(key in globalThis)) {
    try {
      // @ts-expect-error - dynamic property access
      globalThis[key] = window[key];
    } catch {
      // Some properties can't be copied
    }
  }
});

// Explicitly ensure these critical APIs are available
if (!globalThis.DOMMatrix) {
  // @ts-expect-error - jsdom DOMMatrix
  globalThis.DOMMatrix = window.DOMMatrix;
}
if (!globalThis.DOMRect) {
  // @ts-expect-error - jsdom DOMRect
  globalThis.DOMRect = window.DOMRect;
}
if (!globalThis.Path2D) {
  // @ts-expect-error - jsdom Path2D
  globalThis.Path2D = window.Path2D;
}
if (!globalThis.ImageData) {
  globalThis.ImageData = window.ImageData;
}

// Also set up process.getBuiltinModule if needed for pdfjs-dist
if (typeof process !== 'undefined' && typeof process.getBuiltinModule === 'undefined') {
  // @ts-expect-error - Node.js internal
  process.getBuiltinModule = (module: string) => require(module);
}
