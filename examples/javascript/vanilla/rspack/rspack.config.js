import path from 'path';
import { createRequire } from 'module';
import rspack from '@rspack/core';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const require = createRequire(import.meta.url);

export default {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(process.cwd(), 'dist'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new rspack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: ['process/browser'],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    alias: {
      '@jose.espana/docstream$': '@jose.espana/docstream/dist/officeparser.browser.js',
      'process/browser$': require.resolve('process/browser.js'),
    },
    fallback: {
      fs: false,
      stream: require.resolve('stream-browserify'),
      util: require.resolve('util/'),
      zlib: require.resolve('browserify-zlib'),
      events: require.resolve('events/'),
      buffer: require.resolve('buffer/'),
      process: require.resolve('process/browser.js'),
      assert: require.resolve('assert/'),
    },
  },
};
