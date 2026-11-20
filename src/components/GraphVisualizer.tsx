import { useEffect, useRef, useState, useMemo } from 'react';
import { Edge, EdgeTraversal, NodeState, Position, User } from '../types/graph';
import { useGraphTransform } from '../hooks/useGraphTransform';
import { computeLayout } from '../utils/layout';
import { cn } from './ui/Button';
import { ZoomIn, ZoomOut, Maximize, RotateCcw, Check, Sparkles, Crown } from 'lucide-react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface GraphVisualizerProps {
  users: User[];
  edges: Edge[];
  nodeStates: Record<string, NodeState>;
  activeTraversals: EdgeTraversal[];
  selectedUserId: string | null;
  onSelectUser: (id: string | null) => void;
  highlightedUserIds?: Set<string> | null;
  onFitRef?: React.MutableRefObject<{ fit: () => void } | null>;
}

export function GraphVisualizer({ 
  users, 
  edges, 
  nodeStates, 
  activeTraversals, 
  selectedUserId, 
  onSelectUser,
  highlightedUserIds = null,
  onFitRef,
}: GraphVisualizerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { transform, handlers, zoomIn, zoomOut, fit, reset } = useGraphTransform(svgRef);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [ripplePhase, setRipplePhase] = useState(0);

  // Animate gentle ripple wave when simulation is running
  useEffect(() => {
    let animId: number;
    let start = performance.now();
    const animate = (time: number) => {
      setRipplePhase(((time - start) / 1000) % 2);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Expose fit() to parent via ref
  useEffect(() => {
    if (onFitRef) onFitRef.current = { fit };
  }, [onFitRef, fit]);

  // Compute deterministic layout
  const positions = useMemo(() => computeLayout(users, edges, 1200, 800), [users, edges]);

  // Find actor node
  const actorId = useMemo(() => {
    const entry = Object.entries(nodeStates).find(([_, s]) => s.status === 'actor');
    return entry ? entry[0] : null;
  }, [nodeStates]);

  const actorPos = actorId ? positions[actorId] : null;

  // Compute neighbors of selected user
  const selectedNeighbors = useMemo(() => {
    if (!selectedUserId) return new Set<string>();
    const neighbors = new Set<string>();
    edges.forEach(e => {
      if (e.source === selectedUserId) neighbors.add(e.target);
      if (e.target === selectedUserId) neighbors.add(e.source);
    });
    return neighbors;
  }, [selectedUserId, edges]);

  const hoveredUser = hoveredNodeId ? users.find(u => u.id === hoveredNodeId) : null;
  const hoveredNodeState = hoveredNodeId ? nodeStates[hoveredNodeId] : null;

  const getNodeFill = (status?: string, level?: number) => {
    if (status === 'actor') return '#FFB020';
    if (status === 'processing') return '#1A2230';
    if (status === 'notified') {
      if (level === 1) return '#0D9488';
      if (level === 2) return '#6366F1';
      if (level && level >= 3) return '#EC4899';
      return '#0D9488';
    }
    return '#24303F'; // idle
  };

  const getEdgeStroke = (level: number) => {
    if (level === 1) return '#35E0C8';
    if (level === 2) return '#818CF8';
    if (level >= 3) return '#F472B6';
    return '#35E0C8';
  };

  return (
    <div className="relative flex-1 bg-ink-900 overflow-hidden graph-bg">
      <svg
        ref={svgRef}
        className="w-full h-full graph-bg cursor-grab active:cursor-grabbing select-none"
        {...handlers}
        onClick={(e) => {
          if ((e.target as SVGElement).classList.contains('graph-bg')) {
            onSelectUser(null);
          }
        }}
      >
        <defs>
          {/* Radial Glow Filters */}
          <filter id="glow-actor" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <filter id="glow-packet" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradients for Nodes */}
          <linearGradient id="grad-actor" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          <linearGradient id="grad-l1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#14B8A6" />
            <stop offset="100%" stopColor="#0D9488" />
          </linearGradient>

          <linearGradient id="grad-l2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>

          <linearGradient id="grad-l3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#DB2777" />
          </linearGradient>
        </defs>

        <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.k})`}>
          {/* Concentric propagation ripple wave radiating from Actor */}
          {actorPos && (
            <g pointerEvents="none">
              <circle
                cx={actorPos.x}
                cy={actorPos.y}
                r={40 + ripplePhase * 60}
                fill="none"
                stroke="#FFB020"
                strokeWidth={2}
                opacity={Math.max(0, 0.4 - ripplePhase * 0.2)}
                strokeDasharray="6 4"
              />
              <circle
                cx={actorPos.x}
                cy={actorPos.y}
                r={20 + ripplePhase * 40}
                fill="none"
                stroke="#35E0C8"
                strokeWidth={1.5}
                opacity={Math.max(0, 0.5 - ripplePhase * 0.25)}
              />
            </g>
          )}

          {/* Background Graph Edges */}
          {edges.map(e => {
            const p1 = positions[e.source];
            const p2 = positions[e.target];
            if (!p1 || !p2) return null;
            
            const involvedInSearch = !highlightedUserIds ||
              highlightedUserIds.has(e.source) || highlightedUserIds.has(e.target);
            const isConnectedToSelected = selectedUserId && 
              (e.source === selectedUserId || e.target === selectedUserId);
            const isDimmed = (selectedUserId && !isConnectedToSelected) || (!involvedInSearch);
            
            return (
              <line
                key={e.id}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={isConnectedToSelected ? '#35E0C8' : '#24303F'}
                strokeWidth={isConnectedToSelected ? 2 : 1}
                className={cn(
                  "transition-all duration-200 pointer-events-none",
                  isDimmed ? "opacity-15" : isConnectedToSelected ? "opacity-90" : "opacity-45"
                )}
              />
            );
          })}

          {/* Active Glowing Traversals (Particles with Action Icons) */}
          {!prefersReducedMotion && activeTraversals.map(t => {
            const p1 = positions[t.source];
            const p2 = positions[t.target];
            if (!p1 || !p2) return null;

            const x = p1.x + (p2.x - p1.x) * t.progress;
            const y = p1.y + (p2.y - p1.y) * t.progress;
            const strokeColor = getEdgeStroke(t.level);

            return (
              <g key={t.id} pointerEvents="none">
                {/* Glowing Trail Line */}
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={x}
                  y2={y}
                  stroke={strokeColor}
                  strokeWidth={2.5}
                  strokeDasharray="4 2"
                  opacity={0.8}
                />
                
                {/* Outer Glow Halo */}
                <circle
                  cx={x}
                  cy={y}
                  r={8}
                  fill={strokeColor}
                  opacity={0.3}
                  filter="url(#glow-packet)"
                />

                {/* Packet Head Circle */}
                <circle
                  cx={x}
                  cy={y}
                  r={5}
                  fill="#0A0E14"
                  stroke={strokeColor}
                  strokeWidth={2}
                />
                
                {/* Tiny icon packet indicator */}
                <circle
                  cx={x}
                  cy={y}
                  r={2}
                  fill={strokeColor}
                />
              </g>
            );
          })}

          {/* Graph Nodes */}
          {users.map(u => {
            const p = positions[u.id];
            if (!p) return null;
            
            const ns = nodeStates[u.id];
            const isSelected = selectedUserId === u.id;
            const isActor = ns?.status === 'actor';
            const isNotified = ns?.status === 'notified';
            const isProcessing = ns?.status === 'processing';
            const isHovered = hoveredNodeId === u.id;
            const isInfluencer = u.isVerified || u.followersCount >= 9;
            const isNetworkManager = u.role === 'Network Manager';

            const dimmedBySelection = !!(selectedUserId && !isSelected && !selectedNeighbors.has(u.id));
            const dimmedBySearch = !!(highlightedUserIds && !highlightedUserIds.has(u.id));
            const isDimmed = dimmedBySelection || dimmedBySearch;
            
            const r = isActor ? 26 : isNotified ? 22 : isInfluencer ? 21 : 18;

            return (
              <g
                key={u.id}
                transform={`translate(${p.x}, ${p.y})`}
                className={cn(
                  "cursor-pointer transition-all duration-200",
                  isDimmed && "opacity-20",
                  !isDimmed && "opacity-100"
                )}
                onMouseEnter={() => setHoveredNodeId(u.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectUser(u.id);
                }}
              >
                {/* Selected Node Ring */}
                {isSelected && (
                  <circle
                    r={r + 7}
                    fill="none"
                    stroke="#E6EDF5"
                    strokeWidth={2.5}
                    strokeDasharray="5 3"
                    className="animate-[spin_8s_linear_infinite]"
                  />
                )}
                
                {/* Actor Beacon Halo */}
                {isActor && (
                  <circle
                    r={r + 8}
                    fill="none"
                    stroke="#FFB020"
                    strokeWidth={2}
                    filter="url(#glow-actor)"
                    className="animate-pulse"
                  />
                )}

                {/* Notified Glow Ripple */}
                {isNotified && (
                  <circle
                    r={r + 4}
                    fill="none"
                    stroke={getNodeFill('notified', ns.level)}
                    strokeWidth={1.5}
                    opacity={0.6}
                  />
                )}

                {/* Processing Ring */}
                {isProcessing && (
                  <circle
                    r={r + 5}
                    fill="none"
                    stroke="#35E0C8"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    className="animate-[spin_2s_linear_infinite]"
                  />
                )}
                
                {/* Base Node Circle */}
                <circle
                  r={r}
                  fill={
                    isActor ? 'url(#grad-actor)' :
                    isNotified && ns.level === 1 ? 'url(#grad-l1)' :
                    isNotified && ns.level === 2 ? 'url(#grad-l2)' :
                    isNotified && ns.level && ns.level >= 3 ? 'url(#grad-l3)' :
                    isInfluencer ? '#1F2937' : '#111721'
                  }
                  stroke={
                    isActor ? '#F59E0B' :
                    isNotified ? getNodeFill('notified', ns.level) :
                    isInfluencer ? '#F59E0B' : '#374151'
                  }
                  strokeWidth={isActor ? 3 : isInfluencer ? 2 : 1.5}
                  className="transition-all duration-300 shadow-lg"
                />

                {/* Crown / Star for Influencers */}
                {isInfluencer && !isActor && (
                  <g transform={`translate(0, ${-r - 5})`}>
                    <circle r={6} fill="#F59E0B" />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="text-[8px] select-none pointer-events-none fill-ink-900 font-bold"
                    >
                      ★
                    </text>
                  </g>
                )}

                {/* Network Manager / Relay Badge */}
                {isNetworkManager && !isActor && (
                  <g transform={`translate(${r - 2}, ${-r - 4})`}>
                    <circle r={6.5} fill="#0D9488" stroke="#35E0C8" strokeWidth={1} />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="text-[7px] select-none pointer-events-none fill-white font-bold"
                    >
                      📡
                    </text>
                  </g>
                )}

                {/* Follower Active Reaction Bubble (❤️ Like, 🔁 Reshare, 💬 Comment) */}
                {ns?.reaction && (
                  <g transform={`translate(0, ${-r - 14})`} className="animate-bounce">
                    <rect
                      x={-28}
                      y={-10}
                      width={56}
                      height={20}
                      rx={10}
                      fill="#0A0E14"
                      stroke={ns.reaction.type === 'like' ? '#EF4444' : ns.reaction.type === 'repost' ? '#10B981' : '#3B82F6'}
                      strokeWidth={1.5}
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="text-[10px] select-none pointer-events-none font-bold fill-white"
                    >
                      {ns.reaction.emoji} {ns.reaction.type === 'like' ? 'Liked' : ns.reaction.type === 'repost' ? 'Shared' : 'Reply'}
                    </text>
                  </g>
                )}

                {/* Resharing Pulse Wave */}
                {ns?.status === 'resharing' && (
                  <circle
                    r={r + 8}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth={2}
                    strokeDasharray="4 2"
                    className="animate-ping"
                  />
                )}

                {/* Online Active Indicator Dot */}
                {ns?.isOnline && (
                  <circle
                    cx={r - 3}
                    cy={r - 3}
                    r={3.5}
                    fill="#10B981"
                    stroke="#0A0E14"
                    strokeWidth={1}
                  />
                )}
                
                {/* Node Initials or Icon */}
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={cn(
                    "font-display text-[11px] font-bold select-none pointer-events-none tracking-wider",
                    isActor ? 'fill-ink-900 font-black' : isNotified ? 'fill-white' : 'fill-text-hi'
                  )}
                >
                  {u.avatar || u.name.substring(0, 2).toUpperCase()}
                </text>

                {/* User Name & Handle Label */}
                {(transform.k > 0.8 || isSelected || isHovered) && (
                  <g transform={`translate(0, ${r + 14})`}>
                    <rect
                      x={-45}
                      y={-9}
                      width={90}
                      height={18}
                      rx={9}
                      fill="#0A0E14"
                      fillOpacity={0.85}
                      stroke="#24303F"
                      strokeWidth={1}
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="font-sans text-[9px] font-semibold fill-text-hi select-none pointer-events-none"
                    >
                      {u.name.split(' ')[0]}
                    </text>
                  </g>
                )}

                {/* Notification Delivery Badge */}
                {isNotified && ns.notificationCount > 0 && (
                  <g transform={`translate(${r - 2}, ${-r + 2})`}>
                    <circle r={8} fill="#0A0E14" stroke="#35E0C8" strokeWidth={1.5} />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="font-mono text-[9px] font-bold fill-signal select-none pointer-events-none"
                    >
                      {ns.notificationCount}
                    </text>
                  </g>
                )}

                {/* Level Tag Pill */}
                {isNotified && ns.level !== undefined && (
                  <g transform={`translate(${-r + 2}, ${-r + 2})`}>
                    <circle r={7} fill={getNodeFill('notified', ns.level)} />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="font-mono text-[8px] font-black fill-ink-900 select-none pointer-events-none"
                    >
                      L{ns.level}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Floating Hover Card */}
      {hoveredUser && (
        <div className="absolute top-4 left-4 pointer-events-none z-30 rounded-2xl border border-line bg-ink-800/95 backdrop-blur-md p-3.5 shadow-2xl w-64 animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-signal/20 font-bold text-signal border border-signal/30 text-sm">
              {hoveredUser.avatar}
            </div>
            <div className="truncate">
              <div className="flex items-center gap-1.5 font-bold text-text-hi text-xs truncate">
                {hoveredUser.name}
                {hoveredUser.isVerified && (
                  <span className="text-actor" title="Verified Account">★</span>
                )}
              </div>
              <div className="text-[10px] text-text-lo font-mono">{hoveredUser.username}</div>
              <div className="text-[10px] text-signal font-semibold">{hoveredUser.role}</div>
            </div>
          </div>

          <div className="mt-2 text-[11px] text-text-lo line-clamp-2 italic">
            "{hoveredUser.bio}"
          </div>

          <div className="mt-2.5 pt-2 border-t border-line/60 flex items-center justify-between text-[10px]">
            <span className="text-text-lo font-mono">
              👥 {hoveredUser.followersCount} followers
            </span>
            <span className={`px-2 py-0.5 rounded-full font-bold uppercase ${
              hoveredNodeState?.status === 'actor' ? 'bg-actor text-ink-900' :
              hoveredNodeState?.status === 'notified' ? 'bg-signal/20 text-signal' :
              hoveredNodeState?.status === 'processing' ? 'bg-signal text-ink-900 animate-pulse' :
              'bg-ink-700 text-text-lo'
            }`}>
              {hoveredNodeState?.status 
                ? `${hoveredNodeState.status} ${hoveredNodeState.level ? `(L${hoveredNodeState.level})` : ''}` 
                : 'Idle'}
            </span>
          </div>
        </div>
      )}

      {/* Controls (Zoom & Reset) */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2 rounded-xl bg-ink-800/90 backdrop-blur-sm p-1.5 border border-line shadow-lg z-20">
        <button className="p-2 text-text-lo hover:text-text-hi hover:bg-ink-700 rounded-lg transition-colors" onClick={zoomIn} title="Zoom In (+)">
          <ZoomIn size={18} />
        </button>
        <button className="p-2 text-text-lo hover:text-text-hi hover:bg-ink-700 rounded-lg transition-colors" onClick={zoomOut} title="Zoom Out (-)">
          <ZoomOut size={18} />
        </button>
        <div className="h-px w-full bg-line" />
        <button className="p-2 text-text-lo hover:text-text-hi hover:bg-ink-700 rounded-lg transition-colors" onClick={fit} title="Fit to Screen (F)">
          <Maximize size={18} />
        </button>
        <button className="p-2 text-text-lo hover:text-text-hi hover:bg-ink-700 rounded-lg transition-colors" onClick={reset} title="Reset Transform (R)">
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Modern Legend */}
      <div className="absolute top-4 right-4 flex flex-col gap-1.5 rounded-2xl bg-ink-800/90 backdrop-blur-md p-3.5 border border-line shadow-xl z-20">
        <div className="text-[10px] font-bold uppercase tracking-wider text-text-lo mb-1 flex items-center justify-between gap-4">
          <span>BFS Wave Legend</span>
          <Sparkles size={12} className="text-signal" />
        </div>
        <div className="flex items-center gap-2 text-xs text-text-hi">
          <div className="w-3.5 h-3.5 rounded-full bg-actor border-2 border-actor shadow-sm" /> 
          <span className="font-semibold text-actor">Actor (Source)</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-hi">
          <div className="w-3.5 h-3.5 rounded-full border-2 border-signal border-dashed animate-[spin_3s_linear_infinite]" /> 
          <span>In Transit / Queue</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-hi">
          <div className="w-3.5 h-3.5 rounded-full bg-teal-500 border border-teal-400" /> 
          <span>Level 1 (Direct Follower)</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-hi">
          <div className="w-3.5 h-3.5 rounded-full bg-indigo-500 border border-indigo-400" /> 
          <span>Level 2 (2nd Degree)</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-hi">
          <div className="w-3.5 h-3.5 rounded-full bg-pink-500 border border-pink-400" /> 
          <span>Level 3+ (Viral Wave)</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-hi pt-1 border-t border-line/60">
          <div className="w-3.5 h-3.5 rounded-full border-2 border-actor flex items-center justify-center text-[7px] text-actor">
            ★
          </div> 
          <span>Influencer Node</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-hi">
          <div className="w-3.5 h-3.5 rounded-full bg-teal-600 border border-teal-300 flex items-center justify-center text-[8px] text-white">
            📡
          </div> 
          <span className="font-semibold text-teal-300">Network Manager (Relay)</span>
        </div>
      </div>
    </div>
  );
}
