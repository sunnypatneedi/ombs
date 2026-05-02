const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5000;
const HOST = '0.0.0.0';

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.md': 'text/plain',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  let filePath = req.url === '/' ? '/index.html' : req.url;

  if (filePath === '/standards.json') {
    filePath = '/v0.1.0/standards.json';
  } else if (filePath === '/crosswalks.json') {
    filePath = '/v0.1.0/crosswalks.json';
  }

  const fullPath = path.join(__dirname, filePath);
  const ext = path.extname(fullPath);
  const contentType = mimeTypes[ext] || 'text/plain';

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`OMBS Viewer running at http://${HOST}:${PORT}`);
});
