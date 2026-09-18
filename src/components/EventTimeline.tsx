import { useEffect, useRef } from 'react';
import { NotificationEvent, User } from '../types/graph';
import { Badge } from './ui/Badge';
import { EmptyState } from './ui/EmptyState';

interface EventTimelineProps {
  events: NotificationEvent[];
  users: User[];
}

export function EventTimeline({ events, users }: EventTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to right when new events arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0; // events are unshifted, so newest is at left
    }
  }, [events]);

  if (events.length === 0) {
    return (
      <div className="h-[168px] border-t border-line bg-ink-900 flex items-center justify-center shrink-0 w-full overflow-hidden">
        <EmptyState 
          title="Timeline Empty" 
          description="Trigger an action to see events populate here."
        />
      </div>
    );
  }

  const getUserName = (id: string) => users.find(u => u.id === id)?.name || id;

  return (
    <div className="h-[168px] border-t border-line bg-ink-900 flex flex-col shrink-0 w-full overflow-hidden">
      <div className="px-6 py-2 border-b border-line flex justify-between items-center bg-ink-800">
        <h2 className="text-xs font-semibold text-text-lo uppercase tracking-wider">Event Timeline</h2>
        <span className="text-xs text-text-lo font-mono">{events.length} events</span>
      </div>
      <div 
        ref={scrollRef}
        className="flex-1 overflow-x-auto overflow-y-hidden flex items-center px-6 gap-3 hide-scrollbar"
      >
        {events.map((ev, i) => (
          <div key={ev.id} className="flex-shrink-0 w-64 border border-line rounded-[14px] bg-ink-800 p-3 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono text-[10px] text-text-lo">
                {new Date(ev.timestamp).toISOString().substring(11, 19)}
              </span>
              <Badge variant={ev.level === 0 ? 'actor' : 'default'} className="text-[10px] h-5 px-1.5 py-0">
                LEVEL {ev.level}
              </Badge>
            </div>
            <div className="font-mono text-xs text-signal mb-1">
              {ev.level === 0 ? 'ACTION_TRIGGERED' : 'NOTIFICATION_SENT'}
            </div>
            <div className="text-xs text-text-hi truncate">
              <span className="font-medium">{getUserName(ev.source)}</span>
              {ev.level > 0 && (
                <>
                  <span className="text-text-lo mx-1">→</span>
                  <span className="font-medium">{getUserName(ev.target)}</span>
                </>
              )}
            </div>
            <div className="text-[10px] text-text-lo mt-1 uppercase">
              Action: {ev.action}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
