import { JSDOM } from 'jsdom';

// Polyfill DOMMatrix for pdfjs-dist
if (typeof globalThis.DOMMatrix === 'undefined') {
  globalThis.DOMMatrix = class DOMMatrix {
    a: number = 1;
    b: number = 0;
    c: number = 0;
    d: number = 1;
    e: number = 0;
    f: number = 0;
    m11: number = 1;
    m12: number = 0;
    m13: number = 0;
    m14: number = 0;
    m21: number = 0;
    m22: number = 1;
    m23: number = 0;
    m24: number = 0;
    m31: number = 0;
    m32: number = 0;
    m33: number = 1;
    m34: number = 0;
    m41: number = 0;
    m42: number = 0;
    m43: number = 0;
    m44: number = 1;
    is2D: boolean = true;
    isIdentity: boolean = true;

    constructor(matrix?: string | DOMMatrixInit) {
      if (matrix) {
        if (typeof matrix === 'string') {
          // Parse CSS transform string
          const match = matrix.match(/matrix\((.*)\)/);
          if (match) {
            const parts = match[1].split(',').map(Number);
            this.a = parts[0];
            this.b = parts[1];
            this.c = parts[2];
            this.d = parts[3];
            this.e = parts[4];
            this.f = parts[5];
          }
        } else {
          this.a = matrix.a ?? 1;
          this.b = matrix.b ?? 0;
          this.c = matrix.c ?? 0;
          this.d = matrix.d ?? 1;
          this.e = matrix.e ?? 0;
          this.f = matrix.f ?? 0;
        }
        this.updateProps();
      }
    }

    private updateProps() {
      this.m11 = this.a;
      this.m12 = this.b;
      this.m13 = 0;
      this.m14 = 0;
      this.m21 = this.c;
      this.m22 = this.d;
      this.m23 = 0;
      this.m24 = 0;
      this.m31 = 0;
      this.m32 = 0;
      this.m33 = 1;
      this.m34 = 0;
      this.m41 = this.e;
      this.m42 = this.f;
      this.m43 = 0;
      this.m44 = 1;
      this.is2D = true;
      this.isIdentity = this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1 && this.e === 0 && this.f === 0;
    }

    translate(x: number, y: number, z?: number): DOMMatrix {
      const result = new DOMMatrix();
      result.e += x;
      result.f += y;
      return result;
    }
  } as any;
}
