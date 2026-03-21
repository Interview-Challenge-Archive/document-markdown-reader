import vue from 'rollup-plugin-vue';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    sourcemap: true,
    globals: {
      'vue': 'Vue'
    }
  },
  plugins: [
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    vue({
      css: true
    }),
    resolve({
      browser: true,
      extensions: ['.js', '.vue']
    }),
    commonjs(),
    postcss({
      extract: 'styles.css',
      minimize: true
    })
  ]
};
