import { useEffect, useState } from 'react';
import { User, Edge, NodeState, EdgeTraversal } from '../../types/graph';
import { GraphVisualizer } from '../GraphVisualizer';
import { useSimulation } from '../../hooks/useSimulation';

// Subset of 14 users
const heroUsers: User[] = Array.from({ length: 14 }).map((_, i) => ({
  id: `h${i}`,
  name: `User ${i}`,
  username: `@user${i}`,
  avatar: `U${i}`,
  followersCount: 0,
  followingCount: 0
}));

// Hand-crafted subset of edges for a nice fan-out from h0
const heroEdges: Edge[] = [
  { id: 'he0', source: 'h0', target: 'h1', type: 'connection' },
  { id: 'he1', source: 'h0', target: 'h2', type: 'connection' },
  { id: 'he2', source: 'h0', target: 'h3', type: 'connection' },
  { id: 'he3', source: 'h1', target: 'h4', type: 'connection' },
  { id: 'he4', source: 'h1', target: 'h5', type: 'connection' },
  { id: 'he5', source: 'h2', target: 'h6', type: 'connection' },
  { id: 'he6', source: 'h3', target: 'h7', type: 'connection' },
  { id: 'he7', source: 'h3', target: 'h8', type: 'connection' },
  { id: 'he8', source: 'h4', target: 'h9', type: 'connection' },
  { id: 'he9', source: 'h5', target: 'h10', type: 'connection' },
  { id: 'he10', source: 'h6', target: 'h11', type: 'connection' },
  { id: 'he11', source: 'h7', target: 'h12', type: 'connection' },
  { id: 'he12', source: 'h8', target: 'h13', type: 'connection' },
  { id: 'he13', source: 'h2', target: 'h5', type: 'connection' }, // cross connection
];

export function HeroGraph() {
  const { state, activeTraversals, setConfig, trigger, reset } = useSimulation();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    // Setup initial config
    setConfig({
      actorId: 'h0',
      action: 'post',
      strategy: 'bfs',
      speed: 'normal'
    });
    
    // Slight delay before first trigger
    const t = setTimeout(() => trigger(), 1000);
    return () => clearTimeout(t);
  }, []);

  // Autoplay loop
  useEffect(() => {
    if (state.status === 'completed') {
      const t = setTimeout(() => {
        reset();
        setTimeout(() => trigger(), 500);
      }, 2000); // 2 second pause before restart
      return () => clearTimeout(t);
    }
  }, [state.status, reset, trigger]);

  // If user clicks a node, restart from there
  const handleSelect = (id: string | null) => {
    if (id) {
      reset();
      setConfig({ actorId: id });
      setTimeout(() => trigger(), 100);
    }
  };

  return (
    <div className="w-full h-[500px] lg:h-[600px] rounded-2xl border border-line overflow-hidden shadow-2xl">
      <GraphVisualizer
        users={heroUsers}
        edges={heroEdges}
        nodeStates={state.nodeStates}
        activeTraversals={activeTraversals}
        selectedUserId={selectedNode}
        onSelectUser={handleSelect}
      />
    </div>
  );
}
