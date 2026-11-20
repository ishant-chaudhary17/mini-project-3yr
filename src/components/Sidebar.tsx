import { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Search, 
  SkipForward, 
  FileText, 
  Crown, 
  Check, 
  Sparkles,
  MessageSquare,
  Radio
} from 'lucide-react';
import { ActionType, PropagationStrategy, SimulationMode, SimulationSpeed, SimulationState, User } from '../types/graph';
import { postPresets } from '../data/socialGraph';
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
  onStepNext?: () => void;
  onOpenNetworkManagers?: () => void;
  onSearch: (q: string) => void;
  searchQuery: string;
}

export function Sidebar({ 
  state, 
  users, 
  onConfigChange, 
  onTrigger, 
  onPause, 
  onResume, 
  onReset, 
  onStepNext,
  onOpenNetworkManagers,
  onSearch, 
  searchQuery 
}: SidebarProps) {
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const isRunning = state.status === 'simulating';
  const isPaused = state.status === 'paused';
  const isCompleted = state.status === 'completed';

  const selectedActor = users.find(u => u.id === state.actorId);

  return (
    <div className="flex w-full flex-col gap-4 p-4 lg:w-[320px] shrink-0 border-r border-line bg-ink-900 overflow-y-auto hide-scrollbar">
      {/* Search Bar */}
      <Panel className="flex flex-col gap-2">
        <h2 className="text-xs font-semibold text-text-lo uppercase tracking-wider">Search Network</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-text-lo" />
          <input
            type="text"
            placeholder="Search users or role... (/)"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="h-9 w-full rounded-md border border-line bg-ink-900 pl-9 pr-3 text-xs text-text-hi placeholder:text-text-lo focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal"
          />
        </div>
      </Panel>

      {/* Configuration Panel */}
      <Panel className="flex flex-col gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-semibold text-text-lo uppercase tracking-wider">Broadcaster (Actor)</h2>
            {selectedActor?.isVerified && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-actor bg-actor/10 px-2 py-0.5 rounded-full">
                <Crown size={11} /> Influencer
              </span>
            )}
          </div>
          
          <div className="space-y-3">
            <div>
              <select 
                value={state.actorId || ''}
                onChange={e => onConfigChange({ actorId: e.target.value })}
                className="h-10 w-full rounded-xl border border-line bg-ink-800 px-3 text-xs text-text-hi font-medium focus:border-signal focus:outline-none"
                disabled={isRunning || isPaused}
              >
                <option value="" disabled>Select broadcaster...</option>
                <optgroup label="👑 Verified Influencers (High Fan-Out)">
                  {users.filter(u => u.isVerified).map(u => (
                    <option key={u.id} value={u.id}>
                      ★ {u.name} ({u.followersCount} followers)
                    </option>
                  ))}
                </optgroup>
                <optgroup label="👥 Network Members">
                  {users.filter(u => !u.isVerified).map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.followersCount} followers)
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Quick Pick Influencer */}
            <div className="flex items-center gap-2 text-[11px] text-text-lo">
              <span>Quick pick:</span>
              <button
                onClick={() => onConfigChange({ actorId: 'u02' })}
                disabled={isRunning || isPaused}
                className="text-actor hover:underline font-semibold"
              >
                John Carter (10)
              </button>
              <span>•</span>
              <button
                onClick={() => onConfigChange({ actorId: 'u00' })}
                disabled={isRunning || isPaused}
                className="text-signal hover:underline font-semibold"
              >
                Alex Morgan (8)
              </button>
            </div>

            {/* Connected Network Managers Quick Banner */}
            {onOpenNetworkManagers && (
              <button
                onClick={onOpenNetworkManagers}
                className="w-full flex items-center justify-between rounded-xl border border-signal/40 bg-signal/10 px-3 py-2 text-[11px] text-signal hover:bg-signal/20 transition-all shadow-sm"
              >
                <span className="flex items-center gap-1.5 font-bold">
                  <Radio size={13} className="animate-pulse" />
                  Connected Managers Hub
                </span>
                <span className="font-semibold text-[10px] text-text-hi bg-ink-900/60 px-2 py-0.5 rounded-full border border-line">
                  Live Traffic →
                </span>
              </button>
            )}

            {/* Action Type */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-hi">Social Action</label>
              <div className="grid grid-cols-3 gap-2">
                {(['post', 'like', 'follow'] as ActionType[]).map(act => (
                  <Button
                    key={act}
                    variant={state.action === act ? 'primary' : 'outline'}
                    size="sm"
                    className="capitalize text-xs font-semibold"
                    onClick={() => onConfigChange({ action: act })}
                    disabled={isRunning || isPaused}
                  >
                    {act === 'post' ? '💬 Post' : act === 'like' ? '❤️ Like' : '👤 Follow'}
                  </Button>
                ))}
              </div>
            </div>

            {/* Post Content Composer (If Action is 'post') */}
            {state.action === 'post' && (
              <div className="mt-2 space-y-2 rounded-xl border border-line bg-ink-800/80 p-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-text-hi flex items-center gap-1.5">
                    <MessageSquare size={13} className="text-signal" />
                    Post Content
                  </span>
                  <button
                    onClick={() => setIsEditingMessage(!isEditingMessage)}
                    className="text-signal text-[10px] hover:underline"
                  >
                    {isEditingMessage ? 'Done' : 'Customize'}
                  </button>
                </div>

                {isEditingMessage ? (
                  <textarea
                    value={state.customMessage || ''}
                    onChange={(e) => onConfigChange({ customMessage: e.target.value })}
                    rows={3}
                    placeholder="Type post message..."
                    className="w-full rounded-lg border border-line bg-ink-900 p-2 text-xs text-text-hi focus:border-signal focus:outline-none"
                  />
                ) : (
                  <div>
                    <select
                      value={state.customMessage || postPresets[0].text}
                      onChange={(e) => onConfigChange({ customMessage: e.target.value })}
                      className="w-full rounded-lg border border-line bg-ink-900 p-2 text-[11px] text-text-hi focus:border-signal focus:outline-none"
                      disabled={isRunning || isPaused}
                    >
                      {postPresets.map(preset => (
                        <option key={preset.id} value={preset.text}>
                          {preset.title}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1.5 text-[10px] text-text-lo italic line-clamp-2">
                      "{state.customMessage || postPresets[0].text}"
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Panel>

      {/* Engine & Propagation Rules */}
      <Panel className="flex flex-col gap-4">
        <div>
          <h2 className="mb-2 text-xs font-semibold text-text-lo uppercase tracking-wider">Algorithm & Speed</h2>
          
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-hi">Strategy</label>
              <SegmentedControl<PropagationStrategy>
                options={[
                  { label: 'Direct', value: 'direct' },
                  { label: 'BFS (Wave)', value: 'bfs' },
                  { label: 'Depth Capped', value: 'depth' },
                ]}
                value={state.strategy}
                onChange={(v) => onConfigChange({ strategy: v })}
                disabled={isRunning || isPaused}
                className="w-full"
              />
            </div>

            {state.strategy === 'depth' && (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-hi">Max Hops (Depth)</label>
                <SegmentedControl<number>
                  options={[
                    { label: '1 Hop', value: 1 },
                    { label: '2 Hops', value: 2 },
                    { label: '3 Hops', value: 3 },
                  ]}
                  value={state.maxDepth}
                  onChange={(v) => onConfigChange({ maxDepth: v })}
                  disabled={isRunning || isPaused}
                  className="w-full"
                />
              </div>
            )}

            {/* Mode: Continuous vs Step-by-Step */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-hi flex items-center justify-between">
                <span>Execution Mode</span>
                <span className="text-[10px] text-signal font-bold uppercase">{state.mode}</span>
              </label>
              <SegmentedControl<SimulationMode>
                options={[
                  { label: 'Continuous', value: 'continuous' },
                  { label: 'Step Hop', value: 'step' },
                ]}
                value={state.mode}
                onChange={(m) => onConfigChange({ mode: m })}
                className="w-full"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-hi">Animation Speed</label>
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

      {/* Main Action Buttons */}
      <div className="mt-auto flex flex-col gap-2 pt-2">
        {!isRunning && !isPaused && (
          <Button 
            className="w-full py-2.5 font-bold shadow-lg shadow-signal/20" 
            size="lg" 
            onClick={onTrigger}
            disabled={!state.actorId || !state.action}
          >
            <Zap className="mr-2 h-4 w-4" />
            {isCompleted ? 'Re-run Simulation' : 'Broadcast Fan-Out'}
          </Button>
        )}
        
        {isRunning && (
          <Button className="w-full" size="lg" variant="secondary" onClick={onPause}>
            <Pause className="mr-2 h-4 w-4" /> Pause Simulation
          </Button>
        )}

        {isPaused && (
          <div className="flex gap-2">
            <Button className="flex-1" size="lg" onClick={onResume}>
              <Play className="mr-2 h-4 w-4" /> Resume
            </Button>
            {state.mode === 'step' && onStepNext && (
              <Button className="flex-1" size="lg" variant="secondary" onClick={onStepNext}>
                <SkipForward className="mr-2 h-4 w-4" /> Step Hop
              </Button>
            )}
          </div>
        )}

        <Button 
          variant="outline" 
          size="sm" 
          onClick={onReset}
          className="w-full text-xs text-text-lo hover:text-text-hi"
        >
          <RotateCcw className="mr-2 h-3.5 w-3.5" />
          Reset Graph
        </Button>
      </div>
    </div>
  );
}
