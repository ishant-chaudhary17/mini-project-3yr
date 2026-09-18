const express = require('express');
const router = express.Router();
const { users } = require('../data/socialGraph');
const { runFanOut } = require('../algorithms/bfs');

const VALID_STRATEGIES = ['direct', 'bfs', 'depth'];
const VALID_ACTIONS    = ['POST', 'LIKE', 'FOLLOW'];

/**
 * POST /api/simulate
 *
 * Body:
 * {
 *   "actorId":  "u00",          // required — ID of the triggering user
 *   "action":   "POST",         // required — "POST" | "LIKE" | "FOLLOW"
 *   "strategy": "bfs",          // required — "direct" | "bfs" | "depth"
 *   "maxDepth": 3               // optional — only used for 'depth' strategy (default: 3)
 * }
 *
 * Response:
 * {
 *   "actor":               { ...userObject },
 *   "action":              "POST",
 *   "strategy":            "bfs",
 *   "levels":              [ { depth, recipients: [...userObjects], edges: [...edgeIds] } ],
 *   "totalReached":        42,
 *   "totalEdgesTraversed": 50,
 *   "maxDepthReached":     4
 * }
 */
router.post('/', (req, res) => {
  const { actorId, action, strategy, maxDepth = 3 } = req.body;

  // --- Validation ---
  if (!actorId || !action || !strategy) {
    return res.status(400).json({
      error: 'Missing required fields: actorId, action, strategy',
    });
  }

  const actor = users.find(u => u.id === actorId);
  if (!actor) {
    return res.status(404).json({ error: `User '${actorId}' not found` });
  }

  if (!VALID_ACTIONS.includes(action)) {
    return res.status(400).json({
      error: `Invalid action. Must be one of: ${VALID_ACTIONS.join(', ')}`,
    });
  }

  if (!VALID_STRATEGIES.includes(strategy)) {
    return res.status(400).json({
      error: `Invalid strategy. Must be one of: ${VALID_STRATEGIES.join(', ')}`,
    });
  }

  const depth = parseInt(maxDepth, 10);
  if (strategy === 'depth' && (isNaN(depth) || depth < 1 || depth > 10)) {
    return res.status(400).json({ error: 'maxDepth must be an integer between 1 and 10' });
  }

  // --- Run simulation ---
  const result = runFanOut(actorId, strategy, depth, action);

  // Enrich recipient IDs with full user objects
  const enrichedLevels = result.levels.map(level => ({
    depth: level.depth,
    recipients: level.recipients.map(id => users.find(u => u.id === id)),
    edges: level.edges,
  }));

  res.json({
    actor,
    action,
    strategy,
    maxDepth: depth,
    levels: enrichedLevels,
    totalReached: result.totalReached,
    totalEdgesTraversed: result.totalEdgesTraversed,
    maxDepthReached: result.maxDepthReached,
  });
});

/**
 * GET /api/simulate?actorId=u00&action=POST&strategy=bfs&maxDepth=3
 * Convenience GET version (same logic, uses query params instead of body)
 */
router.get('/', (req, res) => {
  const { actorId, action, strategy, maxDepth = 3 } = req.query;

  if (!actorId || !action || !strategy) {
    return res.status(400).json({
      error: 'Missing required query params: actorId, action, strategy',
    });
  }

  const actor = users.find(u => u.id === actorId);
  if (!actor) return res.status(404).json({ error: `User '${actorId}' not found` });

  if (!VALID_ACTIONS.includes(action))    return res.status(400).json({ error: `Invalid action` });
  if (!VALID_STRATEGIES.includes(strategy)) return res.status(400).json({ error: `Invalid strategy` });

  const depth = parseInt(maxDepth, 10);
  const result = runFanOut(actorId, strategy, depth, action);

  const enrichedLevels = result.levels.map(level => ({
    depth: level.depth,
    recipients: level.recipients.map(id => users.find(u => u.id === id)),
    edges: level.edges,
  }));

  res.json({
    actor,
    action,
    strategy,
    maxDepth: depth,
    levels: enrichedLevels,
    totalReached: result.totalReached,
    totalEdgesTraversed: result.totalEdgesTraversed,
    maxDepthReached: result.maxDepthReached,
  });
});

module.exports = router;
