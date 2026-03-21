/* eslint-disable @typescript-eslint/no-explicit-any */
import { JSDOM } from 'jsdom';

// Create a JSDOM instance to get DOMMatrix and other globals
const dom = new JSDOM('<!DOCTYPE html>');
const { window } = dom;

// Polyfill globalThis with missing browser APIs from jsdom
if (typeof globalThis.DOMMatrix === 'undefined') {
  (globalThis as any).DOMMatrix = window.DOMMatrix;
}
if (typeof globalThis.DOMRect === 'undefined') {
  (globalThis as any).DOMRect = window.DOMRect;
}
if (typeof globalThis.Path2D === 'undefined') {
  (globalThis as any).Path2D = window.Path2D;
}
if (typeof globalThis.ImageData === 'undefined') {
  (globalThis as any).ImageData = window.ImageData;
}
