import { useState } from 'react';
import { Activity, Download, Check, Sparkles, TrendingUp, AlertCircle, Share2 } from 'lucide-react';
import { SimulationState } from '../types/graph';
import { Panel } from './ui/Panel';
import { Button } from './ui/Button';

interface AnalyticsPanelProps {
  state: SimulationState;
  totalUsers: number;
  totalConnections: number;
}

export function AnalyticsPanel({ state, totalUsers, totalConnections }: AnalyticsPanelProps) {
  const [copied, setCopied] = useState(false);

  const writeRatio = state.stats.notificationsSent > 0 ? state.stats.notificationsSent : 0;
  const coveragePercent = ((state.stats.activeRecipients / totalUsers) * 100).toFixed(0);

  const handleExport = () => {
    const report = {
      project: "Social Graph & Notification Fan-Out Visualizer (3rd Year Mini Project)",
      timestamp: new Date().toISOString(),
      configuration: {
        actorId: state.actorId,
        action: state.action,
        strategy: state.strategy,
        maxDepth: state.maxDepth,
        speed: state.speed,
      },
      metrics: {
        totalUsersInGraph: totalUsers,
        totalEdgesInGraph: totalConnections,
        notificationsDelivered: state.stats.notificationsSent,
        uniqueFollowersReached: state.stats.activeRecipients,
        networkCoverage: `${coveragePercent}%`,
        maxHopDepth: state.stats.currentLevel,
        durationSeconds: (state.stats.durationMs / 1000).toFixed(2),
        writeAmplificationFactor: `1:${writeRatio}`
      }
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `fanout-simulation-report-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full lg:w-[320px] shrink-0 border-l border-line bg-ink-900 flex flex-col h-full overflow-y-auto hidden lg:flex hide-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line p-4 bg-ink-800/50">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-signal" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-text-hi">
            Fan-Out Engine Metrics
          </h2>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
          state.status === 'simulating' ? 'bg-signal/20 text-signal animate-pulse' :
          state.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
          state.status === 'paused' ? 'bg-actor/20 text-actor' :
          'bg-ink-700 text-text-lo'
        }`}>
          {state.status}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Write Amplification Highlight Banner */}
        <div className="rounded-2xl border border-line bg-gradient-to-br from-ink-800 to-ink-900 p-3.5 shadow-sm">
          <div className="flex items-center justify-between mb-1 text-[11px]">
            <span className="text-text-lo font-semibold flex items-center gap-1">
              <TrendingUp size={13} className="text-actor" />
              Write Amplification
            </span>
            <span className="font-mono text-actor font-bold">
              1 ➔ {writeRatio} writes
            </span>
          </div>
          <div className="text-[10px] text-text-lo leading-relaxed">
            1 single social action produced <strong>{writeRatio}</strong> feed inbox insertions across the graph.
          </div>
        </div>

        {/* Current Simulation Stats */}
        <Panel className="bg-ink-900 border-none px-0 py-1">
          <h3 className="mb-3 text-[11px] font-semibold text-text-lo uppercase tracking-wider flex items-center justify-between">
            <span>Simulation Real-time</span>
            <Sparkles size={12} className="text-signal" />
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <StatCard 
              label="Notifs Sent" 
              value={state.stats.notificationsSent} 
              subtext="Total timeline writes" 
            />
            <StatCard 
              label="Followers Reached" 
              value={state.stats.activeRecipients} 
              subtext={`${coveragePercent}% of network`} 
            />
            <StatCard 
              label="Current Hop Level" 
              value={`Level ${state.stats.currentLevel}`} 
              subtext={state.stats.inTransitCount > 0 ? `${state.stats.inTransitCount} in transit` : "Wave settled"} 
            />
            <StatCard 
              label="Execution Time" 
              value={`${(state.stats.durationMs / 1000).toFixed(1)}s`} 
              subtext="Total propagation" 
            />
          </div>
        </Panel>

        <div className="h-px w-full bg-line" />

        {/* Network Topology Data */}
        <Panel className="bg-ink-900 border-none px-0 py-1">
          <h3 className="mb-3 text-[11px] font-semibold text-text-lo uppercase tracking-wider">
            Graph Topology
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Total Nodes" value={totalUsers} subtext="User accounts" />
            <StatCard label="Total Edges" value={totalConnections} subtext="Follow relationships" />
            <StatCard label="Avg Follow/User" value={(totalConnections * 2 / totalUsers).toFixed(1)} subtext="Network degree" />
            <StatCard label="Influencers" value="5 accounts" subtext="★ High degree" />
          </div>
        </Panel>

        {/* Export / Share Report */}
        <div className="mt-auto pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="w-full text-xs font-semibold"
          >
            {copied ? (
              <>
                <Check className="mr-1.5 h-3.5 w-3.5 text-signal" /> Report Exported!
              </>
            ) : (
              <>
                <Download className="mr-1.5 h-3.5 w-3.5" /> Export Simulation Report
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, subtext }: { label: string; value: string | number; subtext?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-ink-800 p-3 shadow-sm">
      <div className="text-[10px] text-text-lo uppercase font-semibold tracking-wide mb-1 truncate">{label}</div>
      <div className="font-display text-lg font-bold tabular-nums tracking-tight text-text-hi truncate">{value}</div>
      {subtext && <div className="text-[9px] text-text-lo mt-0.5 truncate">{subtext}</div>}
    </div>
  );
}
