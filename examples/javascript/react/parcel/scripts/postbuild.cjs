const fs = require('node:fs');
const path = require('node:path');

const sourceHtmlPath = path.join(__dirname, '..', 'src', 'index.html');
const distHtmlPath = path.join(__dirname, '..', 'dist', 'index.html');

let html = fs.readFileSync(sourceHtmlPath, 'utf8');
html = html.replace(
  /<script\s+type="module"\s+src="\.\/index\.jsx"><\/script>/,
  '<script src="./index.js"></script>'
);

fs.writeFileSync(distHtmlPath, html);
