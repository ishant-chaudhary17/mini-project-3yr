export type UserRole = 
  | 'Influencer' 
  | 'Network Manager' 
  | 'Cluster Admin' 
  | 'Tech Lead' 
  | 'DevOps Eng' 
  | 'Designer' 
  | 'Student' 
  | 'Researcher' 
  | 'Member';

export type User = {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  avatarColor?: string;
  role?: UserRole;
  bio?: string;
  department?: string;
  followersCount: number;
  followingCount: number;
  isVerified?: boolean;
};

export type EdgeType = 'follow' | 'connection';

export type Edge = {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
};

export type ActionType = 'post' | 'like' | 'follow';

export type PostPreset = {
  id: string;
  title: string;
  text: string;
  category: 'announcement' | 'tech' | 'milestone' | 'general';
  tags: string[];
};

export type NotificationEvent = {
  id: string;
  timestamp: number;
  source: string;
  target: string;
  action: ActionType;
  message?: string;
  level: number;
  status: 'pending' | 'sent' | 'failed';
};

export type ReactionType = 'like' | 'repost' | 'comment';

export type NodeReaction = {
  id: string;
  userId: string;
  type: ReactionType;
  emoji: string;
  comment?: string;
  timestamp: number;
};

export type NodeStatus = 'idle' | 'actor' | 'processing' | 'notified' | 'reacting' | 'resharing';

export type NodeState = {
  status: NodeStatus;
  notificationCount: number;
  level?: number;
  notifiedAt?: number;
  reaction?: NodeReaction;
  isOnline?: boolean;
};

export type Position = {
  x: number;
  y: number;
};

export type PropagationStrategy = 'direct' | 'bfs' | 'depth';

export type SimulationSpeed = 'slow' | 'normal' | 'fast';

export type SimulationStatus = 'ready' | 'simulating' | 'paused' | 'completed';

export type SimulationMode = 'continuous' | 'step';

export type SimulationState = {
  status: SimulationStatus;
  actorId: string | null;
  action: ActionType | null;
  customMessage?: string;
  strategy: PropagationStrategy;
  maxDepth: number;
  speed: SimulationSpeed;
  mode: SimulationMode;
  currentStepLevel: number;
  nodeStates: Record<string, NodeState>;
  notifications: NotificationEvent[];
  stats: {
    notificationsSent: number;
    activeRecipients: number;
    currentLevel: number;
    durationMs: number;
    inTransitCount: number;
    writeAmplification: number;
  };
};

export type EdgeTraversal = {
  id: string;
  edgeId: string;
  source: string;
  target: string;
  progress: number; // 0 to 1
  level: number;
  action: ActionType;
  message?: string;
};
