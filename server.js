const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || process.argv[2] || 3001;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);

  // Support /roadsterdash prefix
  if (reqPath.startsWith('/roadsterdash')) {
    reqPath = reqPath.slice('/roadsterdash'.length);
  }

  if (!reqPath || reqPath === '/' || reqPath === '/index.html') {
    reqPath = '/index.html';
  }

  // Candidate paths
  const candidates = [
    path.join(ROOT, reqPath),
    path.join(ROOT, 'public', reqPath),
    path.join(ROOT, 'assets', reqPath)
  ];

  let filePath = null;
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) {
      filePath = c;
      break;
    }
  }

  if (!filePath) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found: ' + reqPath);
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  res.writeHead(200, {
    'Content-Type': contentType,
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-cache'
  });

  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Roadster Dash server running at:`);
  console.log(`  > http://localhost:${PORT}/`);
  console.log(`  > http://127.0.0.1:${PORT}/`);
});
