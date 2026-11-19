import { useState } from 'react';
import { X, GraduationCap, CheckCircle, BookOpen, HelpCircle } from 'lucide-react';

interface VivaGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VivaGuideModal({ isOpen, onClose }: VivaGuideModalProps) {
  const [selectedTopic, setSelectedTopic] = useState<number>(0);

  if (!isOpen) return null;

  const vivaTopics = [
    {
      q: "Why use Breadth-First Search (BFS) for notification fan-out?",
      a: "BFS explores vertices level-by-level in concentric rings of shortest path distance. In a social network, notifications naturally ripple outward: first to direct followers (Level 1), then to mutual/second-degree connections (Level 2), and so on. BFS guarantees that nearer nodes are processed before distant nodes, modeling real-world viral content propagation."
    },
    {
      q: "What is the Time and Space Complexity of BFS in this project?",
      a: "Time Complexity: O(V + E), where V is the number of users (vertices) reached, and E is the number of follow edges traversed. In the worst case, every node and edge is examined once. Space Complexity: O(V) to store the BFS FIFO queue and the visited set to prevent infinite cycles."
    },
    {
      q: "What is Write Amplification in social networks?",
      a: "Write Amplification is the ratio of system writes triggered per single user action. If John Carter (@johnc) has 10 followers and posts 1 photo, the system must write 10 inbox records. For a celebrity with 10M followers, 1 post causes 10,000,000 writes. This project lets you measure write amplification in real-time."
    },
    {
      q: "What is the difference between Fan-out on Write vs Fan-out on Read?",
      a: "Fan-out on Write (Push): When a post is created, the system immediately pre-inserts it into all followers' feeds. Feeds are blazing fast to read (O(1)), but writing is heavy. Fan-out on Read (Pull): Post is only saved once. Followers assemble their feed on-demand when opening the app. Writing is O(1), but reading is slower (O(K log K))."
    },
    {
      q: "How do Twitter and Instagram handle celebrity accounts?",
      a: "They use a Hybrid Push/Pull model: 1) Normal users use Fan-out on Write (push). 2) Celebrities (with >25,000 followers) do NOT fan out on write. Instead, their posts are merged dynamically on read when their followers open the timeline. This prevents Redis queue crashes."
    },
    {
      q: "How does this system prevent duplicate notifications (cycles in the graph)?",
      a: "We maintain a 'visited' Hash Set of user IDs. Before enqueueing a follower's connections into the next BFS level, we check if they are already in the visited set. If yes, the edge is ignored, preventing infinite loops in cyclic social graphs."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-line bg-ink-800 shadow-2xl p-6 flex flex-col gap-6 hide-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-actor/15 text-actor">
              <GraduationCap size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-hi flex items-center gap-2">
                Project Viva & Evaluation Guide
                <span className="rounded-full bg-actor/20 px-2 py-0.5 text-[10px] font-bold text-actor">
                  3rd Year Mini Project
                </span>
              </h2>
              <p className="text-xs text-text-lo">
                Essential questions, answers, and conceptual talking points for internal/external examiners
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

        {/* Content list */}
        <div className="space-y-3">
          {vivaTopics.map((topic, i) => (
            <div
              key={i}
              onClick={() => setSelectedTopic(i)}
              className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                selectedTopic === i
                  ? 'border-actor/60 bg-ink-900 shadow-md'
                  : 'border-line/70 bg-ink-900/50 hover:bg-ink-900 hover:border-line'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                  selectedTopic === i ? 'bg-actor text-ink-900' : 'bg-ink-700 text-text-lo'
                }`}>
                  {i + 1}
                </span>
                <div className="flex-1">
                  <h3 className={`text-sm font-bold ${
                    selectedTopic === i ? 'text-actor' : 'text-text-hi'
                  }`}>
                    {topic.q}
                  </h3>
                  {selectedTopic === i && (
                    <div className="mt-3 pt-3 border-t border-line/60 text-xs text-text-lo leading-relaxed animate-in fade-in duration-200">
                      <p>{topic.a}</p>
                      <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-signal">
                        <CheckCircle size={13} /> Key examiner highlight
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Tips */}
        <div className="rounded-2xl border border-line bg-ink-900/60 p-4 text-xs text-text-lo flex items-center gap-3">
          <BookOpen className="text-signal h-5 w-5 shrink-0" />
          <div>
            <span className="font-bold text-text-hi">Pro Demo Tip:</span> Use the <span className="font-semibold text-signal">"Step Mode"</span> during your viva presentation to step through each BFS level one hop at a time while explaining the code to your examiner!
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-line pt-4">
          <button
            onClick={onClose}
            className="rounded-xl bg-actor px-5 py-2 text-xs font-bold text-ink-900 hover:bg-actor/90"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
}
