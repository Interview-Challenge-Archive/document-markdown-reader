/* eslint-disable @typescript-eslint/no-explicit-any */
import { JSDOM } from 'jsdom';

// Create a JSDOM instance to get DOMMatrix and other globals
const dom = new JSDOM('<!DOCTYPE html>');
const { window } = dom;

// Polyfill globalThis with missing browser APIs from jsdom
// Using any cast to avoid constructor issues across different Node versions
if (typeof globalThis.DOMMatrix === 'undefined') {
  // @ts-expect-error - jsdom DOMMatrix constructor
  globalThis.DOMMatrix = window.DOMMatrix;
}
if (typeof globalThis.DOMRect === 'undefined') {
  // @ts-expect-error - jsdom DOMRect constructor
  globalThis.DOMRect = window.DOMRect;
}
if (typeof globalThis.Path2D === 'undefined') {
  // @ts-expect-error - jsdom Path2D constructor
  globalThis.Path2D = window.Path2D;
}
if (typeof globalThis.ImageData === 'undefined') {
  globalThis.ImageData = window.ImageData;
}
