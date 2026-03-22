const path = require('path');
const { HtmlRspackPlugin } = require('@rspack/core');
const RefreshPlugin = require('@rspack/plugin-react-refresh');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  entry: './src/index.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'ecmascript',
                jsx: true,
              },
              transform: {
                react: {
                  runtime: 'automatic',
                  development: isDev,
                  refresh: isDev,
                },
              },
            },
          },
        },
      },
      {
        test: /\.css$/,
        type: 'css',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new HtmlRspackPlugin({
      template: './index.html',
    }),
    isDev && new RefreshPlugin(),
  ].filter(Boolean),
  devServer: {
    port: 3000,
    hot: true,
  },
};
