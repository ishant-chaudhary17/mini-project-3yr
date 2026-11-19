import { useState } from 'react';
import { Smartphone, Bell, ChevronDown, ChevronUp, X, Sparkles, Send } from 'lucide-react';
import { NotificationEvent, User } from '../types/graph';
import { Badge } from './ui/Badge';

interface PhoneMockupProps {
  notifications: NotificationEvent[];
  users: User[];
  actorId: string | null;
  onSelectUser: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function PhoneMockup({ 
  notifications, 
  users, 
  actorId, 
  onSelectUser, 
  isOpen, 
  onToggle 
}: PhoneMockupProps) {
  const [filterLevel, setFilterLevel] = useState<number | 'all'>('all');

  const actor = users.find(u => u.id === actorId);
  const getUser = (id: string) => users.find(u => u.id === id);

  const filteredNotifs = filterLevel === 'all' 
    ? notifications.filter(n => n.level > 0) 
    : notifications.filter(n => n.level === filterLevel);

  return (
    <div className={`fixed bottom-4 left-4 z-40 transition-all duration-300 ${isOpen ? 'w-80 md:w-96' : 'w-auto'}`}>
      {!isOpen ? (
        <button
          onClick={onToggle}
          className="flex items-center gap-2.5 rounded-full bg-signal px-4 py-2.5 font-medium text-ink-900 shadow-lg shadow-signal/25 transition-all hover:bg-signal/90 hover:scale-105 active:scale-95"
          title="Open Live Follower Phone Mockup"
        >
          <Smartphone size={18} />
          <span className="text-xs font-semibold tracking-wide">Live Phone Feed</span>
          {notifications.length > 1 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-ink-900 px-1.5 text-[10px] font-bold text-signal">
              {notifications.length - 1}
            </span>
          )}
        </button>
      ) : (
        <div className="flex flex-col rounded-[24px] border border-line bg-ink-800 shadow-2xl backdrop-blur-md overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Phone Header / Dynamic Island */}
          <div className="flex items-center justify-between border-b border-line bg-ink-900/80 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-signal/15 text-signal">
                <Bell size={14} className="animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-text-hi">
                  SocialHub Mobile
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal animate-ping" />
                </div>
                <div className="text-[10px] text-text-lo">Simulated Lockscreen Push</div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={onToggle}
                className="rounded-lg p-1.5 text-text-lo hover:bg-ink-700 hover:text-text-hi"
                title="Minimize Phone"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Actor Quick Status Bar */}
          {actor && (
            <div className="flex items-center justify-between border-b border-line bg-ink-900/40 px-3.5 py-2 text-[11px]">
              <div className="flex items-center gap-1.5 truncate text-text-lo">
                <Send size={12} className="text-actor" />
                <span>Broadcaster:</span>
                <span className="font-semibold text-text-hi truncate">{actor.name}</span>
              </div>
              <Badge variant="actor" className="text-[9px] h-4 py-0 shrink-0">
                L0 Actor
              </Badge>
            </div>
          )}

          {/* Level Filter Tabs */}
          <div className="flex items-center gap-1 border-b border-line bg-ink-900/60 px-3 py-1.5 text-[10px]">
            <span className="text-text-lo mr-1 font-semibold">Filter:</span>
            {(['all', 1, 2, 3] as const).map(lvl => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`rounded px-2 py-0.5 font-medium transition-colors ${
                  filterLevel === lvl 
                    ? 'bg-signal text-ink-900 font-bold' 
                    : 'text-text-lo hover:text-text-hi hover:bg-ink-700'
                }`}
              >
                {lvl === 'all' ? 'All' : `L${lvl}`}
              </button>
            ))}
          </div>

          {/* Notifications Feed */}
          <div className="max-h-[360px] min-h-[180px] overflow-y-auto p-3 space-y-2.5 hide-scrollbar">
            {filteredNotifs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell size={28} className="text-text-lo/40 mb-2" />
                <p className="text-xs font-semibold text-text-hi">No notifications received yet</p>
                <p className="text-[11px] text-text-lo mt-1">
                  Trigger an action to see push notifications arrive on follower lockscreens!
                </p>
              </div>
            ) : (
              filteredNotifs.slice(0, 30).map(n => {
                const recipient = getUser(n.target);
                const sender = getUser(n.source);

                return (
                  <div
                    key={n.id}
                    onClick={() => onSelectUser(n.target)}
                    className="group relative cursor-pointer rounded-2xl border border-line bg-ink-900/90 p-3 shadow-md transition-all hover:border-signal/50 hover:bg-ink-700/60 hover:scale-[1.01]"
                  >
                    {/* Top Row: App info & Timestamp */}
                    <div className="flex items-center justify-between text-[10px] text-text-lo mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className="h-4 w-4 rounded-md bg-signal/20 text-signal flex items-center justify-center text-[9px] font-bold">
                          S
                        </div>
                        <span className="font-semibold uppercase tracking-wider text-text-hi">SocialHub</span>
                        <span>•</span>
                        <span>Level {n.level} Hop</span>
                      </div>
                      <span className="font-mono text-[9px]">
                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>

                    {/* Recipient User Header */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-signal/20 text-[10px] font-bold text-signal border border-signal/30">
                        {recipient?.avatar || 'U'}
                      </div>
                      <div className="truncate text-xs">
                        <span className="font-semibold text-text-hi">{recipient?.name || n.target}</span>
                        <span className="ml-1 text-[10px] text-text-lo">({recipient?.username})</span>
                      </div>
                    </div>

                    {/* Notification Content Body */}
                    <div className="rounded-xl bg-ink-800/80 p-2 text-xs text-text-hi border border-line/60">
                      <p className="line-clamp-2 text-[11px] leading-relaxed">
                        {n.message || `New ${n.action} from ${sender?.name || 'User'}`}
                      </p>
                    </div>

                    {/* Bottom Status pill */}
                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className="text-text-lo flex items-center gap-1">
                        <Sparkles size={11} className="text-signal" />
                        Pushed via BFS Fan-Out
                      </span>
                      <span className="text-signal font-semibold group-hover:underline">
                        View Node →
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Phone Footer */}
          <div className="border-t border-line bg-ink-900/90 px-4 py-2.5 text-center text-[10px] text-text-lo flex items-center justify-between">
            <span>{filteredNotifs.length} push notification(s) delivered</span>
            <span className="text-signal font-medium">Auto-synced</span>
          </div>
        </div>
      )}
    </div>
  );
}
