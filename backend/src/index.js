const express = require('express');
const cors    = require('cors');
const graphRoutes    = require('./routes/graph');
const simulateRoutes = require('./routes/simulate');

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
}));
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    name:    'Social Graph & Notification Fan-Out API',
    version: '1.0.0',
    endpoints: {
      graph:     'GET  /api/graph',
      users:     'GET  /api/graph/users',
      user:      'GET  /api/graph/users/:id',
      edges:     'GET  /api/graph/edges',
      simulate:  'POST /api/simulate  |  GET /api/simulate',
    },
    simulateExample: {
      url:    'POST /api/simulate',
      body: {
        actorId:  'u00',
        action:   'POST',
        strategy: 'bfs',
        maxDepth: 3,
      },
    },
  });
});

app.use('/api/graph',    graphRoutes);
app.use('/api/simulate', simulateRoutes);

// ─── 404 handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route '${req.path}' not found` });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀  Social Graph API running at http://localhost:${PORT}`);
  console.log(`📊  Graph data:   http://localhost:${PORT}/api/graph`);
  console.log(`🔍  BFS simulate: http://localhost:${PORT}/api/simulate?actorId=u00&action=POST&strategy=bfs\n`);
});
