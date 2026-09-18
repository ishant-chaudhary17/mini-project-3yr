const express = require('express');
const router = express.Router();
const { users, edges } = require('../data/socialGraph');

// GET /api/graph — full graph (users + edges)
router.get('/', (req, res) => {
  res.json({
    users,
    edges,
    stats: {
      totalUsers: users.length,
      totalEdges: edges.length,
    },
  });
});

// GET /api/graph/users — all users
router.get('/users', (req, res) => {
  res.json({ users });
});

// GET /api/graph/users/:id — single user
router.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: `User '${req.params.id}' not found` });
  }

  // Also return direct connections
  const connections = edges
    .filter(e => e.source === user.id || e.target === user.id)
    .map(e => (e.source === user.id ? e.target : e.source));

  const connectedUsers = users.filter(u => connections.includes(u.id));
  res.json({ user, connections: connectedUsers });
});

// GET /api/graph/edges — all edges
router.get('/edges', (req, res) => {
  res.json({ edges });
});

module.exports = router;
