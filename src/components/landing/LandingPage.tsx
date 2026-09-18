import { Activity, ArrowRight, Github } from 'lucide-react';
import { HeroGraph } from './HeroGraph';
import { useTheme } from '../../hooks/useTheme';

export function LandingPage({ onLaunch }: { onLaunch: () => void }) {
  const { toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-ink-900 text-text-hi font-sans selection:bg-signal/30">
      <header className="flex h-16 items-center justify-between px-6 lg:px-12 border-b border-line">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal/10 text-signal">
            <Activity size={18} />
          </div>
          <span className="font-display text-sm font-semibold tracking-tight">fanout</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-text-lo hover:text-text-hi transition-colors">Docs</a>
          <button 
            onClick={onLaunch}
            className="text-sm font-medium text-text-hi flex items-center gap-2 hover:text-signal transition-colors group"
          >
            Open simulator <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 lg:py-24">
        <section className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
          <div className="flex-1 space-y-8">
            <h1 className="font-display font-bold leading-[0.95] tracking-tight" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
              One action.<br />
              Forty-seven<br />
              notifications.
            </h1>
            <p className="text-xl text-text-lo max-w-lg leading-relaxed">
              Watch a post travel through a social graph, edge by edge.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button 
                onClick={onLaunch}
                className="h-12 px-8 rounded-lg bg-text-hi text-ink-900 font-medium hover:opacity-90 transition-opacity"
              >
                Open simulator
              </button>
              <button 
                onClick={() => {
                  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }}
                className="h-12 px-8 rounded-lg border border-line bg-transparent hover:bg-ink-800 font-medium transition-colors"
              >
                Read how it works
              </button>
            </div>
          </div>
          <div className="flex-[1.2] w-full">
            <HeroGraph />
          </div>
        </section>

        <section className="mt-24 border-y border-line py-6 flex flex-wrap justify-between gap-6 font-mono text-sm text-text-lo uppercase tracking-wide">
          <div><span className="text-text-hi font-bold mr-2">50</span> users</div>
          <div><span className="text-text-hi font-bold mr-2">86</span> edges</div>
          <div className="text-signal font-bold">0 servers</div>
          <div className="text-signal font-bold">100% browser</div>
        </section>

        <section className="mt-24">
          <h2 className="font-display text-2xl font-bold mb-12">The Pipeline</h2>
          <div className="relative flex justify-between items-center w-full max-w-4xl mx-auto">
            {/* Track Line */}
            <div className="absolute left-0 right-0 h-px bg-line top-4 -z-10" />
            
            {[
              "User triggers action",
              "Graph inspected",
              "Recipients calculated",
              "Propagation starts",
              "Edges traversed",
              "Simulation completes"
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-3 bg-ink-900 px-2">
                <div className="w-8 h-8 rounded-full border-2 border-line bg-ink-800 flex items-center justify-center font-mono text-xs text-text-lo">{i+1}</div>
                <div className="text-sm font-medium text-text-hi text-center w-24">{step}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-32">
          <h2 className="font-display text-2xl font-bold mb-12">Three Strategies</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="border border-line rounded-[14px] p-6 bg-ink-800">
              <h3 className="font-semibold mb-2">Direct Fan-Out</h3>
              <p className="text-sm text-text-lo mb-6">Notify only immediate connections (Level 1).</p>
              <div className="h-40 bg-ink-900 rounded-lg border border-line flex items-center justify-center relative overflow-hidden">
                <div className="w-4 h-4 rounded-full bg-actor absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10" />
                <div className="w-16 h-16 rounded-full border-2 border-signal absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            <div className="border border-line rounded-[14px] p-6 bg-ink-800">
              <h3 className="font-semibold mb-2">Breadth-First</h3>
              <p className="text-sm text-text-lo mb-6">Process all reachable nodes level-by-level.</p>
              <div className="h-40 bg-ink-900 rounded-lg border border-line flex items-center justify-center relative overflow-hidden">
                <div className="w-4 h-4 rounded-full bg-actor absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10" />
                <div className="w-16 h-16 rounded-full border-2 border-signal absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                <div className="w-28 h-28 rounded-full border-2 border-depth-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                <div className="w-40 h-40 rounded-full border-2 border-depth-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            <div className="border border-line rounded-[14px] p-6 bg-ink-800">
              <h3 className="font-semibold mb-2">Depth-Limited</h3>
              <p className="text-sm text-text-lo mb-6">Cap the traversal at a specific connection distance.</p>
              <div className="h-40 bg-ink-900 rounded-lg border border-line flex items-center justify-center relative overflow-hidden">
                <div className="w-4 h-4 rounded-full bg-actor absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10" />
                <div className="w-16 h-16 rounded-full border-2 border-signal absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                <div className="w-28 h-28 rounded-full border-2 border-depth-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                <div className="w-40 h-40 rounded-full border-2 border-line border-dashed opacity-30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-32">
          <h2 className="font-display text-2xl font-bold mb-12">What you can do</h2>
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-6 max-w-4xl">
             <div className="flex items-start gap-4">
               <div className="w-1.5 h-1.5 rounded-full bg-signal mt-2" />
               <p className="text-text-lo">Switch propagation strategy mid-flight to compare algorithms.</p>
             </div>
             <div className="flex items-start gap-4">
               <div className="w-1.5 h-1.5 rounded-full bg-signal mt-2" />
               <p className="text-text-lo">Pause the simulation instantly and inspect node states.</p>
             </div>
             <div className="flex items-start gap-4">
               <div className="w-1.5 h-1.5 rounded-full bg-signal mt-2" />
               <p className="text-text-lo">Search through 50 mock users and trigger actions from any origin.</p>
             </div>
             <div className="flex items-start gap-4">
               <div className="w-1.5 h-1.5 rounded-full bg-signal mt-2" />
               <p className="text-text-lo">Drag and zoom the vector-based force-directed graph.</p>
             </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line mt-24 py-12 px-6 lg:px-12 bg-ink-800">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="max-w-md">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={16} className="text-signal" />
              <span className="font-display text-sm font-semibold">fanout</span>
            </div>
            <p className="text-xs text-text-lo leading-relaxed">
              This application is an educational browser-based simulation and does not represent a production notification infrastructure. Built for demonstration purposes.
            </p>
          </div>
          <div className="flex gap-4">
            <button onClick={toggleTheme} className="text-xs font-medium hover:text-signal transition-colors">
              Toggle Theme
            </button>
            <a href="https://github.com" className="text-xs font-medium hover:text-signal transition-colors flex items-center gap-1">
              <Github size={14} /> Repository
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
