export type User = {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  followersCount: number;
  followingCount: number;
};

export type EdgeType = 'follow' | 'connection';

export type Edge = {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
};

export type ActionType = 'post' | 'like' | 'follow';

export type NotificationEvent = {
  id: string;
  timestamp: number;
  source: string;
  target: string;
  action: ActionType;
  level: number;
  status: 'pending' | 'sent' | 'failed';
};

export type NodeStatus = 'idle' | 'actor' | 'processing' | 'notified';

export type NodeState = {
  status: NodeStatus;
  notificationCount: number;
  level?: number;
};

export type Position = {
  x: number;
  y: number;
};

export type PropagationStrategy = 'direct' | 'bfs' | 'depth';

export type SimulationSpeed = 'slow' | 'normal' | 'fast';

export type SimulationStatus = 'ready' | 'simulating' | 'paused' | 'completed';

export type SimulationState = {
  status: SimulationStatus;
  actorId: string | null;
  action: ActionType | null;
  strategy: PropagationStrategy;
  maxDepth: number;
  speed: SimulationSpeed;
  nodeStates: Record<string, NodeState>;
  notifications: NotificationEvent[];
  stats: {
    notificationsSent: number;
    activeRecipients: number;
    currentLevel: number;
    durationMs: number;
  };
};

export type EdgeTraversal = {
  id: string;
  edgeId: string;
  source: string;
  target: string;
  progress: number; // 0 to 1
  level: number;
};
