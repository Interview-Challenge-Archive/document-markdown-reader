import vue from 'rollup-plugin-vue';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/main.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    name: 'app',
    sourcemap: true,
  },
  plugins: [
    vue(),
    resolve({
      browser: true,
      dedupe: ['vue'],
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
    }),
  ],
};
