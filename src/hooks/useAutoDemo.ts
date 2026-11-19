import { useState, useEffect, useRef, useCallback } from 'react';
import { ActionType, PropagationStrategy, ReactionType, SimulationSpeed, SimulationState } from '../types/graph';

export type DemoScenario = {
  id: string;
  title: string;
  actorId: string;
  action: ActionType;
  message: string;
  strategy: PropagationStrategy;
  maxDepth: number;
  speed: SimulationSpeed;
  description: string;
  activeFollowers: { id: string; name: string; type: ReactionType; delay: number; comment?: string }[];
};

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 's1',
    title: '👑 Influencer Broadcast (John Carter)',
    actorId: 'u02',
    action: 'post',
    message: '🚀 Deployed BFS notification fan-out engine to production!',
    strategy: 'bfs',
    maxDepth: 3,
    speed: 'normal',
    description: 'Demonstrating real-time BFS fan-out with active follower reshares, replies, and reactions.',
    activeFollowers: [
      { id: 'u01', name: 'Sarah Wilson', type: 'like', delay: 1800 },
      { id: 'u03', name: 'Emma Davis', type: 'comment', delay: 2400, comment: 'Impressive BFS latency!' },
      { id: 'u05', name: 'Ryan Lopez', type: 'repost', delay: 3200, comment: 'Reshared to 11 followers' },
    ]
  },
  {
    id: 's2',
    title: '🌊 Viral Second-Degree Wave (Sarah Wilson)',
    actorId: 'u01',
    action: 'like',
    message: 'Liked Alex Morgan\'s graph architecture post',
    strategy: 'depth',
    maxDepth: 2,
    speed: 'normal',
    description: 'Demonstrating depth-capped propagation with mutual followers actively echoing the signal.',
    activeFollowers: [
      { id: 'u00', name: 'Alex Morgan', type: 'comment', delay: 1700, comment: 'Thanks Sarah!' },
      { id: 'u04', name: 'Melissa Ramirez', type: 'repost', delay: 2500 },
    ]
  },
  {
    id: 's3',
    title: '⚡ Direct Follower Signal (Alex Morgan)',
    actorId: 'u00',
    action: 'follow',
    message: 'Started following John Carter (@johnc)',
    strategy: 'direct',
    maxDepth: 1,
    speed: 'normal',
    description: 'Demonstrating 1-to-1 immediate follower interaction with instant recipient response.',
    activeFollowers: [
      { id: 'u02', name: 'John Carter', type: 'like', delay: 1600 },
    ]
  }
];

interface UseAutoDemoProps {
  simulationStatus: string;
  currentLevel: number;
  notificationsSent: number;
  trigger: () => void;
  reset: () => void;
  setConfig: (updates: Partial<SimulationState>) => void;
  triggerUserReaction?: (userId: string, type: ReactionType, customText?: string) => void;
}

export function useAutoDemo({
  simulationStatus,
  currentLevel,
  notificationsSent,
  trigger,
  reset,
  setConfig,
  triggerUserReaction,
}: UseAutoDemoProps) {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [phaseMessage, setPhaseMessage] = useState('Initializing self-running demo...');
  const [countdown, setCountdown] = useState<number | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const followerActionTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const currentScenario = DEMO_SCENARIOS[scenarioIndex];

  const clearAllTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    followerActionTimers.current.forEach(t => clearTimeout(t));
    followerActionTimers.current = [];
    timerRef.current = null;
    countdownIntervalRef.current = null;
    setCountdown(null);
  };

  // Launch a specific scenario
  const runScenario = useCallback((index: number) => {
    clearAllTimers();
    const scenario = DEMO_SCENARIOS[index];
    setScenarioIndex(index);
    setPhaseMessage(`Step 1: Setting up broadcaster ${scenario.title.split('(')[1]?.replace(')', '') || ''}...`);

    reset();

    // Configure simulation parameters
    setConfig({
      actorId: scenario.actorId,
      action: scenario.action,
      customMessage: scenario.message,
      strategy: scenario.strategy,
      maxDepth: scenario.maxDepth,
      speed: scenario.speed,
      mode: 'continuous',
    });

    // Short pause then trigger
    timerRef.current = setTimeout(() => {
      setPhaseMessage(`Step 2: Signal emitted! Dispatching Level 1 notifications...`);
      trigger();

      // Schedule active follower responses to ensure other users work!
      if (triggerUserReaction && scenario.activeFollowers) {
        scenario.activeFollowers.forEach(f => {
          const t = setTimeout(() => {
            triggerUserReaction(f.id, f.type, f.comment);
            setPhaseMessage(`⚡ Follower active: ${f.name} sent ${f.type === 'like' ? '❤️ Like' : f.type === 'repost' ? '🔁 Reshare to followers' : `💬 Comment: "${f.comment || ''}"`}`);
          }, f.delay);
          followerActionTimers.current.push(t);
        });
      }
    }, 1200);
  }, [reset, setConfig, trigger, triggerUserReaction]);

  // Start auto-demo from beginning
  const startAutoDemo = useCallback(() => {
    setIsActive(true);
    setIsPaused(false);
    runScenario(0);
  }, [runScenario]);

  // Stop auto-demo
  const stopAutoDemo = useCallback(() => {
    setIsActive(false);
    setIsPaused(false);
    clearAllTimers();
    setPhaseMessage('');
  }, []);

  // Pause auto-demo
  const pauseAutoDemo = useCallback(() => {
    setIsPaused(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    followerActionTimers.current.forEach(t => clearTimeout(t));
    followerActionTimers.current = [];
  }, []);

  // Resume auto-demo
  const resumeAutoDemo = useCallback(() => {
    setIsPaused(false);
    if (simulationStatus === 'completed') {
      nextScenario();
    }
  }, [simulationStatus]);

  // Advance to next scenario
  const nextScenario = useCallback(() => {
    const nextIdx = (scenarioIndex + 1) % DEMO_SCENARIOS.length;
    runScenario(nextIdx);
  }, [scenarioIndex, runScenario]);

  // Update dynamic phase messages based on simulation state
  useEffect(() => {
    if (!isActive) return;

    if (simulationStatus === 'simulating') {
      if (currentLevel === 1) {
        setPhaseMessage(`📡 Signal reached Level 1 followers. Watch for follower reactions...`);
      } else if (currentLevel >= 2) {
        setPhaseMessage(`🌐 Followers working! Secondary reshares expanding BFS to Level ${currentLevel} (${notificationsSent} writes)...`);
      }
    } else if (simulationStatus === 'completed' && !isPaused) {
      setPhaseMessage(`✅ Full network echo complete! Broadcaster + Follower reactions generated ${notificationsSent} writes.`);

      let secondsLeft = 5;
      setCountdown(secondsLeft);

      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = setInterval(() => {
        secondsLeft -= 1;
        setCountdown(secondsLeft);
        if (secondsLeft <= 0) {
          if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
        }
      }, 1000);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        nextScenario();
      }, 5000);
    }
  }, [isActive, simulationStatus, currentLevel, notificationsSent, isPaused, nextScenario]);

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);

  return {
    isActive,
    isPaused,
    scenarioIndex,
    currentScenario,
    phaseMessage,
    countdown,
    startAutoDemo,
    stopAutoDemo,
    pauseAutoDemo,
    resumeAutoDemo,
    nextScenario,
  };
}
