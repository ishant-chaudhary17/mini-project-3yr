import { X } from 'lucide-react';
import { NodeState, User } from '../types/graph';
import { Badge } from './ui/Badge';
import { Panel } from './ui/Panel';

interface UserDetailsProps {
  user: User | null;
  nodeState: NodeState | undefined;
  onClose: () => void;
}

export function UserDetails({ user, nodeState, onClose }: UserDetailsProps) {
  if (!user) return null;

  return (
    <div className="w-full lg:w-[340px] shrink-0 border-l border-line bg-ink-900 flex flex-col h-full overflow-y-auto hidden lg:flex">
      <div className="flex items-center justify-between border-b border-line p-4">
        <h2 className="text-sm font-semibold text-text-hi">Node Details</h2>
        <button onClick={onClose} className="text-text-lo hover:text-text-hi">
          <X size={18} />
        </button>
      </div>

      <div className="p-4 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink-700 text-xl font-display font-bold text-text-hi border-2 border-line">
            {user.avatar}
          </div>
          <div>
            <div className="font-semibold text-text-hi text-lg">{user.name}</div>
            <div className="text-sm text-text-lo font-mono">{user.username}</div>
            <div className="text-xs text-text-lo font-mono mt-1 opacity-50">{user.id}</div>
          </div>
        </div>

        <Panel>
          <h3 className="mb-3 text-xs font-semibold text-text-lo uppercase tracking-wider">Network</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-text-lo mb-1">Followers</div>
              <div className="font-display text-xl font-bold tabular-nums tracking-tight">{user.followersCount}</div>
            </div>
            <div>
              <div className="text-xs text-text-lo mb-1">Following</div>
              <div className="font-display text-xl font-bold tabular-nums tracking-tight">{user.followingCount}</div>
            </div>
          </div>
        </Panel>

        <Panel>
          <h3 className="mb-3 text-xs font-semibold text-text-lo uppercase tracking-wider">Simulation State</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-lo">Status</span>
              {nodeState ? (
                <Badge 
                  variant={
                    nodeState.status === 'actor' ? 'actor' : 
                    nodeState.status === 'notified' ? 'signal' : 
                    nodeState.status === 'processing' ? 'default' : 'default'
                  }
                  className="capitalize"
                >
                  {nodeState.status}
                </Badge>
              ) : (
                <Badge variant="default">Idle</Badge>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-lo">Propagation Level</span>
              <span className="font-mono text-sm">
                {nodeState?.level !== undefined ? nodeState.level : '-'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-text-lo">Notifications Received</span>
              <span className="font-mono text-sm font-bold text-text-hi">
                {nodeState?.notificationCount || 0}
              </span>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
