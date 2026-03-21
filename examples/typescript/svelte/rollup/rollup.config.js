import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import sveltePreprocess from 'svelte-preprocess';

export default {
  input: 'src/main.ts',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'dist/bundle.js'
  },
  plugins: [
    svelte({
      preprocess: sveltePreprocess(),
      compilerOptions: {
        dev: true
      }
    }),
    commonjs(),
    typescript({
      sourceMap: true,
      inlineSources: true
    })
  ],
  watch: {
    clearScreen: false
  }
};
