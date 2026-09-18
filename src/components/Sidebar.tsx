import { Play, Pause, RotateCcw, Zap, Search } from 'lucide-react';
import { ActionType, PropagationStrategy, SimulationSpeed, SimulationState, User } from '../types/graph';
import { Button } from './ui/Button';
import { Panel } from './ui/Panel';
import { SegmentedControl } from './ui/SegmentedControl';

interface SidebarProps {
  state: SimulationState;
  users: User[];
  onConfigChange: (updates: Partial<SimulationState>) => void;
  onTrigger: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSearch: (q: string) => void;
  searchQuery: string;
}

export function Sidebar({ 
  state, users, onConfigChange, onTrigger, onPause, onResume, onReset, onSearch, searchQuery 
}: SidebarProps) {
  const isRunning = state.status === 'simulating';
  const isPaused = state.status === 'paused';
  const isCompleted = state.status === 'completed';

  return (
    <div className="flex w-full flex-col gap-4 p-4 lg:w-[300px] shrink-0 border-r border-line bg-ink-900 overflow-y-auto">
      <Panel className="flex flex-col gap-4">
         <div>
          <h2 className="mb-2 text-xs font-semibold text-text-lo uppercase tracking-wider">Search</h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-text-lo" />
            <input
              type="text"
              placeholder="Search users... (/)"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="h-9 w-full rounded-md border border-line bg-ink-900 pl-9 pr-3 text-sm text-text-hi placeholder:text-text-lo focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal"
            />
          </div>
        </div>
      </Panel>

      <Panel className="flex flex-col gap-4">
        <div>
          <h2 className="mb-2 text-xs font-semibold text-text-lo uppercase tracking-wider">Configuration</h2>
          
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-hi">Actor</label>
              <select 
                value={state.actorId || ''}
                onChange={e => onConfigChange({ actorId: e.target.value })}
                className="h-9 w-full rounded-md border border-line bg-ink-900 px-3 text-sm text-text-hi focus:border-signal focus:outline-none"
                disabled={isRunning || isPaused}
              >
                <option value="" disabled>Select an actor...</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.username})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-hi">Action</label>
              <div className="grid grid-cols-3 gap-2">
                {(['post', 'like', 'follow'] as ActionType[]).map(act => (
                  <Button
                    key={act}
                    variant={state.action === act ? 'primary' : 'outline'}
                    size="sm"
                    className="capitalize"
                    onClick={() => onConfigChange({ action: act })}
                    disabled={isRunning || isPaused}
                  >
                    {act}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <Panel className="flex flex-col gap-4">
        <div>
          <h2 className="mb-2 text-xs font-semibold text-text-lo uppercase tracking-wider">Engine Rules</h2>
          
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-hi">Strategy</label>
              <SegmentedControl<PropagationStrategy>
                options={[
                  { label: 'Direct', value: 'direct' },
                  { label: 'BFS', value: 'bfs' },
                  { label: 'Depth', value: 'depth' },
                ]}
                value={state.strategy}
                onChange={(v) => onConfigChange({ strategy: v })}
                disabled={isRunning || isPaused}
                className="w-full"
              />
            </div>

            {state.strategy === 'depth' && (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-hi">Propagation Depth</label>
                <SegmentedControl<number>
                  options={[
                    { label: '1', value: 1 },
                    { label: '2', value: 2 },
                    { label: '3', value: 3 },
                  ]}
                  value={state.maxDepth}
                  onChange={(v) => onConfigChange({ maxDepth: v })}
                  disabled={isRunning || isPaused}
                  className="w-full"
                />
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-hi">Speed</label>
              <SegmentedControl<SimulationSpeed>
                options={[
                  { label: 'Slow', value: 'slow' },
                  { label: 'Normal', value: 'normal' },
                  { label: 'Fast', value: 'fast' },
                ]}
                value={state.speed}
                onChange={(v) => onConfigChange({ speed: v })}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </Panel>

      <div className="mt-auto flex flex-col gap-2 pt-4">
        {!isRunning && !isPaused && (
          <Button 
            className="w-full" 
            size="lg" 
            onClick={onTrigger}
            disabled={!state.actorId || !state.action}
          >
            <Zap className="mr-2 h-4 w-4" />
            {isCompleted ? 'Re-run Simulation' : 'Trigger Action'}
          </Button>
        )}
        
        {isRunning && (
          <Button className="w-full" size="lg" variant="secondary" onClick={onPause}>
            <Pause className="mr-2 h-4 w-4" /> Pause
          </Button>
        )}

        {isPaused && (
          <Button className="w-full" size="lg" onClick={onResume}>
            <Play className="mr-2 h-4 w-4" /> Resume
          </Button>
        )}

        <Button className="w-full" variant="ghost" onClick={onReset}>
          <RotateCcw className="mr-2 h-4 w-4" /> Reset Graph
        </Button>
      </div>
    </div>
  );
}
