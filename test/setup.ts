import { JSDOM } from 'jsdom';

// Create a JSDOM instance to get DOMMatrix and other globals
const dom = new JSDOM('<!DOCTYPE html>');
const { window } = dom;

// Polyfill globalThis with missing browser APIs from jsdom
if (typeof globalThis.DOMMatrix === 'undefined') {
  globalThis.DOMMatrix = window.DOMMatrix as globalThis.DOMMatrix;
}
if (typeof globalThis.DOMRect === 'undefined') {
  globalThis.DOMRect = window.DOMRect as globalThis.DOMRect;
}
if (typeof globalThis.Path2D === 'undefined') {
  globalThis.Path2D = window.Path2D as globalThis.Path2D;
}
if (typeof globalThis.ImageData === 'undefined') {
  globalThis.ImageData = window.ImageData as globalThis.ImageData;
}
