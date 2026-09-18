import { Activity, Moon, Sun, MonitorPlay, HelpCircle } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { Badge } from './ui/Badge';

export function Header({ status }: { status: string }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-line bg-ink-900 px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal/10 text-signal">
          <Activity size={18} />
        </div>
        <div>
          <h1 className="font-display text-sm font-semibold tracking-tight text-text-hi flex items-center gap-2">
            Signal Console
            <Badge variant="default" className="text-[10px] h-5 py-0">v1.0</Badge>
          </h1>
          <p className="text-xs text-text-lo">Interactive browser-based notification propagation simulator</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 mr-4">
          <div className="h-2 w-2 rounded-full bg-signal animate-pulse" style={{ opacity: status === 'simulating' ? 1 : 0 }} />
          <span className="font-mono text-xs text-text-lo uppercase">{status}</span>
        </div>

        <button 
          title="Keyboard Shortcuts (?)"
          className="text-text-lo hover:text-text-hi transition-colors"
          onClick={() => alert("Shortcuts:\\nSpace: Trigger/Pause\\nR: Reset\\nF: Fit\\n/: Search\\nD: Theme\\n1,2,3: Depth\\nEsc: Clear")}
        >
          <HelpCircle size={18} />
        </button>
        
        <button
          onClick={toggleTheme}
          className="text-text-lo hover:text-text-hi transition-colors"
          title="Toggle theme (D)"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
