import { useEffect, useRef, useState, useCallback } from 'react';

// ─── Graph Data ────────────────────────────────────────────────────────────────
// 14 nodes laid out in a radial tree emanating from h0 at center
// Positions are in a 500×400 coordinate space, rendered with a proper viewBox

const NODES: { id: string; label: string; x: number; y: number }[] = [
  { id: 'h0',  label: 'h0',  x: 250, y: 200 },  // root / actor

  // Level 1 — immediate neighbours
  { id: 'h1',  label: 'h1',  x: 100, y: 100 },
  { id: 'h2',  label: 'h2',  x: 250, y:  60 },
  { id: 'h3',  label: 'h3',  x: 400, y: 100 },

  // Level 2 — second-hop neighbours
  { id: 'h4',  label: 'h4',  x:  40, y: 210 },
  { id: 'h5',  label: 'h5',  x: 110, y: 310 },
  { id: 'h6',  label: 'h6',  x: 250, y: 340 },
  { id: 'h7',  label: 'h7',  x: 390, y: 310 },
  { id: 'h8',  label: 'h8',  x: 460, y: 210 },

  // Level 3 — third-hop neighbours
  { id: 'h9',  label: 'h9',  x:  30, y: 330 },
  { id: 'h10', label: 'h10', x: 130, y: 390 },
  { id: 'h11', label: 'h11', x: 250, y: 390 },
  { id: 'h12', label: 'h12', x: 370, y: 390 },
  { id: 'h13', label: 'h13', x: 470, y: 330 },
];

const EDGES: { id: string; source: string; target: string }[] = [
  // Level 1
  { id: 'e0',  source: 'h0', target: 'h1' },
  { id: 'e1',  source: 'h0', target: 'h2' },
  { id: 'e2',  source: 'h0', target: 'h3' },
  // Level 2
  { id: 'e3',  source: 'h1', target: 'h4' },
  { id: 'e4',  source: 'h1', target: 'h5' },
  { id: 'e5',  source: 'h2', target: 'h6' },
  { id: 'e6',  source: 'h3', target: 'h7' },
  { id: 'e7',  source: 'h3', target: 'h8' },
  // Level 3
  { id: 'e8',  source: 'h4', target: 'h9'  },
  { id: 'e9',  source: 'h5', target: 'h10' },
  { id: 'e10', source: 'h6', target: 'h11' },
  { id: 'e11', source: 'h7', target: 'h12' },
  { id: 'e12', source: 'h8', target: 'h13' },
  // Cross connection (makes it look more realistic)
  { id: 'e13', source: 'h2', target: 'h5'  },
];

// Build adjacency map: node -> list of {target, edgeId, level}
// Level 1 = direct from h0, etc.
const BFS_LEVELS: { nodeId: string; level: number; sourceId: string; edgeId: string }[] = [
  { nodeId: 'h1',  level: 1, sourceId: 'h0', edgeId: 'e0'  },
  { nodeId: 'h2',  level: 1, sourceId: 'h0', edgeId: 'e1'  },
  { nodeId: 'h3',  level: 1, sourceId: 'h0', edgeId: 'e2'  },
  { nodeId: 'h4',  level: 2, sourceId: 'h1', edgeId: 'e3'  },
  { nodeId: 'h5',  level: 2, sourceId: 'h1', edgeId: 'e4'  },
  { nodeId: 'h6',  level: 2, sourceId: 'h2', edgeId: 'e5'  },
  { nodeId: 'h7',  level: 2, sourceId: 'h3', edgeId: 'e6'  },
  { nodeId: 'h8',  level: 2, sourceId: 'h3', edgeId: 'e7'  },
  { nodeId: 'h9',  level: 3, sourceId: 'h4', edgeId: 'e8'  },
  { nodeId: 'h10', level: 3, sourceId: 'h5', edgeId: 'e9'  },
  { nodeId: 'h11', level: 3, sourceId: 'h6', edgeId: 'e10' },
  { nodeId: 'h12', level: 3, sourceId: 'h7', edgeId: 'e11' },
  { nodeId: 'h13', level: 3, sourceId: 'h8', edgeId: 'e12' },
];

// ─── Types ────────────────────────────────────────────────────────────────────
type NodeStatus = 'idle' | 'actor' | 'processing' | 'notified';
type NodeState = { status: NodeStatus; level: number };
type Particle  = { id: number; edgeId: string; source: string; target: string; level: number; progress: number };

// ─── Colour helpers ───────────────────────────────────────────────────────────
const LEVEL_COLORS = ['#FFB020', '#35E0C8', '#8B7BFF', '#FF6B9B'] as const;
function levelColor(level: number): string {
  if (level === 0) return LEVEL_COLORS[0]; // actor = amber
  if (level === 1) return LEVEL_COLORS[1]; // teal
  if (level === 2) return LEVEL_COLORS[2]; // violet
  return LEVEL_COLORS[3];                  // rose
}

// ─── Node position lookup ─────────────────────────────────────────────────────
const posOf = (id: string) => NODES.find(n => n.id === id)!;

// ─── Component ───────────────────────────────────────────────────────────────
export function HeroGraph() {
  const [nodeStates, setNodeStates] = useState<Record<string, NodeState>>({});
  const [particles, setParticles]   = useState<Particle[]>([]);
  const particleIdRef = useRef(0);
  const rafRef        = useRef<number>();
  const lastTickRef   = useRef<number>(0);
  // Queue of BFS items yet to be launched
  const pendingRef    = useRef<typeof BFS_LEVELS>([]);

  // Restart the simulation from scratch
  const startSim = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    // Reset state
    setNodeStates({ h0: { status: 'actor', level: 0 } });
    setParticles([]);
    pendingRef.current = [...BFS_LEVELS];

    // Launch level-1 particles immediately after a short delay
    setTimeout(() => {
      launchNextLevel();
    }, 400);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Launch all items from the next BFS depth level
  const launchNextLevel = () => {
    const allPending = pendingRef.current;
    if (allPending.length === 0) return;

    const nextLevel = allPending[0].level;
    const batch = allPending.filter(p => p.level === nextLevel);
    pendingRef.current = allPending.filter(p => p.level !== nextLevel);

    // Mark targets as 'processing'
    setNodeStates(prev => {
      const next = { ...prev };
      batch.forEach(b => { next[b.nodeId] = { status: 'processing', level: b.level }; });
      return next;
    });

    // Spawn particles
    setParticles(prev => [
      ...prev,
      ...batch.map(b => ({
        id: ++particleIdRef.current,
        edgeId: b.edgeId,
        source: b.sourceId,
        target: b.nodeId,
        level: b.level,
        progress: 0,
      })),
    ]);
  };

  // Animation loop
  useEffect(() => {
    const SPEED_MS = 1200; // ms per traversal

    const loop = (ts: number) => {
      const dt = ts - (lastTickRef.current || ts);
      lastTickRef.current = ts;
      const inc = dt / SPEED_MS;

      setParticles(prev => {
        let finished: Particle[] = [];
        const next = prev
          .map(p => {
            const np = p.progress + inc;
            if (np >= 1) finished.push(p);
            return { ...p, progress: Math.min(1, np) };
          })
          .filter(p => p.progress < 1);

        if (finished.length > 0) {
          // Mark finished targets as 'notified'
          setNodeStates(ns => {
            const copy = { ...ns };
            finished.forEach(p => {
              copy[p.target] = { status: 'notified', level: p.level };
            });
            return copy;
          });

          // If all particles are gone and queue is empty → simulation done; schedule restart
          if (next.length === 0 && pendingRef.current.length === 0) {
            setTimeout(startSim, 2200);
          } else if (next.length === 0 && pendingRef.current.length > 0) {
            // Launch next BFS level
            setTimeout(launchNextLevel, 250);
          }
        }

        return next;
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [startSim]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-start on mount
  useEffect(() => {
    startSim();
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="relative w-full h-[420px] lg:h-[520px] rounded-2xl border border-line overflow-hidden shadow-2xl bg-ink-900">
      <svg
        viewBox="0 0 500 440"
        className="w-full h-full"
        style={{ background: 'transparent' }}
      >
        {/* ── Static edges ──────────────────────────────── */}
        {EDGES.map(e => {
          const p1 = posOf(e.source);
          const p2 = posOf(e.target);
          return (
            <line
              key={e.id}
              x1={p1.x} y1={p1.y}
              x2={p2.x} y2={p2.y}
              stroke="#ffffff"
              strokeOpacity={0.10}
              strokeWidth={1.5}
            />
          );
        })}

        {/* ── Particles travelling along edges ──────────── */}
        {particles.map(p => {
          const src = posOf(p.source);
          const tgt = posOf(p.target);
          const x = src.x + (tgt.x - src.x) * p.progress;
          const y = src.y + (tgt.y - src.y) * p.progress;

          // Tail
          const tailP = Math.max(0, p.progress - 0.18);
          const tx = src.x + (tgt.x - src.x) * tailP;
          const ty = src.y + (tgt.y - src.y) * tailP;

          const col = levelColor(p.level);
          return (
            <g key={p.id}>
              <line x1={tx} y1={ty} x2={x} y2={y}
                stroke={col} strokeWidth={2.5} strokeOpacity={0.7}
                strokeLinecap="round"
              />
              <circle cx={x} cy={y} r={5}
                fill="#0d1117" stroke={col} strokeWidth={2}
              />
            </g>
          );
        })}

        {/* ── Nodes ─────────────────────────────────────── */}
        {NODES.map(n => {
          const ns = nodeStates[n.id];
          const status  = ns?.status  ?? 'idle';
          const level   = ns?.level   ?? 0;
          const color   = status === 'idle' ? '#2a2e38' : levelColor(level);
          const isActor = status === 'actor';
          const r       = isActor ? 22 : status === 'notified' ? 18 : 15;

          return (
            <g key={n.id} transform={`translate(${n.x},${n.y})`}>
              {/* Glow halo for actor */}
              {isActor && (
                <circle r={r + 8} fill="none" stroke={color} strokeWidth={1.5} strokeOpacity={0.35}
                  style={{ animation: 'pulse 2s ease-in-out infinite' }}
                />
              )}
              {/* Glow halo for notified nodes */}
              {status === 'notified' && (
                <circle r={r + 6} fill="none" stroke={color} strokeWidth={1} strokeOpacity={0.25} />
              )}

              {/* Main circle */}
              <circle
                r={r}
                fill={status === 'idle' ? '#1a1e28' : status === 'notified' ? `${color}22` : '#1a1e28'}
                stroke={status === 'idle' ? '#2a3040' : color}
                strokeWidth={status === 'actor' ? 3 : 2}
                style={{ transition: 'all 0.4s ease' }}
              />

              {/* Label */}
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={isActor ? 10 : 9}
                fontWeight="600"
                fontFamily="monospace"
                fill={isActor ? color : status === 'idle' ? '#4a5568' : color}
                style={{ userSelect: 'none', pointerEvents: 'none' }}
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend overlay */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          background: 'rgba(13,17,23,0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 10,
          padding: '8px 12px',
          pointerEvents: 'none',
        }}
      >
        {[
          { label: 'Actor',    color: '#FFB020' },
          { label: 'Level 1',  color: '#35E0C8' },
          { label: 'Level 2',  color: '#8B7BFF' },
          { label: 'Level 3+', color: '#FF6B9B' },
        ].map(({ label, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block' }} />
            <span style={{ fontSize: 10, color: '#a0aec0', fontFamily: 'monospace' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
