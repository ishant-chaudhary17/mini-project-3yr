import { X, Crown, Radio, Bell, Users, CheckCircle, Sparkles, Send } from 'lucide-react';
import { NodeState, NotificationEvent, User } from '../types/graph';
import { Badge } from './ui/Badge';
import { Panel } from './ui/Panel';
import { Button } from './ui/Button';

interface UserDetailsProps {
  user: User | null;
  nodeState: NodeState | undefined;
  notifications: NotificationEvent[];
  allUsers: User[];
  onClose: () => void;
  onSetAsActor: (id: string) => void;
  onTriggerReaction?: (userId: string, type: 'like' | 'comment' | 'repost') => void;
}

export function UserDetails({ 
  user, 
  nodeState, 
  notifications, 
  allUsers, 
  onClose, 
  onSetAsActor,
  onTriggerReaction,
}: UserDetailsProps) {
  if (!user) return null;

  // Filter notifications received by this specific user
  const userNotifs = notifications.filter(n => n.target === user.id && n.level > 0);
  const isActor = nodeState?.status === 'actor';

  const getUser = (id: string) => allUsers.find(u => u.id === id);

  return (
    <div className="w-full lg:w-[320px] shrink-0 border-l border-line bg-ink-900 flex flex-col h-full overflow-y-auto hidden lg:flex hide-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line p-4 bg-ink-800/50">
        <h2 className="text-xs font-bold uppercase tracking-wider text-text-hi flex items-center gap-1.5">
          <Users size={14} className="text-signal" /> User Profile & Inbox
        </h2>
        <button 
          onClick={onClose} 
          className="rounded-lg p-1.5 text-text-lo hover:bg-ink-700 hover:text-text-hi transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* User Card */}
        <div className="rounded-2xl border border-line bg-ink-800 p-4 shadow-sm flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-signal to-teal-700 text-lg font-display font-bold text-ink-900 shadow-md">
                {user.avatar || user.name.substring(0, 2).toUpperCase()}
              </div>
              {user.isVerified && (
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-actor text-[10px] font-bold text-ink-900 shadow">
                  ★
                </span>
              )}
            </div>

            <div className="truncate flex-1">
              <div className="flex items-center gap-1 font-bold text-text-hi text-sm truncate">
                {user.name}
                {user.isVerified && <Crown size={12} className="text-actor" />}
              </div>
              <div className="text-xs text-text-lo font-mono">{user.username}</div>
              <div className="text-[10px] text-signal font-semibold mt-0.5">{user.role}</div>
            </div>
          </div>

          {user.bio && (
            <p className="text-xs text-text-lo italic bg-ink-900/60 p-2.5 rounded-xl border border-line/60">
              "{user.bio}"
            </p>
          )}

          <div className="grid grid-cols-2 gap-2 text-center pt-1 border-t border-line/60">
            <div className="bg-ink-900/40 p-2 rounded-xl">
              <div className="text-[10px] text-text-lo uppercase font-semibold">Followers</div>
              <div className="font-display text-base font-bold text-text-hi">{user.followersCount}</div>
            </div>
            <div className="bg-ink-900/40 p-2 rounded-xl">
              <div className="text-[10px] text-text-lo uppercase font-semibold">Following</div>
              <div className="font-display text-base font-bold text-text-hi">{user.followingCount}</div>
            </div>
          </div>

          {/* Quick set as broadcaster button */}
          {!isActor && (
            <div className="space-y-2 mt-1">
              {/* Interactive Follower Actions: Make this user work! */}
              <div className="rounded-xl border border-line bg-ink-900/60 p-2.5 space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-text-lo flex items-center justify-between">
                  <span>Put User to Work</span>
                  <span className="text-[9px] text-signal font-semibold">Active Signals</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => onTriggerReaction?.(user.id, 'like')}
                    className="rounded-lg border border-line bg-ink-800 py-1.5 text-[11px] font-bold text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all active:scale-95"
                    title="Send Like Reaction"
                  >
                    ❤️ Like
                  </button>
                  <button
                    onClick={() => onTriggerReaction?.(user.id, 'comment')}
                    className="rounded-lg border border-line bg-ink-800 py-1.5 text-[11px] font-bold text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all active:scale-95"
                    title="Send Comment"
                  >
                    💬 Reply
                  </button>
                  <button
                    onClick={() => onTriggerReaction?.(user.id, 'repost')}
                    className="rounded-lg border border-line bg-ink-800 py-1.5 text-[11px] font-bold text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all active:scale-95"
                    title="Reshare Post to this user's followers"
                  >
                    🔁 Reshare
                  </button>
                </div>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => onSetAsActor(user.id)}
                className="w-full text-xs font-semibold"
              >
                <Radio size={13} className="mr-1.5 text-actor" /> Broadcast From This User
              </Button>
            </div>
          )}
        </div>

        {/* Node Propagation Status */}
        <Panel>
          <h3 className="mb-2.5 text-xs font-semibold text-text-lo uppercase tracking-wider flex items-center justify-between">
            <span>Simulation State</span>
            {isActor && <Badge variant="actor">Broadcaster</Badge>}
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-line/60">
              <span className="text-text-lo">Propagation Status</span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                nodeState?.status === 'actor' ? 'bg-actor text-ink-900' :
                nodeState?.status === 'notified' ? 'bg-signal/20 text-signal' :
                nodeState?.status === 'processing' ? 'bg-signal text-ink-900 animate-pulse' :
                'bg-ink-700 text-text-lo'
              }`}>
                {nodeState?.status || 'Idle (Not Reached)'}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-1 border-b border-line/60">
              <span className="text-text-lo">Distance from Actor</span>
              <span className="font-mono text-xs font-bold text-text-hi">
                {nodeState?.level !== undefined ? `Level ${nodeState.level} Hop` : 'None'}
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-text-lo">Notifications Received</span>
              <span className="font-mono text-xs font-bold text-signal">
                {nodeState?.notificationCount || 0}
              </span>
            </div>
          </div>
        </Panel>

        {/* User's Personal Inbox */}
        <div className="rounded-2xl border border-line bg-ink-800 p-3.5 shadow-sm">
          <h3 className="mb-2.5 text-xs font-semibold text-text-lo uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Bell size={13} className="text-signal" /> Personal Notification Feed
            </span>
            <span className="text-[10px] text-text-lo font-mono">{userNotifs.length} items</span>
          </h3>

          <div className="space-y-2 max-h-56 overflow-y-auto hide-scrollbar">
            {userNotifs.length === 0 ? (
              <div className="py-4 text-center text-xs text-text-lo">
                {isActor 
                  ? "This user is the Broadcaster (source of fan-out)." 
                  : "No notifications received by this user yet."}
              </div>
            ) : (
              userNotifs.map(n => {
                const sender = getUser(n.source);
                return (
                  <div key={n.id} className="rounded-xl border border-line/80 bg-ink-900/80 p-2.5 text-xs">
                    <div className="flex items-center justify-between text-[10px] text-text-lo mb-1">
                      <span className="font-semibold text-signal">Level {n.level} Hop</span>
                      <span className="font-mono">{new Date(n.timestamp).toLocaleTimeString([], { second: '2-digit' })}</span>
                    </div>
                    <p className="text-[11px] text-text-hi leading-snug">
                      {n.message || `Notification from ${sender?.name}`}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
