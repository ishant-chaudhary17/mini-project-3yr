import { useState, useEffect } from 'react';
import { users, edges } from '../data/socialGraph';
import { useSimulation } from '../hooks/useSimulation';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { GraphVisualizer } from './GraphVisualizer';
import { UserDetails } from './UserDetails';
import { EventTimeline } from './EventTimeline';
import { AnalyticsPanel } from './AnalyticsPanel';

export function Dashboard() {
  const { state, activeTraversals, trigger, pause, resume, reset, setConfig } = useSimulation();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          if (state.status === 'ready' || state.status === 'completed') trigger();
          else if (state.status === 'simulating') pause();
          else if (state.status === 'paused') resume();
          break;
        case 'r':
        case 'R':
          reset();
          break;
        case 'Escape':
          setSelectedUserId(null);
          break;
        case '/':
          e.preventDefault();
          const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
          if (searchInput) searchInput.focus();
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
  }, [state.status, state.strategy, trigger, pause, resume, reset, setConfig]);

  // Handle Search
  const displayUsers = searchQuery 
    ? users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.username.toLowerCase().includes(searchQuery.toLowerCase()))
    : users;

  // Auto-select first search result if exactly one matches? Or let the user click. We will let the user click in sidebar, but we don't have a user list in sidebar. 
  // Ah, the search is in sidebar, I need to show results there. I will update Sidebar to show search results. Wait, Sidebar is just search input right now. Let's fix Sidebar to show search results, or just handle it here. 
  
  // For now, if a user searches and presses Enter, select the first match. Or just highlight them.
  useEffect(() => {
    if (searchQuery && displayUsers.length === 1) {
      setSelectedUserId(displayUsers[0].id);
    }
  }, [searchQuery]);

  const selectedUser = selectedUserId ? users.find(u => u.id === selectedUserId) || null : null;
  const selectedNodeState = selectedUserId ? state.nodeStates[selectedUserId] : undefined;

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-ink-900 font-sans text-text-hi">
      <Header status={state.status} />
      
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        <Sidebar
          state={state}
          users={users} // For actor dropdown
          onConfigChange={setConfig}
          onTrigger={trigger}
          onPause={pause}
          onResume={resume}
          onReset={reset}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
        />
        
        <div className="flex flex-1 flex-col overflow-hidden relative">
          <GraphVisualizer
            users={displayUsers}
            edges={edges}
            nodeStates={state.nodeStates}
            activeTraversals={activeTraversals}
            selectedUserId={selectedUserId}
            onSelectUser={setSelectedUserId}
          />
          {searchQuery && displayUsers.length === 0 && (
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-ink-800 p-4 rounded-lg border border-line shadow-lg">
                No users found.
             </div>
          )}
        </div>

        {selectedUser ? (
          <UserDetails 
            user={selectedUser} 
            nodeState={selectedNodeState} 
            onClose={() => setSelectedUserId(null)} 
          />
        ) : (
          <AnalyticsPanel
            state={state}
            totalUsers={users.length}
            totalConnections={edges.length}
          />
        )}
      </div>

      <EventTimeline events={state.notifications} users={users} />
    </div>
  );
}
