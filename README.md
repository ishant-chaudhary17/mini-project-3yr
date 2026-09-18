# Social Graph & Notification Fan-Out Visualizer

![Landing Page Placeholder](https://via.placeholder.com/800x400?text=Landing+Page+Screenshot)
![Dashboard Placeholder](https://via.placeholder.com/800x400?text=Dashboard+Screenshot)

## Description

A visual exploration of a social graph using a bundled dataset where triggering an action such as Post, Like, or Follow animates a simulated notification fan-out across connected users/nodes. This is an educational and interactive browser-based simulation demonstrating network graph traversal algorithms (Breadth-First Search).

## Features

- **Interactive SVG Graph**: Force-directed layout pre-computed using Fruchterman-Reingold algorithm. Pan, zoom, and drag capabilities.
- **Simulation Engine**: Real-time visualization of notification propagation.
- **Three Strategies**: 
  - Direct Fan-Out
  - Breadth-First (BFS)
  - Depth-Limited
- **Event Timeline**: Watch the simulation events unfold level-by-level.
- **Analytics Panel**: Real-time statistics of the simulation and graph structure.
- **Dark/Light Mode**: Full theme support stored in `localStorage`.
- **Keyboard Shortcuts**: Complete control via keyboard for rapid demonstration.

## Technology Stack

- **React 18** (Hooks, Context, Refs)
- **TypeScript** (Strict Mode)
- **Vite** (Build Tool)
- **Tailwind CSS** (Styling, Dark Mode)
- **Lucide React** (Icons)
- **Zero heavy graph dependencies** (Pure SVG rendering)

## Architecture

- **State Management**: Complex simulation state is managed purely via a custom React hook `useSimulation`. 
- **Graph Layout**: A static graph of 50 users and 86 edges is laid out using a custom deterministic force-directed layout script to ensure zero frame-drops during runtime.
- **Animation**: The notification travelling (particles) is driven by `requestAnimationFrame` for buttery-smooth performance, bypassing standard React component re-renders for the coordinates themselves where possible (or cleanly batched).

## Simulation Flow

1. **User triggers action**: Select an actor (e.g. Alex) and an action (POST).
2. **Graph inspected**: The simulation engine initializes the queue with the actor's immediate connections.
3. **Recipients calculated**: Eligible recipients are determined based on the chosen strategy and maximum depth.
4. **Propagation starts**: The engine begins ticking.
5. **Edges traversed**: Particles visually travel along edges via `requestAnimationFrame`.
6. **Simulation completes**: Nodes light up with their notification badge, analytics update, and timeline populates.

## Design System Tokens

The application uses the strict "Signal Console" visual identity.

| Accent | Hex / Color | Semantic Meaning |
|---|---|---|
| `--actor` | `#FFB020` (Amber) | The originating user |
| `--signal` | `#35E0C8` (Teal) | Level 1 notification propagation |
| `--depth-2` | `#8B7BFF` (Violet) | Level 2 notification propagation |
| `--depth-3` | `#FF6B9B` (Rose) | Level 3+ notification propagation |

*(Note: Colors automatically adapt slightly based on Light/Dark mode).*

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `Space` | Trigger / Pause / Resume simulation |
| `R` | Reset graph and simulation state |
| `F` | Fit graph to screen (resets zoom) |
| `/` | Focus search bar |
| `D` | Toggle dark/light mode |
| `1`, `2`, `3` | Set propagation depth (when in Depth strategy) |
| `Esc` | Clear selected node |

## For the Viva (Q&A)

**Q1: Why did you use Breadth-First Search (BFS) for the propagation?**
**A1:** Notification fan-out in social networks inherently operates level-by-level (immediate followers first, then followers of followers). BFS perfectly models this outward ripple effect, ensuring we find the shortest path (minimum depth) to any given user.

**Q2: What is the difference between fan-out at write time vs read time?**
**A2:** Fan-out on write (push) means when a user posts, we proactively insert that post into all their followers' feeds in the database. Fan-out on read (pull) means the feed is constructed dynamically when the follower opens the app. This simulator visualizes a push-based fan-out.

**Q3: How is pause implemented?**
**A3:** The `requestAnimationFrame` loop tracks the current progress of each moving particle (0.0 to 1.0). When paused, the loop cancels, freezing the progress variables in React state. Resuming simply restarts the loop from those saved progress values.

**Q4: Why is the graph layout precomputed instead of running a physics engine?**
**A4:** Running a force-directed graph physics simulation (like d3-force) continuously consumes significant CPU, which can cause the actual notification animations to stutter. Precomputing it ensures a stable, highly performant visualization.

**Q5: What is the time complexity of the traversal?**
**A5:** Since it uses BFS, the time complexity is O(V + E), where V is the number of vertices (users) and E is the number of edges (connections) traversed within the depth limit.

**Q6: What would a real system do differently?**
**A6:** A real system (like Twitter or Instagram) would use distributed message queues (Kafka, RabbitMQ) and background worker pools to process fan-outs asynchronously. It would also employ hybrid approaches (push for normal users, pull for celebrities with millions of followers) to avoid massive database spikes.

## Installation & Running

1. Clone or extract the project.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```
   
## Project Structure

- `src/components/`: Reusable UI elements, dashboard layout, SVG graph components.
- `src/hooks/`: Custom React hooks for simulation, theme, and pan/zoom math.
- `src/utils/`: Graph algorithms (BFS engine) and force-directed layout computation.
- `src/types/`: Strict TypeScript definitions for the graph and simulation state.
- `src/data/`: The static dataset of users and connections.
