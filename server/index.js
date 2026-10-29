const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { execFile } = require('child_process');

const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'secureship-api', timestamp: new Date().toISOString() });
});

// This endpoint invokes Trivy against a fixed, local demo directory only.
// It never accepts a user-provided filesystem path or remote target.
app.post('/api/scan', (_req, res) => {
  const projectRoot = path.resolve(__dirname, '..');
  execFile('trivy', ['fs', '--scanners', 'vuln,secret,misconfig', '--format', 'table', projectRoot],
    { timeout: 90000, maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        const missing = error.code === 'ENOENT';
        return res.status(missing ? 501 : 500).json({
          status: 'unavailable',
          message: missing
            ? 'Trivy is not installed. Install Trivy to run a real local scan; dashboard data is sample data.'
            : 'Trivy scan did not complete. Check the server terminal and try again.',
          details: String(stderr || error.message).slice(0, 1200)
        });
      }
      res.json({
        status: 'completed',
        message: 'Trivy filesystem scan completed. Review the server output for results.',
        output: String(stdout).slice(0, 12000)
      });
    });
});

const dist = path.resolve(__dirname, '..', 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.listen(PORT, () => console.log(`SecureShip API listening on http://localhost:${PORT}`));