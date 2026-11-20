import { useState, useEffect, useRef } from 'react';
import { users, edges } from '../data/socialGraph';
import { useSimulation } from '../hooks/useSimulation';
import { useAutoDemo, DEMO_SCENARIOS } from '../hooks/useAutoDemo';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { GraphVisualizer } from './GraphVisualizer';
import { UserDetails } from './UserDetails';
import { EventTimeline } from './EventTimeline';
import { AnalyticsPanel } from './AnalyticsPanel';
import { PhoneMockup } from './PhoneMockup';
import { ArchitectureModal } from './ArchitectureModal';
import { VivaGuideModal } from './VivaGuideModal';
import { AutoDemoHUD } from './AutoDemoHUD';
import { NetworkManagerHub } from './NetworkManagerHub';

export function Dashboard() {
  const { 
    state, 
    activeTraversals, 
    trigger, 
    pause, 
    resume, 
    reset, 
    stepNext, 
    triggerUserReaction, 
    setConfig 
  } = useSimulation();

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isVivaOpen, setIsVivaOpen] = useState(false);
  const [isNetworkManagerOpen, setIsNetworkManagerOpen] = useState(false);
  
  const graphRef = useRef<{ fit: () => void } | null>(null);

  // Auto-Demo Showcase Hook with active follower interactions
  const autoDemo = useAutoDemo({
    simulationStatus: state.status,
    currentLevel: state.stats.currentLevel,
    notificationsSent: state.stats.notificationsSent,
    trigger,
    reset,
    setConfig,
    triggerUserReaction,
  });

  // Compute matching user IDs for search highlighting
  const matchedUserIds = searchQuery.trim()
    ? new Set(users
        .filter(u =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (u.role && u.role.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .map(u => u.id)
      )
    : null;

  // Auto-select single search match
  useEffect(() => {
    if (matchedUserIds && matchedUserIds.size === 1) {
      setSelectedUserId([...matchedUserIds][0]);
    }
  }, [searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  // Automatically open phone mockup on first simulation trigger if user hasn't opened it yet
  useEffect(() => {
    if (state.status === 'simulating' && state.stats.notificationsSent > 0 && !isPhoneOpen) {
      setIsPhoneOpen(true);
    }
  }, [state.status, state.stats.notificationsSent]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          if (state.status === 'ready' || state.status === 'completed') trigger();
          else if (state.status === 'simulating') pause();
          else if (state.status === 'paused') resume();
          break;
        case 'r': case 'R':
          reset();
          break;
        case 'f': case 'F':
          graphRef.current?.fit();
          break;
        case 'p': case 'P':
          setIsPhoneOpen(prev => !prev);
          break;
        case 'a': case 'A':
          if (autoDemo.isActive) autoDemo.stopAutoDemo();
          else autoDemo.startAutoDemo();
          break;
        case 'Escape':
          setSelectedUserId(null);
          setSearchQuery('');
          setIsArchitectureOpen(false);
          setIsVivaOpen(false);
          setIsNetworkManagerOpen(false);
          if (autoDemo.isActive) autoDemo.stopAutoDemo();
          break;
        case '/':
          e.preventDefault();
          (document.querySelector('input[type="text"]') as HTMLInputElement | null)?.focus();
          break;
        case '1':
          if (state.strategy === 'depth') setConfig({ maxDepth: 1 });
          break;
        case '2':
          if (state.strategy === 'depth') setConfig({ maxDepth: 2 });
          break;
        case '3':
          if (state.strategy === 'depth') setConfig({ maxDepth: 3 });
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.status, state.strategy, trigger, pause, resume, reset, setConfig, autoDemo]);

  const selectedUser = selectedUserId ? users.find(u => u.id === selectedUserId) || null : null;
  const selectedNodeState = selectedUserId ? state.nodeStates[selectedUserId] : undefined;

  const handleSetAsActor = (id: string) => {
    setConfig({ actorId: id });
    setSelectedUserId(null);
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-ink-900 font-sans text-text-hi relative">
      {/* Top Navigation */}
      <Header 
        status={state.status} 
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onOpenViva={() => setIsVivaOpen(true)}
        onOpenNetworkManagers={() => setIsNetworkManagerOpen(true)}
        onTogglePhone={() => setIsPhoneOpen(prev => !prev)}
        isPhoneOpen={isPhoneOpen}
        isAutoDemoActive={autoDemo.isActive}
        onToggleAutoDemo={autoDemo.isActive ? autoDemo.stopAutoDemo : autoDemo.startAutoDemo}
      />
      
      {/* Main Workspace Area */}
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row relative">
        {/* Left Control Sidebar */}
        <Sidebar
          state={state}
          users={users}
          onConfigChange={setConfig}
          onTrigger={trigger}
          onPause={pause}
          onResume={resume}
          onReset={reset}
          onStepNext={stepNext}
          onOpenNetworkManagers={() => setIsNetworkManagerOpen(true)}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
        />
        
        {/* Central Graph Canvas with Floating HUD */}
        <div className="flex flex-1 flex-col overflow-hidden relative">
          {/* Autonomous Demo HUD */}
          <AutoDemoHUD
            isActive={autoDemo.isActive}
            isPaused={autoDemo.isPaused}
            currentScenario={autoDemo.currentScenario}
            scenarioIndex={autoDemo.scenarioIndex}
            totalScenarios={DEMO_SCENARIOS.length}
            phaseMessage={autoDemo.phaseMessage}
            countdown={autoDemo.countdown}
            onPause={autoDemo.pauseAutoDemo}
            onResume={autoDemo.resumeAutoDemo}
            onNext={autoDemo.nextScenario}
            onStop={autoDemo.stopAutoDemo}
          />

          <GraphVisualizer
            users={users}
            edges={edges}
            nodeStates={state.nodeStates}
            activeTraversals={activeTraversals}
            selectedUserId={selectedUserId}
            onSelectUser={setSelectedUserId}
            highlightedUserIds={matchedUserIds}
            onFitRef={graphRef}
          />

          {searchQuery.trim() && matchedUserIds && matchedUserIds.size === 0 && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-ink-800 px-5 py-3 rounded-2xl border border-line shadow-2xl text-xs text-text-hi">
              No network members matching &ldquo;{searchQuery}&rdquo;
            </div>
          )}
        </div>

        {/* Right Info Panel: User Details (if node selected) OR Live Analytics */}
        {selectedUser ? (
          <UserDetails 
            user={selectedUser} 
            nodeState={selectedNodeState}
            notifications={state.notifications}
            allUsers={users}
            onClose={() => setSelectedUserId(null)} 
            onSetAsActor={handleSetAsActor}
            onTriggerReaction={triggerUserReaction}
          />
        ) : (
          <AnalyticsPanel
            state={state}
            totalUsers={users.length}
            totalConnections={edges.length}
          />
        )}
      </div>

      {/* Bottom Real-Time Event Stream */}
      <EventTimeline events={state.notifications} users={users} />

      {/* Floating Simulated Smartphone Notification Center */}
      <PhoneMockup
        notifications={state.notifications}
        users={users}
        actorId={state.actorId}
        onSelectUser={(id) => setSelectedUserId(id)}
        isOpen={isPhoneOpen}
        onToggle={() => setIsPhoneOpen(prev => !prev)}
      />

      {/* Production Architecture & Queue Modal */}
      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
        activeRecipients={state.stats.activeRecipients}
        totalNotifications={state.stats.notificationsSent}
      />

      {/* 3rd Year Viva & Concepts Modal */}
      <VivaGuideModal
        isOpen={isVivaOpen}
        onClose={() => setIsVivaOpen(false)}
      />

      {/* Influencer & Connected Network Manager Activity Hub */}
      <NetworkManagerHub
        isOpen={isNetworkManagerOpen}
        onClose={() => setIsNetworkManagerOpen(false)}
        users={users}
        edges={edges}
        nodeStates={state.nodeStates}
        notifications={state.notifications}
        onSelectUser={(id) => setSelectedUserId(id)}
        onTriggerReaction={triggerUserReaction}
        onSetAsActor={handleSetAsActor}
      />
    </div>
  );
}
