import { useState, useMemo } from 'react';
import { 
  X, 
  Radio, 
  Activity, 
  Crown, 
  Send, 
  RefreshCw, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Share2, 
  Heart, 
  MessageSquare,
  Users,
  Cpu
} from 'lucide-react';
import { Edge, NodeState, NotificationEvent, User } from '../types/graph';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface NetworkManagerHubProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  edges: Edge[];
  nodeStates: Record<string, NodeState>;
  notifications: NotificationEvent[];
  onSelectUser: (id: string) => void;
  onTriggerReaction: (userId: string, type: 'like' | 'comment' | 'repost') => void;
  onSetAsActor: (id: string) => void;
}

export function NetworkManagerHub({
  isOpen,
  onClose,
  users,
  edges,
  nodeStates,
  notifications,
  onSelectUser,
  onTriggerReaction,
  onSetAsActor,
}: NetworkManagerHubProps) {
  // Top influencers with highest degree
  const influencers = useMemo(() => {
    return users
      .filter(u => u.isVerified || u.followersCount >= 8)
      .sort((a, b) => b.followersCount - a.followersCount);
  }, [users]);

  const [selectedInfluencerId, setSelectedInfluencerId] = useState<string>(
    influencers[0]?.id || 'u02'
  );

  const selectedInfluencer = users.find(u => u.id === selectedInfluencerId);

  // Find all managers and members connected directly to this influencer
  const connectedNodes = useMemo(() => {
    if (!selectedInfluencerId) return [];
    const connectedIds = new Set<string>();
    edges.forEach(e => {
      if (e.source === selectedInfluencerId) connectedIds.add(e.target);
      if (e.target === selectedInfluencerId) connectedIds.add(e.source);
    });

    return Array.from(connectedIds)
      .map(id => users.find(u => u.id === id))
      .filter((u): u is User => u !== undefined)
      .sort((a, b) => {
        // Prioritize Network Managers first, then Tech Leads, then others
        if (a.role === 'Network Manager') return -1;
        if (b.role === 'Network Manager') return 1;
        return b.followersCount - a.followersCount;
      });
  }, [selectedInfluencerId, edges, users]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-3xl border border-line bg-ink-800 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line bg-ink-900/90 p-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-signal/15 text-signal border border-signal/30 shadow-sm">
              <Radio size={22} className="animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-hi flex items-center gap-2">
                Influencer & Connected Network Manager Activity Hub
                <span className="rounded-full bg-signal/20 px-2 py-0.5 text-[10px] font-bold text-signal">
                  Cluster Live Traffic
                </span>
              </h2>
              <p className="text-xs text-text-lo">
                Real-time monitoring of network managers and relays connected to core influencers
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-text-lo hover:bg-ink-700 hover:text-text-hi transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
          {/* Left Column: Influencer Selector & Cluster Summary */}
          <div className="w-full md:w-80 shrink-0 border-r border-line bg-ink-900/50 p-4 overflow-y-auto hide-scrollbar space-y-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-text-lo block mb-2">
                Select Core Influencer
              </label>
              <div className="space-y-2">
                {influencers.map(inf => {
                  const isSelected = inf.id === selectedInfluencerId;
                  const ns = nodeStates[inf.id];
                  return (
                    <div
                      key={inf.id}
                      onClick={() => setSelectedInfluencerId(inf.id)}
                      className={`cursor-pointer rounded-2xl border p-3 transition-all ${
                        isSelected
                          ? 'border-actor bg-actor/10 shadow-md'
                          : 'border-line/70 bg-ink-900/60 hover:border-line hover:bg-ink-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 truncate">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-actor/20 text-xs font-bold text-actor border border-actor/30">
                            {inf.avatar}
                          </div>
                          <div className="truncate">
                            <div className="text-xs font-bold text-text-hi flex items-center gap-1 truncate">
                              {inf.name}
                              <Crown size={11} className="text-actor shrink-0" />
                            </div>
                            <div className="text-[10px] text-text-lo font-mono">{inf.username}</div>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono font-bold text-text-lo shrink-0 bg-ink-800 px-2 py-0.5 rounded-full border border-line">
                          {inf.followersCount} conns
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Influencer Stats Card */}
            {selectedInfluencer && (
              <div className="rounded-2xl border border-line bg-ink-900 p-3.5 space-y-2 text-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-text-lo">
                  Cluster Architecture
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-text-lo">Broadcaster:</span>
                  <span className="font-bold text-text-hi">{selectedInfluencer.name}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-text-lo">Connected Managers:</span>
                  <span className="font-bold text-signal">
                    {connectedNodes.filter(n => n.role === 'Network Manager').length} Managers
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-text-lo">Total Reach Capacity:</span>
                  <span className="font-bold text-actor">
                    {connectedNodes.reduce((acc, curr) => acc + curr.followersCount, 0)} downstream nodes
                  </span>
                </div>

                <div className="pt-2 border-t border-line/60">
                  <Button
                    size="sm"
                    className="w-full text-xs font-bold"
                    onClick={() => {
                      onSetAsActor(selectedInfluencer.id);
                      onClose();
                    }}
                  >
                    <Send size={13} className="mr-1.5" /> Broadcast From {selectedInfluencer.name.split(' ')[0]}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Connected Managers & Activity Stream */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-ink-800/40 hide-scrollbar">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-text-hi flex items-center gap-2">
                  <span>Connected Managers & Nodes ({connectedNodes.length})</span>
                  <span className="text-[10px] font-semibold text-signal bg-signal/15 px-2 py-0.5 rounded-full">
                    Live Status
                  </span>
                </h3>
                <p className="text-xs text-text-lo">
                  Active relays connected to {selectedInfluencer?.name} ready to receive and reshare signals
                </p>
              </div>
            </div>

            {/* Cards Grid of Connected Network Managers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
              {connectedNodes.map(node => {
                const ns = nodeStates[node.id];
                const isManager = node.role === 'Network Manager';
                const isTechLead = node.role === 'Tech Lead' || node.role === 'DevOps Eng';

                // Find recent notifications involving this node
                const recentNotifs = notifications.filter(
                  n => n.source === node.id || n.target === node.id
                );

                return (
                  <div
                    key={node.id}
                    className={`rounded-2xl border p-3.5 transition-all flex flex-col justify-between ${
                      isManager
                        ? 'border-signal/50 bg-gradient-to-br from-ink-900 to-ink-800 shadow-md'
                        : 'border-line bg-ink-900/80 hover:border-line/90'
                    }`}
                  >
                    {/* Top Row: User Avatar, Name & Role */}
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold border ${
                            isManager 
                              ? 'bg-signal/20 text-signal border-signal/40 shadow-sm' 
                              : 'bg-ink-700 text-text-hi border-line'
                          }`}>
                            {node.avatar}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-text-hi flex items-center gap-1.5">
                              {node.name}
                              {node.isVerified && <Crown size={11} className="text-actor" />}
                            </div>
                            <div className="text-[10px] text-text-lo font-mono">{node.username}</div>
                          </div>
                        </div>

                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                          isManager 
                            ? 'bg-signal text-ink-900' 
                            : isTechLead
                            ? 'bg-depth-2/20 text-depth-2'
                            : 'bg-ink-700 text-text-lo'
                        }`}>
                          {isManager && <Radio size={10} />}
                          {node.role}
                        </span>
                      </div>

                      {/* Bio / Responsibility */}
                      {node.bio && (
                        <p className="text-[11px] text-text-lo italic line-clamp-1 mb-2.5">
                          "{node.bio}"
                        </p>
                      )}

                      {/* Live Network Activity Status Box */}
                      <div className="rounded-xl border border-line/60 bg-ink-900/60 p-2.5 space-y-1.5 text-xs mb-3">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-text-lo flex items-center gap-1">
                            <Activity size={12} className="text-signal" />
                            Relay State:
                          </span>
                          <span className={`font-bold uppercase ${
                            ns?.status === 'resharing' ? 'text-emerald-400 animate-pulse' :
                            ns?.status === 'reacting' ? 'text-actor' :
                            ns?.status === 'notified' ? 'text-signal' :
                            'text-text-lo'
                          }`}>
                            {ns?.status === 'resharing' ? '🔁 Resharing Active' :
                             ns?.status === 'reacting' ? '⚡ Reacting' :
                             ns?.status === 'notified' ? `📥 Ingested (L${ns.level})` :
                             '🟢 Standing By'}
                          </span>
                        </div>

                        {/* Recent Activity Output */}
                        <div className="text-[11px] text-text-hi bg-ink-800/80 p-1.5 rounded-lg border border-line/40 truncate">
                          {ns?.reaction ? (
                            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold truncate">
                              <span>{ns.reaction.emoji}</span>
                              <span className="truncate">{ns.reaction.comment || 'Echoed signal to network'}</span>
                            </span>
                          ) : recentNotifs.length > 0 ? (
                            <span className="text-text-lo truncate">
                              Last event: {recentNotifs[0].message || 'Packet transferred'}
                            </span>
                          ) : (
                            <span className="text-text-lo">
                              Buffer idle • Ready to route {node.followersCount} downstream edges
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Bar: Put Manager to Work */}
                    <div className="pt-2 border-t border-line/60 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onTriggerReaction(node.id, 'like')}
                          className="px-2 py-1 rounded-lg bg-ink-800 hover:bg-rose-500/10 hover:text-rose-400 text-text-lo text-[10px] font-bold border border-line transition-all active:scale-95 flex items-center gap-1"
                          title="Send Like Signal"
                        >
                          <Heart size={11} className="text-rose-400" /> Like
                        </button>
                        <button
                          onClick={() => onTriggerReaction(node.id, 'repost')}
                          className="px-2 py-1 rounded-lg bg-ink-800 hover:bg-emerald-500/10 hover:text-emerald-400 text-text-lo text-[10px] font-bold border border-line transition-all active:scale-95 flex items-center gap-1"
                          title="Trigger Reshare / Outgoing Signal Wave"
                        >
                          <Share2 size={11} className="text-emerald-400" /> Reshare
                        </button>
                        <button
                          onClick={() => onTriggerReaction(node.id, 'comment')}
                          className="px-2 py-1 rounded-lg bg-ink-800 hover:bg-blue-500/10 hover:text-blue-400 text-text-lo text-[10px] font-bold border border-line transition-all active:scale-95 flex items-center gap-1"
                          title="Send Comment"
                        >
                          <MessageSquare size={11} className="text-blue-400" /> Reply
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          onSelectUser(node.id);
                          onClose();
                        }}
                        className="text-[10px] font-semibold text-signal hover:underline shrink-0"
                      >
                        Inspect Node →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-line bg-ink-900 p-3.5 px-6 flex items-center justify-between text-xs text-text-lo">
          <span>
            Displaying cluster connections for <strong className="text-text-hi">{selectedInfluencer?.name}</strong> • High Write Amplification Zone
          </span>
          <button
            onClick={onClose}
            className="rounded-xl bg-signal px-4 py-1.5 font-bold text-ink-900 hover:bg-signal/90"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
