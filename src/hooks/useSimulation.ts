import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ActionType, 
  EdgeTraversal, 
  NodeReaction,
  NotificationEvent, 
  PropagationStrategy, 
  ReactionType,
  SimulationMode, 
  SimulationSpeed, 
  SimulationState, 
  SimulationStatus 
} from '../types/graph';
import { edges as graphEdges, postPresets, users as graphUsers } from '../data/socialGraph';
import { calculateMaxDepth, getNeighbors, getSpeedMs } from '../utils/simulationEngine';
import { sound } from '../utils/sound';

const generateId = () => Math.random().toString(36).substring(2, 9);

const SAMPLE_COMMENTS = [
  'Impressive fan-out speed! 🔥',
  'Great distributed architecture design ⚡',
  'BFS traversal latency is under 15ms!',
  'Shared with the CS project group 📚',
  'Proud of our 3rd year project team! 👏',
  'At scale, hybrid push-pull is essential 💡',
  'Graph algorithms in action 🚀',
  'Kafka message queue decoupled this nicely 🛠️'
];

type QueueItem = {
  source: string;
  target: string;
  level: number;
  edgeId: string;
  isReshare?: boolean;
};

const initialState: SimulationState = {
  status: 'ready',
  actorId: 'u02', // John Carter
  action: 'post',
  customMessage: postPresets[0].text,
  strategy: 'bfs',
  maxDepth: 3,
  speed: 'normal',
  mode: 'continuous',
  currentStepLevel: 0,
  nodeStates: {},
  notifications: [],
  stats: {
    notificationsSent: 0,
    activeRecipients: 0,
    currentLevel: 0,
    durationMs: 0,
    inTransitCount: 0,
    writeAmplification: 0,
  }
};

export function useSimulation() {
  const [state, setState] = useState<SimulationState>(initialState);
  const [activeTraversals, setActiveTraversals] = useState<EdgeTraversal[]>([]);
  
  const queueRef = useRef<QueueItem[]>([]);
  const visitedRef = useRef<Set<string>>(new Set());
  const simulationStartTimeRef = useRef<number>(0);
  const totalPausedTimeRef = useRef<number>(0);
  const lastPauseTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastTickRef = useRef<number>(0);
  const stateRef = useRef<SimulationState>(state);
  const reactionTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);
  
  // Update duration timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (state.status === 'simulating') {
      interval = setInterval(() => {
        const now = Date.now();
        const start = simulationStartTimeRef.current;
        const paused = totalPausedTimeRef.current;
        setState(s => ({
          ...s,
          stats: {
            ...s.stats,
            durationMs: now - start - paused
          }
        }));
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.status]);

  const clearReactionTimers = () => {
    reactionTimersRef.current.forEach(t => clearTimeout(t));
    reactionTimersRef.current = [];
  };

  const reset = useCallback(() => {
    clearReactionTimers();
    setState({
      ...initialState,
      strategy: state.strategy,
      speed: state.speed,
      maxDepth: state.maxDepth,
      actorId: state.actorId,
      action: state.action,
      mode: state.mode,
      customMessage: state.customMessage || postPresets[0].text,
    });
    setActiveTraversals([]);
    queueRef.current = [];
    visitedRef.current = new Set();
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
  }, [state.strategy, state.speed, state.maxDepth, state.actorId, state.action, state.mode, state.customMessage]);

  // Method to trigger a reaction from ANY user node (e.g. Sarah Wilson reshares or likes)
  const triggerUserReaction = useCallback((
    userId: string, 
    type: ReactionType, 
    customText?: string
  ) => {
    const user = graphUsers.find(u => u.id === userId);
    if (!user) return;

    sound.playReactionSound();

    const emoji = type === 'like' ? '❤️' : type === 'repost' ? '🔁' : '💬';
    const comment = customText || (
      type === 'like' ? 'Liked post' :
      type === 'repost' ? 'Resharred to followers' :
      SAMPLE_COMMENTS[Math.floor(Math.random() * SAMPLE_COMMENTS.length)]
    );

    const reaction: NodeReaction = {
      id: generateId(),
      userId,
      type,
      emoji,
      comment,
      timestamp: Date.now(),
    };

    // Update node state with active reaction
    setState(s => {
      const newNodeStates = { ...s.nodeStates };
      const current = newNodeStates[userId] || { status: 'idle', notificationCount: 0 };
      newNodeStates[userId] = {
        ...current,
        status: type === 'repost' ? 'resharing' : 'reacting',
        reaction,
      };

      const actionType: ActionType = type === 'like' ? 'like' : 'post';
      const newNotifs: NotificationEvent[] = [
        {
          id: generateId(),
          timestamp: Date.now(),
          source: userId,
          target: s.actorId || userId,
          action: actionType,
          message: `${user.name} ${type === 'like' ? 'liked the post ❤️' : type === 'repost' ? 'resharred to their followers 🔁' : `commented: "${comment}" 💬`}`,
          level: 1,
          status: 'sent',
        },
        ...s.notifications
      ];

      return {
        ...s,
        nodeStates: newNodeStates,
        notifications: newNotifs,
        stats: {
          ...s.stats,
          notificationsSent: s.stats.notificationsSent + 1,
        }
      };
    });

    // If it is a reshare/repost, enqueue outgoing signals from this follower to their connections!
    if (type === 'repost') {
      const neighbors = getNeighbors(userId, graphEdges);
      neighbors.forEach(n => {
        if (!visitedRef.current.has(n)) {
          visitedRef.current.add(n);
          const edge = graphEdges.find(e => 
            (e.source === userId && e.target === n) || 
            (e.target === userId && e.source === n)
          );
          if (edge) {
            queueRef.current.push({
              source: userId,
              target: n,
              level: (stateRef.current.nodeStates[userId]?.level || 1) + 1,
              edgeId: edge.id,
              isReshare: true
            });
          }
        }
      });

      // Resume animation loop if not running
      if (stateRef.current.status !== 'simulating') {
        setState(s => ({ ...s, status: 'simulating' }));
        lastTickRef.current = performance.now();
        startAnimationLoop();
      }
    }
  }, []);

  const trigger = useCallback(() => {
    if (!state.actorId || !state.action) return;
    
    clearReactionTimers();
    sound.playTriggerSound();
    const actorUser = graphUsers.find(u => u.id === state.actorId);
    const actionMsg = state.customMessage || 
      (state.action === 'post' ? postPresets[0].text : 
       state.action === 'like' ? `Liked ${actorUser?.name}'s post on architecture` : 
       `Started following ${actorUser?.name}`);

    // Initialize actor event
    const actorNotification: NotificationEvent = {
      id: generateId(),
      timestamp: Date.now(),
      source: state.actorId,
      target: state.actorId,
      action: state.action,
      message: actionMsg,
      level: 0,
      status: 'sent',
    };

    setState(s => ({
      ...s,
      status: 'simulating',
      currentStepLevel: 0,
      nodeStates: { 
        [s.actorId!]: { status: 'actor', notificationCount: 0, level: 0, notifiedAt: Date.now() } 
      },
      notifications: [actorNotification],
      stats: {
        notificationsSent: 0,
        activeRecipients: 0,
        currentLevel: 0,
        durationMs: 0,
        inTransitCount: 0,
        writeAmplification: 0,
      }
    }));

    queueRef.current = [];
    visitedRef.current = new Set([state.actorId]);
    simulationStartTimeRef.current = Date.now();
    totalPausedTimeRef.current = 0;
    
    // Direct followers of actor (Level 1)
    const neighbors = getNeighbors(state.actorId, graphEdges);
    const depthLimit = calculateMaxDepth(state.strategy, state.maxDepth);
    
    if (depthLimit >= 1 && neighbors.length > 0) {
      neighbors.forEach(n => {
        const edge = graphEdges.find(e => 
          (e.source === state.actorId && e.target === n) || 
          (e.target === state.actorId && e.source === n)
        );
        if (edge) {
          queueRef.current.push({ source: state.actorId!, target: n, level: 1, edgeId: edge.id });
        }
      });
    }
    
    lastTickRef.current = performance.now();
    startAnimationLoop();
  }, [state.actorId, state.action, state.strategy, state.maxDepth, state.customMessage]);

  const pause = useCallback(() => {
    setState(s => ({ ...s, status: 'paused' }));
    lastPauseTimeRef.current = Date.now();
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
  }, []);

  const resume = useCallback(() => {
    setState(s => ({ ...s, status: 'simulating' }));
    totalPausedTimeRef.current += (Date.now() - lastPauseTimeRef.current);
    lastTickRef.current = performance.now();
    startAnimationLoop();
  }, []);

  const setConfig = useCallback((updates: Partial<SimulationState>) => {
    setState(s => ({ ...s, ...updates }));
  }, []);

  const stepNext = useCallback(() => {
    if (state.status === 'ready' || state.status === 'completed') {
      trigger();
      return;
    }
    if (state.status === 'paused') {
      resume();
    }
  }, [state.status, trigger, resume]);

  const startAnimationLoop = () => {
    const loop = (timestamp: number) => {
      const dt = timestamp - lastTickRef.current;
      lastTickRef.current = timestamp;
      
      const currentSpeed = stateRef.current.speed;
      const speedMs = getSpeedMs(currentSpeed);
      const isStepMode = stateRef.current.mode === 'step';
      
      setActiveTraversals(current => {
        let next = [...current];
        const progressIncrement = Math.min(1, dt / speedMs);
        const finishedTraversals: EdgeTraversal[] = [];
        
        next = next.map(t => {
          const newProgress = t.progress + progressIncrement;
          if (newProgress >= 1) {
            finishedTraversals.push(t);
          }
          return { ...t, progress: Math.min(1, newProgress) };
        }).filter(t => t.progress < 1);
        
        // When traversals finish:
        if (finishedTraversals.length > 0) {
          const maxLevel = Math.max(...finishedTraversals.map(t => t.level));
          sound.playNotificationPop(maxLevel);

          setState(s => {
            const newState = { ...s };
            const newNodeStates = { ...s.nodeStates };
            const newNotifs = [...s.notifications];
            const currentActor = s.actorId;
            const actorObj = graphUsers.find(u => u.id === currentActor);
            const msg = s.customMessage || postPresets[0].text;
            
            finishedTraversals.forEach(t => {
              if (newNodeStates[t.target]?.status !== 'actor') {
                const count = (newNodeStates[t.target]?.notificationCount || 0) + 1;
                newNodeStates[t.target] = {
                  ...newNodeStates[t.target],
                  status: 'notified',
                  notificationCount: count,
                  level: t.level,
                  notifiedAt: Date.now(),
                  isOnline: true,
                };
              }
              
              newNotifs.unshift({
                id: generateId(),
                timestamp: Date.now(),
                source: t.source,
                target: t.target,
                action: s.action || 'post',
                message: s.action === 'post' 
                  ? `${actorObj?.name || 'User'}: "${msg}"` 
                  : `${actorObj?.name || 'User'} ${s.action}ed your activity`,
                level: t.level,
                status: 'sent'
              });
              
              // Spontaneous Follower Reactions (Makes other users actively work!)
              // 40% chance for notified followers to spontaneously like, comment, or repost
              if (Math.random() < 0.40) {
                const reactionDelay = 400 + Math.random() * 900;
                const reactionType: ReactionType = Math.random() < 0.35 ? 'repost' : Math.random() < 0.7 ? 'like' : 'comment';
                const targetId = t.target;

                const timer = setTimeout(() => {
                  triggerUserReaction(targetId, reactionType);
                }, reactionDelay);
                reactionTimersRef.current.push(timer);
              }
              
              // Queue neighbors for next level if within depth
              if (!visitedRef.current.has(t.target)) {
                visitedRef.current.add(t.target);
                
                const depthLimit = calculateMaxDepth(s.strategy, s.maxDepth);
                if (t.level < depthLimit) {
                  const neighbors = getNeighbors(t.target, graphEdges);
                  neighbors.forEach(n => {
                    if (!visitedRef.current.has(n)) {
                      const edge = graphEdges.find(e => 
                        (e.source === t.target && e.target === n) || 
                        (e.target === t.target && e.source === n)
                      );
                      if (edge) {
                        queueRef.current.push({ source: t.target, target: n, level: t.level + 1, edgeId: edge.id });
                      }
                    }
                  });
                }
              }
            });
            
            newState.nodeStates = newNodeStates;
            newState.notifications = newNotifs;
            newState.stats.notificationsSent += finishedTraversals.length;
            
            const active = Object.values(newNodeStates).filter(ns => ns.status === 'notified' || ns.status === 'reacting' || ns.status === 'resharing').length;
            newState.stats.activeRecipients = active;
            newState.stats.currentLevel = Math.max(newState.stats.currentLevel, ...finishedTraversals.map(t => t.level));
            newState.stats.writeAmplification = newState.stats.notificationsSent;
            newState.stats.inTransitCount = next.length;
            
            return newState;
          });
        }
        
        // Pop next batch from queue
        if (next.length === 0 && queueRef.current.length > 0) {
          if (isStepMode && finishedTraversals.length > 0) {
            setState(s => ({ ...s, status: 'paused', currentStepLevel: s.stats.currentLevel }));
            return [];
          }

          const currentLevel = queueRef.current[0].level;
          const batch = queueRef.current.filter(q => q.level === currentLevel);
          queueRef.current = queueRef.current.filter(q => q.level !== currentLevel);
          
          setState(s => {
            const ns = { ...s.nodeStates };
            batch.forEach(b => {
              if (!ns[b.target]) {
                ns[b.target] = { status: 'processing', notificationCount: 0, level: b.level };
              }
            });
            return { 
              ...s, 
              nodeStates: ns,
              stats: {
                ...s.stats,
                inTransitCount: batch.length,
              }
            };
          });
          
          batch.forEach(b => {
            next.push({
              id: generateId(),
              edgeId: b.edgeId,
              source: b.source,
              target: b.target,
              level: b.level,
              action: b.isReshare ? 'post' : (stateRef.current.action || 'post'),
              progress: 0,
            });
          });
        }
        
        // Check for completion
        if (next.length === 0 && queueRef.current.length === 0) {
          if (stateRef.current.status === 'simulating') {
            sound.playCompletionChime();
            setState(s => ({
              ...s,
              status: 'completed',
              stats: { ...s.stats, inTransitCount: 0 }
            }));
          }
          return [];
        }
        
        return next;
      });
      
      if (stateRef.current.status === 'simulating') {
        animationFrameRef.current = requestAnimationFrame(loop);
      }
    };
    
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(loop);
  };
  
  useEffect(() => {
    return () => {
      clearReactionTimers();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return {
    state,
    activeTraversals,
    trigger,
    pause,
    resume,
    reset,
    stepNext,
    triggerUserReaction,
    setConfig,
  };
}
