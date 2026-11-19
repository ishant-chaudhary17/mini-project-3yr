import { Play, Pause, SkipForward, X, Sparkles, Radio, Zap, CheckCircle2 } from 'lucide-react';
import { DemoScenario } from '../hooks/useAutoDemo';

interface AutoDemoHUDProps {
  isActive: boolean;
  isPaused: boolean;
  currentScenario: DemoScenario;
  scenarioIndex: number;
  totalScenarios: number;
  phaseMessage: string;
  countdown: number | null;
  onPause: () => void;
  onResume: () => void;
  onNext: () => void;
  onStop: () => void;
}

export function AutoDemoHUD({
  isActive,
  isPaused,
  currentScenario,
  scenarioIndex,
  totalScenarios,
  phaseMessage,
  countdown,
  onPause,
  onResume,
  onNext,
  onStop,
}: AutoDemoHUDProps) {
  if (!isActive) return null;

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-2xl animate-in fade-in slide-in-from-top-4 duration-200">
      <div className="relative rounded-2xl border-2 border-signal/70 bg-ink-800/95 p-3.5 shadow-2xl backdrop-blur-md overflow-hidden">
        {/* Animated Glowing Top Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-actor via-signal to-depth-2 animate-[pulse_2s_infinite]" />

        <div className="flex flex-col gap-2">
          {/* Top Row: Title, Scenario Indicator & Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 items-center gap-1.5 rounded-full bg-signal px-2.5 text-[10px] font-black uppercase text-ink-900 tracking-wider shadow-sm">
                <Radio size={12} className="animate-pulse" />
                Live Auto-Demo
              </span>
              <span className="text-xs font-bold text-text-hi truncate">
                {currentScenario.title}
              </span>
            </div>

            {/* Scenario Step Dots & Actions */}
            <div className="flex items-center gap-2">
              {/* Dots */}
              <div className="flex items-center gap-1.5 mr-2">
                {Array.from({ length: totalScenarios }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-full transition-all ${
                      scenarioIndex === i 
                        ? 'w-5 bg-signal shadow-sm shadow-signal' 
                        : 'w-2 bg-line'
                    }`}
                  />
                ))}
              </div>

              {/* Pause / Resume */}
              <button
                onClick={isPaused ? onResume : onPause}
                className="rounded-lg p-1.5 text-text-lo hover:bg-ink-700 hover:text-text-hi transition-colors"
                title={isPaused ? "Resume Auto-Demo" : "Pause Auto-Demo"}
              >
                {isPaused ? <Play size={15} className="text-signal" /> : <Pause size={15} />}
              </button>

              {/* Next Scenario */}
              <button
                onClick={onNext}
                className="rounded-lg p-1.5 text-text-lo hover:bg-ink-700 hover:text-text-hi transition-colors"
                title="Next Showcase Scenario"
              >
                <SkipForward size={15} />
              </button>

              {/* Close / Stop */}
              <button
                onClick={onStop}
                className="rounded-lg p-1.5 text-text-lo hover:bg-ink-700 hover:text-text-hi transition-colors"
                title="Exit Auto-Demo Mode"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Scenario Description Subtitle */}
          <div className="text-[11px] text-text-lo line-clamp-1 italic">
            "{currentScenario.description}"
          </div>

          {/* Live Signal Flow Status Banner */}
          <div className="flex items-center justify-between rounded-xl bg-ink-900/90 px-3 py-2 text-xs border border-line/60">
            <div className="flex items-center gap-2 truncate">
              <div className="flex h-2 w-2 rounded-full bg-signal animate-ping" />
              <span className="font-medium text-text-hi truncate">
                {phaseMessage}
              </span>
            </div>

            {countdown !== null && countdown > 0 && (
              <span className="shrink-0 font-mono text-[10px] font-bold text-signal bg-signal/15 px-2 py-0.5 rounded-full ml-2">
                Next in {countdown}s ⏭
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
