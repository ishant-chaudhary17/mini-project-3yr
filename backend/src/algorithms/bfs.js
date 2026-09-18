/**
 * BFS (Breadth-First Search) based notification fan-out algorithm.
 *
 * Three propagation strategies are supported:
 *  - 'direct'  : Only immediate neighbours (depth 1)
 *  - 'bfs'     : Full BFS across the entire graph (no depth limit)
 *  - 'depth'   : BFS limited to `maxDepth` hops
 *
 * Time complexity: O(V + E)  where V = users, E = edges
 */

const { edges } = require('../data/socialGraph');

/**
 * Returns all direct neighbours of a given node.
 * @param {string} nodeId
 * @returns {string[]}
 */
function getNeighbors(nodeId) {
  const neighbors = new Set();
  for (const edge of edges) {
    if (edge.source === nodeId) neighbors.add(edge.target);
    if (edge.target === nodeId) neighbors.add(edge.source);
  }
  return Array.from(neighbors);
}

/**
 * Resolves the effective depth cap for a given strategy.
 * @param {'direct'|'bfs'|'depth'} strategy
 * @param {number} selectedDepth  - user-selected depth (only used for 'depth' strategy)
 * @returns {number}
 */
function resolveMaxDepth(strategy, selectedDepth) {
  if (strategy === 'direct') return 1;
  if (strategy === 'bfs')    return Infinity;
  return selectedDepth;               // 'depth' strategy
}

/**
 * Runs the fan-out simulation and returns a level-by-level result.
 *
 * @param {string} actorId        - ID of the user who triggered the action
 * @param {'direct'|'bfs'|'depth'} strategy
 * @param {number} maxDepth       - Maximum hop depth (used for 'depth' strategy)
 * @param {'POST'|'LIKE'|'FOLLOW'} action
 * @returns {{ levels: Array<{ depth: number, recipients: string[], edges: string[] }>, totalReached: number, totalEdgesTraversed: number }}
 */
function runFanOut(actorId, strategy, maxDepth, action) {
  const effectiveDepth = resolveMaxDepth(strategy, maxDepth);

  const visited = new Set([actorId]);
  const levels = [];
  let queue = [actorId];
  let currentDepth = 0;
  let totalEdgesTraversed = 0;

  while (queue.length > 0 && currentDepth < effectiveDepth) {
    currentDepth++;
    const nextQueue = [];
    const levelRecipients = [];
    const levelEdges = [];

    for (const nodeId of queue) {
      const neighbors = getNeighbors(nodeId);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          nextQueue.push(neighbor);
          levelRecipients.push(neighbor);
          // Find the edge id that connects nodeId <-> neighbor
          const edge = edges.find(
            e => (e.source === nodeId && e.target === neighbor) ||
                 (e.target === nodeId && e.source === neighbor)
          );
          if (edge) levelEdges.push(edge.id);
          totalEdgesTraversed++;
        }
      }
    }

    if (levelRecipients.length > 0) {
      levels.push({
        depth: currentDepth,
        recipients: levelRecipients,
        edges: levelEdges,
      });
    }

    queue = nextQueue;
  }

  return {
    actor: actorId,
    action,
    strategy,
    levels,
    totalReached: visited.size - 1, // exclude the actor
    totalEdgesTraversed,
    maxDepthReached: currentDepth,
  };
}

module.exports = { runFanOut, getNeighbors };
