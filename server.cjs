const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DIST = path.join(__dirname, 'dist');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
  '.json': 'application/json',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
  '.ttf':  'font/ttf',
};

const server = http.createServer((req, res) => {
  // Remove query string
  let urlPath = req.url.split('?')[0];

  // Try exact file first
  let filePath = path.join(DIST, urlPath);

  // Security: prevent path traversal
  if (!filePath.startsWith(DIST)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  const tryFile = (fp) => {
    if (fs.existsSync(fp) && fs.statSync(fp).isFile()) {
      const ext = path.extname(fp).toLowerCase();
      const mime = MIME[ext] || 'application/octet-stream';
      // Long cache for hashed assets
      const isHashed = /\.[a-f0-9]{8,}\.(js|css)$/.test(fp);
      res.writeHead(200, {
        'Content-Type': mime,
        'Cache-Control': isHashed ? 'public, max-age=31536000, immutable' : 'no-cache',
      });
      fs.createReadStream(fp).pipe(res);
      return true;
    }
    return false;
  };

  // 1. Try exact path
  if (tryFile(filePath)) return;

  // 2. Try with index.html appended (for directories)
  if (tryFile(path.join(filePath, 'index.html'))) return;

  // 3. SPA fallback — serve index.html for all routes
  const indexPath = path.join(DIST, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache',
    });
    fs.createReadStream(indexPath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`VerbaTech CRM running on port ${PORT}`);
});
