import { User, Edge, Position } from '../types/graph';

// A simple deterministic pseudo-random number generator so layout is consistent
function lcg(seed: number) {
  return function() {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

export function computeLayout(users: User[], edges: Edge[], width: number = 800, height: number = 800): Record<string, Position> {
  const random = lcg(42); // fixed seed
  
  const positions: Record<string, Position> = {};
  const displacements: Record<string, Position> = {};
  
  // Initialize with random positions
  users.forEach(u => {
    positions[u.id] = {
      x: random() * width,
      y: random() * height,
    };
    displacements[u.id] = { x: 0, y: 0 };
  });

  const area = width * height;
  const k = Math.sqrt(area / users.length);
  const iterations = 300;
  let temperature = width / 10;

  const fa = (x: number) => (x * x) / k;
  const fr = (x: number) => (k * k) / x;

  for (let i = 0; i < iterations; i++) {
    // Calculate repulsive forces
    users.forEach(v => {
      displacements[v.id] = { x: 0, y: 0 };
      users.forEach(u => {
        if (v.id !== u.id) {
          const dx = positions[v.id].x - positions[u.id].x;
          const dy = positions[v.id].y - positions[u.id].y;
          let distance = Math.sqrt(dx * dx + dy * dy) || 0.01;
          const force = fr(distance);
          displacements[v.id].x += (dx / distance) * force;
          displacements[v.id].y += (dy / distance) * force;
        }
      });
    });

    // Calculate attractive forces
    edges.forEach(e => {
      const dx = positions[e.source].x - positions[e.target].x;
      const dy = positions[e.source].y - positions[e.target].y;
      let distance = Math.sqrt(dx * dx + dy * dy) || 0.01;
      const force = fa(distance);
      
      const fx = (dx / distance) * force;
      const fy = (dy / distance) * force;
      
      displacements[e.source].x -= fx;
      displacements[e.source].y -= fy;
      displacements[e.target].x += fx;
      displacements[e.target].y += fy;
    });

    // Update positions
    users.forEach(v => {
      const dx = displacements[v.id].x;
      const dy = displacements[v.id].y;
      let distance = Math.sqrt(dx * dx + dy * dy) || 0.01;
      
      const limit = Math.min(distance, temperature);
      
      positions[v.id].x += (dx / distance) * limit;
      positions[v.id].y += (dy / distance) * limit;
      
      // Keep within bounds somewhat, though we can pan/zoom
      positions[v.id].x = Math.max(0, Math.min(width, positions[v.id].x));
      positions[v.id].y = Math.max(0, Math.min(height, positions[v.id].y));
    });
    
    // Cool down
    temperature *= 0.95;
  }
  
  // Center the layout
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  Object.values(positions).forEach(p => {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  });
  
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  
  Object.keys(positions).forEach(id => {
    positions[id].x = positions[id].x - cx + width / 2;
    positions[id].y = positions[id].y - cy + height / 2;
  });

  return positions;
}
