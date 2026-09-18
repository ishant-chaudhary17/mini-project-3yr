import { useState, useRef, useEffect, useCallback } from 'react';
import { ActionType, EdgeTraversal, NodeState, NotificationEvent, PropagationStrategy, SimulationSpeed, SimulationState, SimulationStatus } from '../types/graph';
import { edges as graphEdges, users as graphUsers } from '../data/socialGraph';
import { calculateMaxDepth, getNeighbors, getSpeedMs } from '../utils/simulationEngine';


// Simple ID generator
const generateId = () => Math.random().toString(36).substring(2, 9);

type QueueItem = {
  source: string;
  target: string;
  level: number;
  edgeId: string;
};

const initialState: SimulationState = {
  status: 'ready',
  actorId: null,
  action: null,
  strategy: 'bfs',
  maxDepth: 3,
  speed: 'normal',
  nodeStates: {},
  notifications: [],
  stats: {
    notificationsSent: 0,
    activeRecipients: 0,
    currentLevel: 0,
    durationMs: 0,
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
  const animationFrameRef = useRef<number>();
  const lastTickRef = useRef<number>(0);
  
  // Update duration
  useEffect(() => {
    let interval: any;
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
    return () => clearInterval(interval);
  }, [state.status]);

  const reset = useCallback(() => {
    setState({
      ...initialState,
      strategy: state.strategy,
      speed: state.speed,
      maxDepth: state.maxDepth,
      actorId: state.actorId, // keep selection
      action: state.action,
    });
    setActiveTraversals([]);
    queueRef.current = [];
    visitedRef.current = new Set();
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
  }, [state]);

  const trigger = useCallback(() => {
    if (!state.actorId || !state.action) return;
    
    // Reset if previously completed
    if (state.status === 'completed') {
      // Just clear stats and nodes, keep config
      setState(s => ({
        ...s,
        status: 'simulating',
        nodeStates: { [s.actorId!]: { status: 'actor', notificationCount: 0, level: 0 } },
        notifications: [{
           id: generateId(), timestamp: Date.now(), source: s.actorId!, target: s.actorId!, action: s.action!, level: 0, status: 'sent'
        }], // Actor event
        stats: { notificationsSent: 0, activeRecipients: 0, currentLevel: 0, durationMs: 0 }
      }));
    } else {
      setState(s => ({
        ...s,
        status: 'simulating',
        nodeStates: { [s.actorId!]: { status: 'actor', notificationCount: 0, level: 0 } }
      }));
    }

    queueRef.current = [];
    visitedRef.current = new Set([state.actorId]);
    simulationStartTimeRef.current = Date.now();
    totalPausedTimeRef.current = 0;
    
    // Initial neighbors
    const neighbors = getNeighbors(state.actorId, graphEdges);
    const depthLimit = calculateMaxDepth(state.strategy, state.maxDepth);
    
    if (depthLimit >= 1) {
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
  }, [state.actorId, state.action, state.strategy, state.maxDepth, state.status]);

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

  const startAnimationLoop = () => {
    const loop = (timestamp: number) => {
      // Delta time in ms
      const dt = timestamp - lastTickRef.current;
      lastTickRef.current = timestamp;
      
      const speedMs = getSpeedMs(state.speed);
      
      setActiveTraversals(current => {
        let next = [...current];
        
        // Advance progress
        const progressIncrement = dt / speedMs;
        let finishedTraversals: EdgeTraversal[] = [];
        
        next = next.map(t => {
          const newProgress = t.progress + progressIncrement;
          if (newProgress >= 1) {
            finishedTraversals.push(t);
          }
          return { ...t, progress: Math.min(1, newProgress) };
        }).filter(t => t.progress < 1);
        
        // Handle finished
        if (finishedTraversals.length > 0) {
          setState(s => {
            const newState = { ...s };
            const newNodeStates = { ...s.nodeStates };
            const newNotifs = [...s.notifications];
            
            finishedTraversals.forEach(t => {
               // Mark target as notified if not already actor or notified
               if (newNodeStates[t.target]?.status !== 'actor') {
                 const count = (newNodeStates[t.target]?.notificationCount || 0) + 1;
                 newNodeStates[t.target] = {
                   status: 'notified',
                   notificationCount: count,
                   level: t.level
                 };
               }
               
               newNotifs.unshift({
                 id: generateId(),
                 timestamp: Date.now(),
                 source: t.source,
                 target: t.target,
                 action: s.action!,
                 level: t.level,
                 status: 'sent'
               });
               
               // Add neighbors to queue if within depth
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
            
            // Count unique notified users
            const active = Object.values(newNodeStates).filter(ns => ns.status === 'notified').length;
            newState.stats.activeRecipients = active;
            newState.stats.currentLevel = Math.max(newState.stats.currentLevel, ...finishedTraversals.map(t => t.level));
            
            return newState;
          });
        }
        
        // Pop new items from queue if we can
        // To make it look like a level-by-level BFS, we only process the next level once the current active count is 0?
        // Or we just launch them in batches. 
        // For a visual fan-out, we want nodes to emit concurrently.
        if (next.length === 0 && queueRef.current.length > 0) {
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
              return { ...s, nodeStates: ns };
           });
           
           batch.forEach(b => {
             next.push({
               id: generateId(),
               edgeId: b.edgeId,
               source: b.source,
               target: b.target,
               level: b.level,
               progress: 0
             });
           });
        }
        
        return next;
      });
      
      animationFrameRef.current = requestAnimationFrame(loop);
    };
    
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(loop);
  };
  
  // Check for completion
  useEffect(() => {
    if (state.status === 'simulating' && activeTraversals.length === 0 && queueRef.current.length === 0) {
      setState(s => ({ ...s, status: 'completed' }));
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    }
  }, [activeTraversals.length, state.status]);

  // Clean up
  useEffect(() => {
    return () => {
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
    setConfig,
  };
}
