const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { spawn } = require('child_process');

const root = __dirname;
const port = process.env.PORT || 3000;

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

function serveFile(filePath, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Server error');
      console.error('Read error', err);
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const type = mime[ext] || 'application/octet-stream';
    res.statusCode = 200;
    res.setHeader('Content-Type', type + (type.startsWith('text/') ? '; charset=utf-8' : ''));
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  try {
    const parsed = url.parse(req.url);
    let pathname = decodeURIComponent(parsed.pathname);

    // Prevent directory traversal
    if (pathname.includes('..')) {
      res.statusCode = 400;
      res.end('Bad request');
      return;
    }

    if (pathname === '/') pathname = '/index.html';

    const filePath = path.join(root, pathname);

    fs.stat(filePath, (err, stats) => {
      if (err) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end('<h1>404 Not Found</h1>');
        return;
      }

      if (stats.isDirectory()) {
        const index = path.join(filePath, 'index.html');
        fs.stat(index, (ie, istats) => {
          if (ie || !istats.isFile()) {
            res.statusCode = 403;
            res.end('Forbidden');
            return;
          }
          serveFile(index, res);
        });
        return;
      }

      serveFile(filePath, res);
    });
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.end('Server error');
  }
});

server.listen(port, () => {
  const url = `http://localhost:${port}`;
  console.log(`Server running at ${url}`);

  // Note: auto-opening the browser has been removed to avoid environment-specific
  // side-effects. You can open the URL manually: http://localhost:3000
  console.log('Open the URL in your browser to view the site.');
});

// Graceful shutdown (disabled temporarily for debugging unexpected exit)
// If you want graceful shutdown behavior, uncomment the handler below.
/*
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => process.exit(0));
});
*/

// Capture unexpected errors to help debugging
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});

// Log server errors (e.g., port in use)
server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});

// Keep the process alive in case the environment has no active handles
// (useful while debugging in some runners). This is harmless locally.
if (process.stdin && process.stdin.isTTY) {
  // Keep stdin open so Node doesn't exit when no other handles are present
  process.stdin.resume();
}

// As a last-resort keepalive for environments that still exit, create a noop interval.
// This is harmless and can be removed if you prefer not to have it.
setInterval(() => {}, 1e7);
