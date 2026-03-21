import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/index.jsx',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    sourcemap: true
  },
  plugins: [
    resolve({
      extensions: ['.js', '.jsx']
    }),
    commonjs(),
    postcss({
      extract: 'styles.css',
      minimize: true
    })
  ]
};
