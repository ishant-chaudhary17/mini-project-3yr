import { Edge, PropagationStrategy, SimulationSpeed } from '../types/graph';

export function getNeighbors(nodeId: string, edges: Edge[]): string[] {
  const neighbors: string[] = [];
  edges.forEach(e => {
    if (e.source === nodeId) neighbors.push(e.target);
    if (e.target === nodeId) neighbors.push(e.source);
  });
  return Array.from(new Set(neighbors));
}

export function getSpeedMs(speed: SimulationSpeed): number {
  switch (speed) {
    case 'slow': return 2000;
    case 'fast': return 500;
    case 'normal':
    default: return 1000;
  }
}

export function calculateMaxDepth(strategy: PropagationStrategy, selectedDepth: number): number {
  if (strategy === 'direct') return 1;
  if (strategy === 'bfs') return 999; // Essentially infinite for this size
  return selectedDepth;
}
