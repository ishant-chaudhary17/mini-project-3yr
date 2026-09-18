import { useEffect, useRef, useState, useMemo } from 'react';
import { Edge, EdgeTraversal, NodeState, Position, User } from '../types/graph';
import { useGraphTransform } from '../hooks/useGraphTransform';
import { computeLayout } from '../utils/layout';
import { cn } from './ui/Button';
import { ZoomIn, ZoomOut, Maximize, RotateCcw } from 'lucide-react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface GraphVisualizerProps {
  users: User[];
  edges: Edge[];
  nodeStates: Record<string, NodeState>;
  activeTraversals: EdgeTraversal[];
  selectedUserId: string | null;
  onSelectUser: (id: string | null) => void;
}

export function GraphVisualizer({ 
  users, 
  edges, 
  nodeStates, 
  activeTraversals, 
  selectedUserId, 
  onSelectUser 
}: GraphVisualizerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { transform, handlers, zoomIn, zoomOut, fit, reset } = useGraphTransform(svgRef);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Compute layout once
  const positions = useMemo(() => computeLayout(users, edges, 1200, 800), [users, edges]);

  // Compute which nodes are neighbors of the selected node
  const selectedNeighbors = useMemo(() => {
    if (!selectedUserId) return new Set<string>();
    const neighbors = new Set<string>();
    edges.forEach(e => {
      if (e.source === selectedUserId) neighbors.add(e.target);
      if (e.target === selectedUserId) neighbors.add(e.source);
    });
    return neighbors;
  }, [selectedUserId, edges]);

  const getNodeColorClass = (status?: string, level?: number) => {
    if (status === 'actor') return 'fill-actor stroke-actor text-ink-900';
    if (status === 'processing') return 'fill-ink-800 text-text-hi';
    if (status === 'notified') {
       if (level === 1) return 'fill-signal/18 stroke-signal text-text-hi';
       if (level === 2) return 'fill-depth-2/18 stroke-depth-2 text-text-hi';
       if (level && level >= 3) return 'fill-depth-3/18 stroke-depth-3 text-text-hi';
       return 'fill-signal/18 stroke-signal text-text-hi';
    }
    return 'fill-idle stroke-line text-ink-900'; // idle
  };

  const getStrokeClass = (status?: string, level?: number) => {
    if (status === 'actor') return 'stroke-actor';
    if (status === 'processing') {
       if (level === 1) return 'stroke-signal';
       if (level === 2) return 'stroke-depth-2';
       if (level && level >= 3) return 'stroke-depth-3';
       return 'stroke-signal';
    }
    if (status === 'notified') {
       if (level === 1) return 'stroke-signal';
       if (level === 2) return 'stroke-depth-2';
       if (level && level >= 3) return 'stroke-depth-3';
       return 'stroke-signal';
    }
    return 'stroke-line';
  };

  const getEdgeColorClass = (level: number) => {
    if (level === 1) return 'stroke-signal';
    if (level === 2) return 'stroke-depth-2';
    if (level >= 3) return 'stroke-depth-3';
    return 'stroke-signal';
  };

  return (
    <div className="relative flex-1 bg-ink-900 overflow-hidden graph-bg">
      <svg
        ref={svgRef}
        className="w-full h-full graph-bg cursor-grab active:cursor-grabbing"
        {...handlers}
        onClick={(e) => {
          if ((e.target as SVGElement).classList.contains('graph-bg')) {
            onSelectUser(null);
          }
        }}
      >
        <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.k})`}>
          {/* Edges */}
          {edges.map(e => {
            const p1 = positions[e.source];
            const p2 = positions[e.target];
            if (!p1 || !p2) return null;
            
            // Dim edges if there's a selection and they don't involve the selected node
            const isDimmed = selectedUserId && e.source !== selectedUserId && e.target !== selectedUserId;
            
            return (
              <line
                key={e.id}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                className={cn(
                  "stroke-[1px] transition-opacity duration-200 pointer-events-none",
                  isDimmed ? "stroke-line opacity-20" : "stroke-line opacity-55"
                )}
              />
            );
          })}

          {/* Active Traversals (Particles) */}
          {!prefersReducedMotion && activeTraversals.map(t => {
            const p1 = positions[t.source];
            const p2 = positions[t.target];
            if (!p1 || !p2) return null;

            const x = p1.x + (p2.x - p1.x) * t.progress;
            const y = p1.y + (p2.y - p1.y) * t.progress;
            
            // Optional: Draw a small tail
            const tailLength = 15;
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const len = Math.sqrt(dx*dx + dy*dy);
            const tailK = tailLength / len;
            const tailP = Math.max(0, t.progress - tailK);
            const tailX = p1.x + dx * tailP;
            const tailY = p1.y + dy * tailP;

            return (
              <g key={t.id}>
                <line
                  x1={tailX} y1={tailY}
                  x2={x} y2={y}
                  className={cn("stroke-[3px] stroke-linecap-round opacity-80", getEdgeColorClass(t.level))}
                  strokeDasharray="4 2"
                />
                <circle
                  cx={x}
                  cy={y}
                  r={4}
                  className={cn("fill-ink-900 stroke-[2px]", getEdgeColorClass(t.level))}
                />
              </g>
            );
          })}

          {/* Nodes */}
          {users.map(u => {
            const p = positions[u.id];
            if (!p) return null;
            
            const ns = nodeStates[u.id];
            const isSelected = selectedUserId === u.id;
            const isDimmed = selectedUserId && !isSelected && !selectedNeighbors.has(u.id);
            const isHovered = hoveredNode === u.id;
            
            const r = ns?.status === 'actor' ? 26 : ns?.status === 'notified' ? 22 : 18;

            return (
              <g
                key={u.id}
                transform={`translate(${p.x}, ${p.y})`}
                className={cn(
                  "cursor-pointer transition-opacity duration-200",
                  isDimmed && "opacity-25"
                )}
                onMouseEnter={() => setHoveredNode(u.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectUser(u.id);
                }}
              >
                {/* Selection Halo */}
                {isSelected && (
                  <circle r={r + 6} className="fill-transparent stroke-text-hi stroke-[2px]" strokeDasharray="4 4" />
                )}
                
                {/* Actor Breathing Halo */}
                {ns?.status === 'actor' && (
                  <circle r={r + 4} className="fill-transparent stroke-actor stroke-[2px] animate-pulse" />
                )}
                
                {/* Node Circle */}
                <circle
                  r={r}
                  className={cn(
                    "transition-all duration-300",
                    getNodeColorClass(ns?.status, ns?.level),
                    ns?.status === 'processing' 
                      ? 'stroke-[2px] stroke-dasharray-[4,4] animate-[spin_3s_linear_infinite]' 
                      : ns?.status === 'actor' ? 'stroke-[3px]' : 'stroke-[2px]'
                  )}
                  style={{ fillOpacity: ns?.status === 'notified' ? 0.18 : 1 }}
                />
                
                {/* Node Initials */}
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={cn(
                    "font-display text-[11px] font-semibold select-none pointer-events-none",
                    ns?.status === 'actor' ? 'fill-ink-900' : 'fill-text-hi'
                  )}
                >
                  {u.avatar}
                </text>

                {/* Name Label (hidden when zoomed out heavily) */}
                {transform.k > 0.6 && (
                  <text
                    y={r + 14}
                    textAnchor="middle"
                    className="font-sans text-[10px] fill-text-lo select-none pointer-events-none"
                  >
                    {u.name}
                  </text>
                )}

                {/* Notification Badge */}
                {ns?.status === 'notified' && ns.notificationCount > 0 && (
                  <g transform={`translate(${r - 2}, ${-r + 2})`}>
                    <circle r={8} className={cn("fill-ink-900", getStrokeClass('notified', ns.level))} strokeWidth={1} />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="font-mono text-[9px] font-bold fill-text-hi select-none pointer-events-none"
                    >
                      {ns.notificationCount}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2 rounded-lg bg-ink-800 p-1 border border-line shadow-sm">
        <button className="p-2 text-text-lo hover:text-text-hi hover:bg-ink-700 rounded-md transition-colors" onClick={zoomIn} title="Zoom In (+)"><ZoomIn size={18} /></button>
        <button className="p-2 text-text-lo hover:text-text-hi hover:bg-ink-700 rounded-md transition-colors" onClick={zoomOut} title="Zoom Out (-)"><ZoomOut size={18} /></button>
        <div className="h-px w-full bg-line" />
        <button className="p-2 text-text-lo hover:text-text-hi hover:bg-ink-700 rounded-md transition-colors" onClick={fit} title="Fit to Screen (F)"><Maximize size={18} /></button>
        <button className="p-2 text-text-lo hover:text-text-hi hover:bg-ink-700 rounded-md transition-colors" onClick={reset} title="Reset Transform (R)"><RotateCcw size={18} /></button>
      </div>

      {/* Legend inside graph area */}
      <div className="absolute top-4 right-4 flex flex-col gap-1.5 rounded-[12px] bg-ink-800/90 backdrop-blur-sm p-3 border border-line shadow-sm">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-text-lo mb-1">Legend</div>
        <div className="flex items-center gap-2 text-xs text-text-hi"><div className="w-3 h-3 rounded-full bg-actor border-2 border-actor"></div> Actor</div>
        <div className="flex items-center gap-2 text-xs text-text-hi"><div className="w-3 h-3 rounded-full border-2 border-signal border-dashed bg-transparent"></div> Processing</div>
        <div className="flex items-center gap-2 text-xs text-text-hi"><div className="w-3 h-3 rounded-full bg-signal/20 border-2 border-signal"></div> Level 1</div>
        <div className="flex items-center gap-2 text-xs text-text-hi"><div className="w-3 h-3 rounded-full bg-depth-2/20 border-2 border-depth-2"></div> Level 2</div>
        <div className="flex items-center gap-2 text-xs text-text-hi"><div className="w-3 h-3 rounded-full bg-depth-3/20 border-2 border-depth-3"></div> Level 3+</div>
        <div className="flex items-center gap-2 text-xs text-text-hi mt-1"><div className="w-3 h-3 rounded-full bg-transparent border-2 border-text-hi border-dashed"></div> Selected</div>
      </div>
    </div>
  );
}
