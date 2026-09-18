import { Activity } from 'lucide-react';
import { SimulationState } from '../types/graph';
import { Panel } from './ui/Panel';

interface AnalyticsPanelProps {
  state: SimulationState;
  totalUsers: number;
  totalConnections: number;
}

export function AnalyticsPanel({ state, totalUsers, totalConnections }: AnalyticsPanelProps) {
  return (
    <div className="w-full lg:w-[340px] shrink-0 border-l border-line bg-ink-900 flex flex-col h-full overflow-y-auto hidden lg:flex">
      <div className="flex items-center gap-2 border-b border-line p-4">
        <Activity size={18} className="text-text-lo" />
        <h2 className="text-sm font-semibold text-text-hi">Simulation Analytics</h2>
      </div>

      <div className="p-4 flex flex-col gap-4">
        <Panel className="bg-ink-900 border-none px-0 py-2">
           <h3 className="mb-4 text-xs font-semibold text-text-lo uppercase tracking-wider">Network Data</h3>
           <div className="grid grid-cols-2 gap-4">
            <StatCard label="Total Users" value={totalUsers} />
            <StatCard label="Total Edges" value={totalConnections} />
            <StatCard label="Avg Conn/User" value={(totalConnections * 2 / totalUsers).toFixed(1)} />
           </div>
        </Panel>

        <div className="h-px w-full bg-line" />

        <Panel className="bg-ink-900 border-none px-0 py-2">
           <h3 className="mb-4 text-xs font-semibold text-text-lo uppercase tracking-wider">Current Simulation</h3>
           <div className="flex flex-col gap-4">
             <StatCard label="Status" value={state.status.toUpperCase()} />
             <div className="grid grid-cols-2 gap-4">
               <StatCard label="Notifs Sent" value={state.stats.notificationsSent} />
               <StatCard label="Active Recipients" value={state.stats.activeRecipients} />
               <StatCard label="Current Level" value={state.stats.currentLevel} />
               <StatCard label="Duration" value={`${(state.stats.durationMs / 1000).toFixed(1)}s`} />
             </div>
           </div>
        </Panel>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[12px] border border-line bg-ink-800 p-3">
      <div className="text-[10px] text-text-lo uppercase font-semibold tracking-wide mb-1">{label}</div>
      <div className="font-display text-xl font-bold tabular-nums tracking-tight text-text-hi">{value}</div>
    </div>
  );
}
