# Social Graph & Notification Fan-Out Visualizer

> A full-stack interactive visualizer demonstrating **Breadth-First Search (BFS)** based notification fan-out in a social network — built as a 3rd Year Mini Project.

---

## 🌐 Quick Access & Localhost URLs

When running locally, access the components at the following URLs:

| Component | Localhost Link | Default Port | Description |
|---|---|---|---|
| 🖥️ **Frontend Visualizer Web App** | [**http://localhost:5173**](http://localhost:5173) | `5173` | Interactive SVG graph, Auto-Demo, Mobile Lockscreen & Reaction cascades |
| ⚙️ **Backend REST API** | [**http://localhost:5000**](http://localhost:5000) | `5000` | Express API for graph topology, users, edges, and BFS simulation |
| 📊 **Graph Data Endpoint** | [**http://localhost:5000/api/graph**](http://localhost:5000/api/graph) | `5000` | Returns full graph (50 users, 86 edges, network stats) |
| 🔍 **BFS Simulation Test Endpoint** | [**http://localhost:5000/api/simulate?actorId=u00&action=POST&strategy=bfs**](http://localhost:5000/api/simulate?actorId=u00&action=POST&strategy=bfs) | `5000` | Run BFS fan-out simulation directly via REST query |

---

## 🗂 Project Structure

```
social-graph-visualizer/
├── frontend/   (React + TypeScript + Vite + Tailwind CSS)
│   └── src/
│       ├── components/     UI components (Graph, Sidebar, Dashboard, etc.)
│       ├── hooks/          Custom React hooks (useSimulation, useTheme, etc.)
│       ├── data/           Static social graph dataset (50 users, 86 edges)
│       ├── utils/          Layout & simulation engine
│       └── types/          TypeScript type definitions
│
└── backend/    (Node.js + Express REST API)
    └── src/
        ├── index.js        Express server entry point
        ├── data/           Graph dataset (mirrors frontend)
        ├── algorithms/     BFS fan-out algorithm (pure JS)
        └── routes/
            ├── graph.js    /api/graph — graph data endpoints
            └── simulate.js /api/simulate — BFS simulation endpoint
```

---

## 🚀 Running the Project

### Frontend (React App)

```bash
# From the project root
npm install
npm run dev
```

Opens at → **http://localhost:5173**

### Backend (Express API)

```bash
cd backend
npm install
npm start          # production
# OR
npm run dev        # with auto-reload (nodemon)
```

API runs at → **http://localhost:5000**

---

## 🔌 Backend API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | API info & usage guide |
| `GET` | `/api/graph` | Full graph (all users + edges + stats) |
| `GET` | `/api/graph/users` | List all 50 users |
| `GET` | `/api/graph/users/:id` | Single user + their direct connections |
| `GET` | `/api/graph/edges` | All 86 edges |
| `POST` | `/api/simulate` | Run BFS fan-out simulation (JSON body) |
| `GET` | `/api/simulate` | Run BFS fan-out simulation (query params) |

### Simulate — Request Body (POST)

```json
{
  "actorId":  "u00",
  "action":   "POST",
  "strategy": "bfs",
  "maxDepth": 3
}
```

| Field | Values | Description |
|-------|--------|-------------|
| `actorId` | `u00` – `u49` | The user triggering the action |
| `action` | `POST`, `LIKE`, `FOLLOW` | Type of social action |
| `strategy` | `direct`, `bfs`, `depth` | Propagation strategy |
| `maxDepth` | `1` – `10` | Max hops (only for `depth` strategy) |

### Simulate — Example Response

```json
{
  "actor":    { "id": "u00", "name": "Alex Morgan", ... },
  "action":   "POST",
  "strategy": "bfs",
  "levels": [
    {
      "depth": 1,
      "recipients": [ { "id": "u01", "name": "Sarah Wilson", ... }, ... ],
      "edges": ["e00", "e01", "e02", ...]
    },
    {
      "depth": 2,
      "recipients": [ ... ],
      "edges": [ ... ]
    }
  ],
  "totalReached":        42,
  "totalEdgesTraversed": 50,
  "maxDepthReached":     4
}
```

---

## 🧠 Algorithms

### BFS Fan-Out (`backend/src/algorithms/bfs.js`)

Three strategies are implemented:

| Strategy | Description | Depth Cap |
|----------|-------------|-----------|
| `direct` | Only immediate neighbours | 1 hop |
| `bfs` | Full Breadth-First Search | Unlimited |
| `depth` | BFS with user-defined limit | 1–10 hops |

**Time complexity: O(V + E)** — V = users, E = edges traversed

---

## 🎨 Features

- **Interactive SVG Graph** — Force-directed layout (Fruchterman-Reingold), pan/zoom/drag, glowing radar waves.
- **✨ Autonomous Auto-Demo Mode** — Self-driving showcase with curated scenarios and live signal narration.
- **📱 Simulated Follower Phone Lockscreen** — Live mobile push notification feed displaying incoming notifications in real-time.
- **💬 Follower Reactions & Secondary Reshares** — Other network members actively like, comment, and reshare posts, firing secondary signal waves.
- **👑 Influencer & Write Amplification Analysis** — Demonstrates the "Celebrity Problem" and measures write amplification ratio ($1 \to N$ writes).
- **⏭️ Step-by-Step Execution Mode** — Advance one BFS hop level at a time for viva and project demonstrations.
- **⚙️ Distributed System Architecture Modal** — Visualizes the production message broker pipeline (`Producer ➔ API Gateway ➔ Kafka/Redis ➔ Worker Pool ➔ Timeline Cache`).
- **🎓 Project Viva Evaluation Guide** — Built-in answers to essential viva questions on graph theory, time complexity ($O(V+E)$), and push vs pull models.
- **🔊 Synthesized Web Audio Effects** — Interactive audio chimes for notification arrivals and completion (muteable).
- **Real-Time Analytics & Report Export** — Real-time metrics and one-click JSON simulation report download.
- **Dark / Light Mode** — Persisted in `localStorage`.
- **Keyboard Shortcuts** — `Space`, `R`, `F`, `P`, `A`, `/`, `D`, `1-3`, `Esc`.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Lucide React |
| Backend | Node.js, Express, CORS |
| Graph Rendering | Pure SVG (zero heavy dependencies) |
| Algorithms | Custom BFS implementation |

---

## 📚 Q&A for Viva

**Q: Why BFS for notification fan-out?**  
BFS processes users level-by-level (immediate followers first, then their followers), which perfectly models the outward ripple of social notifications.

**Q: What's the difference between fan-out at write time vs read time?**  
Fan-out on write (push) pre-inserts posts into follower feeds. Fan-out on read (pull) builds feeds dynamically. This project visualizes **push-based** fan-out.

**Q: What is the time complexity?**  
O(V + E) — linear in the number of vertices and edges traversed.

**Q: What would a real system use?**  
Distributed message queues (Kafka/RabbitMQ), background worker pools, and hybrid push/pull strategies for high-follower-count accounts.
