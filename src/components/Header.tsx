import { useState } from 'react';
import { 
  Activity, 
  Moon, 
  Sun, 
  Layers, 
  GraduationCap, 
  Smartphone, 
  Volume2, 
  VolumeX, 
  Sparkles,
  Radio
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { sound } from '../utils/sound';
import { Badge } from './ui/Badge';

interface HeaderProps {
  status: string;
  onOpenArchitecture: () => void;
  onOpenViva: () => void;
  onOpenNetworkManagers: () => void;
  onTogglePhone: () => void;
  isPhoneOpen: boolean;
  isAutoDemoActive: boolean;
  onToggleAutoDemo: () => void;
}

export function Header({ 
  status, 
  onOpenArchitecture, 
  onOpenViva, 
  onOpenNetworkManagers,
  onTogglePhone,
  isPhoneOpen,
  isAutoDemoActive,
  onToggleAutoDemo,
}: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();
  const [soundEnabled, setSoundEnabled] = useState(sound.isEnabled());

  const handleToggleSound = () => {
    const next = !soundEnabled;
    sound.setEnabled(next);
    setSoundEnabled(next);
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-line bg-ink-900 px-4 md:px-6 z-20">
      {/* Brand & Project Info */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-signal/15 text-signal shadow-sm border border-signal/20">
          <Activity size={20} className={status === 'simulating' ? 'animate-pulse' : ''} />
        </div>
        <div>
          <h1 className="font-display text-sm md:text-base font-bold tracking-tight text-text-hi flex items-center gap-2">
            Social Graph & Notification Fan-Out Visualizer
            <Badge variant="signal" className="text-[9px] h-4.5 px-2 py-0 hidden sm:inline-flex">
              3rd Year Mini Project
            </Badge>
          </h1>
          <p className="text-[11px] text-text-lo hidden sm:block">
            BFS-based social network notification propagation & distributed write amplification simulator
          </p>
        </div>
      </div>

      {/* Right Controls & Feature Triggers */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* ✨ Auto-Demo Showcase Button */}
        <button
          onClick={onToggleAutoDemo}
          className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all shadow-sm ${
            isAutoDemoActive 
              ? 'border-signal bg-signal text-ink-900 shadow-signal/30' 
              : 'border-signal/60 bg-signal/15 text-signal hover:bg-signal/25 hover:border-signal'
          }`}
          title="Start Autonomous Guided Demonstration"
        >
          <Sparkles size={15} className={isAutoDemoActive ? 'animate-spin' : ''} />
          <span>{isAutoDemoActive ? 'Demo Active' : 'Auto Demo'}</span>
        </button>

        {/* Live Follower Phone Feed Toggle */}
        <button
          onClick={onTogglePhone}
          className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
            isPhoneOpen 
              ? 'border-signal bg-signal/15 text-signal' 
              : 'border-line bg-ink-800 text-text-lo hover:text-text-hi hover:bg-ink-700'
          }`}
          title="Toggle Mobile Push Notification View"
        >
          <Smartphone size={15} />
          <span className="hidden md:inline">Phone Feed</span>
        </button>

        {/* Network Managers Activity Hub Button */}
        <button
          onClick={onOpenNetworkManagers}
          className="flex items-center gap-1.5 rounded-xl border border-line bg-ink-800 px-3 py-1.5 text-xs font-semibold text-text-lo hover:text-text-hi hover:bg-ink-700 transition-all hover:border-signal/50"
          title="Show Activity of Network Managers Connected to Influencers"
        >
          <Radio size={15} className="text-signal animate-pulse" />
          <span className="hidden lg:inline">Network Managers</span>
        </button>

        {/* System Architecture Button */}
        <button
          onClick={onOpenArchitecture}
          className="flex items-center gap-1.5 rounded-xl border border-line bg-ink-800 px-3 py-1.5 text-xs font-semibold text-text-lo hover:text-text-hi hover:bg-ink-700 transition-all"
          title="Open Distributed Architecture & Broker Pipeline"
        >
          <Layers size={15} className="text-depth-2" />
          <span className="hidden md:inline">Architecture</span>
        </button>

        {/* Viva Guide Button */}
        <button
          onClick={onOpenViva}
          className="flex items-center gap-1.5 rounded-xl border border-line bg-ink-800 px-3 py-1.5 text-xs font-semibold text-actor hover:bg-actor/15 hover:border-actor/40 transition-all"
          title="Open Mini Project Viva & Concept Guide"
        >
          <GraduationCap size={16} />
          <span className="hidden md:inline">Viva Guide</span>
        </button>

        {/* Sound Toggle */}
        <button
          onClick={handleToggleSound}
          className="rounded-xl border border-line bg-ink-800 p-2 text-text-lo hover:text-text-hi hover:bg-ink-700 transition-colors"
          title={soundEnabled ? "Mute audio effects" : "Enable audio effects"}
        >
          {soundEnabled ? <Volume2 size={16} className="text-signal" /> : <VolumeX size={16} />}
        </button>

        {/* Dark/Light Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-xl border border-line bg-ink-800 p-2 text-text-lo hover:text-text-hi hover:bg-ink-700 transition-colors"
          title="Toggle Dark / Light Theme"
        >
          {isDark ? <Sun size={16} className="text-actor" /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
