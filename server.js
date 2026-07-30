const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';
const ROOT = __dirname;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.vtt': 'text/vtt; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff2': 'font/woff2',
};

// The published data sits in a versioned directory that moves every release
// (v0.1.0 -> v0.2.0 -> v0.3.0 ...). Resolve the newest one rather than naming
// it: the previous hardcoded /v0.1.0/ path kept 404ing the viewer for two
// releases after the directory was renamed, with no server-side error.
function latestVersionDir() {
  const semver = /^v(\d+)\.(\d+)\.(\d+)$/;
  return fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter((e) => e.isDirectory() && semver.test(e.name))
    .map((e) => e.name.match(semver).slice(1, 4).map(Number).concat(e.name))
    .sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2])
    .map((v) => v[3])
    .pop();
}

// Fall back to docs/, which carries a copy of the same data for GitHub Pages.
const DATA_DIR = latestVersionDir() || 'docs';

function send(res, status, type, body) {
  res.writeHead(status, { 'Content-Type': type });
  res.end(body);
}

function sendFile(res, filePath, onMissing) {
  fs.readFile(filePath, (err, data) => {
    if (err) return onMissing(err);
    send(res, 200, mimeTypes[path.extname(filePath)] || 'application/octet-stream', data);
  });
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Drop the query/hash and percent-decode before touching the filesystem;
  // req.url is the raw request target, not a path.
  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    return send(res, 400, 'text/plain', 'Bad request');
  }

  if (urlPath === '/standards.json' || urlPath === '/crosswalks.json') {
    urlPath = `/${DATA_DIR}${urlPath}`;
  }

  let fullPath = path.join(ROOT, urlPath);

  // path.join resolves "..", so without this an encoded traversal walks out of
  // the repo. This file is also the deployment run command, not just local dev.
  if (fullPath !== ROOT && !fullPath.startsWith(ROOT + path.sep)) {
    return send(res, 403, 'text/plain', 'Forbidden');
  }

  if (urlPath.endsWith('/')) fullPath = path.join(fullPath, 'index.html');

  sendFile(res, fullPath, (err) => {
    // Directory requested without a trailing slash (e.g. /demo).
    if (err.code === 'EISDIR') {
      return sendFile(res, path.join(fullPath, 'index.html'), () =>
        send(res, 404, 'text/plain', 'Not found'),
      );
    }
    send(res, 404, 'text/plain', 'Not found');
  });
});

server.listen(PORT, HOST, () => {
  console.log(`OMBS Viewer running at http://${HOST}:${PORT}`);
  console.log(`Serving standards data from ${DATA_DIR}/`);
});
