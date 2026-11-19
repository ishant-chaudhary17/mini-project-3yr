import { useState } from 'react';
import { X, Server, Database, Cpu, Radio, Zap, ArrowRight, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRecipients: number;
  totalNotifications: number;
}

export function ArchitectureModal({
  isOpen,
  onClose,
  activeRecipients,
  totalNotifications,
}: ArchitectureModalProps) {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'push_vs_pull' | 'celebrity'>('pipeline');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-line bg-ink-800 shadow-2xl p-6 flex flex-col gap-6 hide-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-signal/15 text-signal">
              <Layers size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-hi flex items-center gap-2">
                Distributed Notification Fan-Out Architecture
                <span className="rounded-full bg-signal/20 px-2 py-0.5 text-[10px] font-bold text-signal">
                  Production Design
                </span>
              </h2>
              <p className="text-xs text-text-lo">
                How modern platforms (Twitter / Instagram / LinkedIn) process real-time social graph fan-outs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-text-lo hover:bg-ink-700 hover:text-text-hi"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-line gap-2">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'pipeline'
                ? 'border-signal text-signal'
                : 'border-transparent text-text-lo hover:text-text-hi'
            }`}
          >
            1. Message Broker Pipeline
          </button>
          <button
            onClick={() => setActiveTab('push_vs_pull')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'push_vs_pull'
                ? 'border-signal text-signal'
                : 'border-transparent text-text-lo hover:text-text-hi'
            }`}
          >
            2. Fan-out on Write vs Read
          </button>
          <button
            onClick={() => setActiveTab('celebrity')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'celebrity'
                ? 'border-signal text-signal'
                : 'border-transparent text-text-lo hover:text-text-hi'
            }`}
          >
            3. The Celebrity Problem
          </button>
        </div>

        {/* Tab 1: Pipeline */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Step 1 */}
              <div className="rounded-2xl border border-line bg-ink-900 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-actor/15 text-actor font-bold text-xs">
                      1
                    </span>
                    <Radio size={16} className="text-actor animate-pulse" />
                  </div>
                  <h3 className="text-sm font-bold text-text-hi">Actor Action</h3>
                  <p className="text-xs text-text-lo mt-1">
                    User publishes a post or triggers a social interaction event via API.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-line/60 text-[11px] font-mono text-actor">
                  POST /api/simulate
                </div>
              </div>

              {/* Step 2 */}
              <div className="rounded-2xl border border-line bg-ink-900 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-signal/15 text-signal font-bold text-xs">
                      2
                    </span>
                    <Server size={16} className="text-signal" />
                  </div>
                  <h3 className="text-sm font-bold text-text-hi">Message Queue</h3>
                  <p className="text-xs text-text-lo mt-1">
                    Event is ingested into Kafka or Redis Pub/Sub topic to decouple producer from consumers.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-line/60 text-[11px] font-mono text-signal">
                  Kafka Topic: `fanout.events`
                </div>
              </div>

              {/* Step 3 */}
              <div className="rounded-2xl border border-line bg-ink-900 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-depth-2/15 text-depth-2 font-bold text-xs">
                      3
                    </span>
                    <Cpu size={16} className="text-depth-2" />
                  </div>
                  <h3 className="text-sm font-bold text-text-hi">BFS Fan-out Workers</h3>
                  <p className="text-xs text-text-lo mt-1">
                    Worker cluster pulls follower IDs from Social Graph Database (Neo4j / Redis Sets) level-by-level.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-line/60 text-[11px] font-mono text-depth-2">
                  BFS Traversal: O(V + E)
                </div>
              </div>

              {/* Step 4 */}
              <div className="rounded-2xl border border-line bg-ink-900 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-depth-3/15 text-depth-3 font-bold text-xs">
                      4
                    </span>
                    <Database size={16} className="text-depth-3" />
                  </div>
                  <h3 className="text-sm font-bold text-text-hi">Timeline & Push</h3>
                  <p className="text-xs text-text-lo mt-1">
                    Inserts post ID into each follower's timeline Redis cache and triggers APNs/FCM push notifications.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-line/60 text-[11px] font-mono text-depth-3">
                  Redis `LPUSH` + WebSocket Push
                </div>
              </div>
            </div>

            {/* Live Metrics Banner */}
            <div className="rounded-2xl border border-signal/30 bg-signal/5 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="text-signal h-5 w-5" />
                <div>
                  <div className="text-xs font-bold text-text-hi">Current Simulation Pipeline Metrics</div>
                  <div className="text-[11px] text-text-lo">
                    Generated from the active graph simulation in memory
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6 text-right">
                <div>
                  <div className="text-[10px] text-text-lo uppercase font-semibold">Write Amplification</div>
                  <div className="font-mono text-lg font-bold text-signal">
                    1 : {totalNotifications || 0}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-text-lo uppercase font-semibold">Nodes Ingested</div>
                  <div className="font-mono text-lg font-bold text-text-hi">
                    {activeRecipients || 0} Followers
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Push vs Pull */}
        {activeTab === 'push_vs_pull' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fan-out on Write */}
              <div className="rounded-2xl border border-signal/30 bg-ink-900 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="rounded-md bg-signal/20 px-2 py-0.5 text-xs font-bold text-signal">
                    Push Model
                  </span>
                  <h3 className="text-sm font-bold text-text-hi">Fan-out on Write (Implemented in this project)</h3>
                </div>
                <p className="text-xs text-text-lo leading-relaxed mb-4">
                  When user creates a post, the system immediately finds all followers via BFS and writes the notification into each follower's timeline inbox cache.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-signal">
                    <CheckCircle2 size={14} /> Fast read speed — timeline loads instantly in $O(1)$ time.
                  </div>
                  <div className="flex items-center gap-2 text-signal">
                    <CheckCircle2 size={14} /> Notifications are delivered in real-time via websockets.
                  </div>
                  <div className="flex items-center gap-2 text-depth-3">
                    <AlertTriangle size={14} /> High write amplification for users with millions of followers.
                  </div>
                </div>
              </div>

              {/* Fan-out on Read */}
              <div className="rounded-2xl border border-depth-2/30 bg-ink-900 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="rounded-md bg-depth-2/20 px-2 py-0.5 text-xs font-bold text-depth-2">
                    Pull Model
                  </span>
                  <h3 className="text-sm font-bold text-text-hi">Fan-out on Read</h3>
                </div>
                <p className="text-xs text-text-lo leading-relaxed mb-4">
                  Nothing happens at write time! When a follower opens their app, their feed is dynamically generated by querying all accounts they follow and merging recent posts.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-signal">
                    <CheckCircle2 size={14} /> Zero write amplification — post creation is instant $O(1)$.
                  </div>
                  <div className="flex items-center gap-2 text-depth-3">
                    <AlertTriangle size={14} /> Slow feed load — reading timeline takes $O(K \log K)$ merge time.
                  </div>
                  <div className="flex items-center gap-2 text-depth-3">
                    <AlertTriangle size={14} /> Wasteful queries for inactive users who never log in.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: The Celebrity Problem */}
        {activeTab === 'celebrity' && (
          <div className="rounded-2xl border border-actor/30 bg-ink-900 p-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">👑</span>
              <div>
                <h3 className="text-sm font-bold text-text-hi">
                  The Celebrity Fan-out Dilemma (Twitter / Instagram Architecture)
                </h3>
                <p className="text-xs text-text-lo">
                  Why pure push breaks down at scale, and how hybrid systems solve it.
                </p>
              </div>
            </div>

            <p className="text-xs text-text-lo leading-relaxed">
              If an influencer (e.g. Cristiano Ronaldo with 100M+ followers) publishes a post using pure fan-out on write, the system must write 100,000,000 timeline records within seconds. This would crash Redis clusters and overload message broker queues.
            </p>

            <div className="rounded-xl border border-line bg-ink-800 p-4">
              <div className="text-xs font-bold text-actor mb-2 flex items-center gap-2">
                <Zap size={14} /> The Industry Hybrid Solution:
              </div>
              <ul className="text-xs text-text-lo space-y-2 list-disc list-inside">
                <li><strong className="text-text-hi">Regular Users (e.g. &lt; 25,000 followers):</strong> Use Fan-out on Write (Push) for instant notifications and zero feed latency.</li>
                <li><strong className="text-text-hi">Celebrities / High-Degree Nodes (&gt; 25,000 followers):</strong> Do NOT fan out on write. Instead, when a follower loads their feed, the system dynamically merges the celebrity's recent post into their view.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-line pt-4 text-xs text-text-lo">
          <span>Mini Project 3rd Year • Distributed Social Graph Engineering</span>
          <button
            onClick={onClose}
            className="rounded-xl bg-signal px-4 py-2 font-semibold text-ink-900 hover:bg-signal/90"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
