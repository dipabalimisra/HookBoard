const express = require('express');
const cors = require('cors');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const shortid = require('shortid');
const bodyParser = require('body-parser');
const path = require('path');

if (typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile(path.join(__dirname, '.env'));
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.warn(`Could not load Backend/.env: ${error.message}`);
    }
  }
}

const app = express();
const PORT = process.env.PORT || 5000;

// Setup DB
const dbFile = path.join(__dirname, 'db.json');
const adapter = new JSONFile(dbFile);
const db = new Low(adapter, { hooks: [], requests: {} });

app.use(cors());
app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize DB
async function initDB() {
  await db.read();
  db.data = db.data || { hooks: [], requests: {} };
  await db.write();
}

// Create a new hook
app.post('/api/hooks', async (req, res) => {
  await db.read();
  const id = shortid.generate();
  const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
  db.data.hooks.push({ id, name, createdAt: Date.now() });
  db.data.requests[id] = [];
  await db.write();
  res.json({ id, name, url: `/h/${id}` });
});

// List all hooks
app.get('/api/hooks', async (req, res) => {
  await db.read();
  res.json(db.data.hooks);
});

// List requests for a hook
app.get('/api/hooks/:id/requests', async (req, res) => {
  await db.read();
  const { id } = req.params;
  res.json(db.data.requests[id] || []);
});

// Receive webhook
app.post('/h/:id', async (req, res) => {
  await db.read();
  const { id } = req.params;
  if (!db.data.requests[id]) {
    return res.status(404).json({ error: 'Hook not found' });
  }
  const record = {
    headers: req.headers,
    body: req.body,
    query: req.query,
    timestamp: Date.now(),
  };
  db.data.requests[id].push(record);
  await db.write();
  res.json({ status: 'received' });
});

// Export requests as JSON
app.get('/api/hooks/:id/export', async (req, res) => {
  await db.read();
  const { id } = req.params;
  const data = db.data.requests[id] || [];
  res.setHeader('Content-Disposition', `attachment; filename="hook_${id}_requests.json"`);
  res.json(data);
});

initDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Set PORT to another value, for example: PORT=5001.`);
      process.exit(1);
    }

    console.error(error);
    process.exit(1);
  });
});
