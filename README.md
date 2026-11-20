# Social Graph & Notification Fan-Out Visualizer

> A full-stack interactive visualizer demonstrating **Breadth-First Search (BFS)** based notification fan-out in a social network — built as a 3rd Year Mini Project.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fishant-chaudhary17%2Fmini-project-3yr)

---

## 🌐 Quick Access & Live URLs

| Access Type | URL / Command | Availability | Description |
|---|---|---|---|
| 🖥️ **Local Host (Your PC)** | [**http://localhost:5173**](http://localhost:5173) | Local | Development server with hot reload |
| 📶 **Same Network (Wi-Fi / LAN)** | [**http://172.16.202.27:5173**](http://172.16.202.27:5173) | Same Wi-Fi | Open from any phone or laptop on same Wi-Fi |
| 🌍 **Worldwide Live Web (Vercel)** | [**Deploy on Vercel**](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fishant-chaudhary17%2Fmini-project-3yr) | Global 24/7 | Free permanent public HTTPS link for anyone on the internet |
| ⚙️ **Backend REST API** | [**http://localhost:5000**](http://localhost:5000) | Local | Express API for graph topology & BFS simulation |
| 📊 **Graph Data Endpoint** | [**http://localhost:5000/api/graph**](http://localhost:5000/api/graph) | Local | Returns 50 users, 86 edges & topology statistics |
| 🔍 **BFS Simulation Endpoint** | [**http://localhost:5000/api/simulate?actorId=u00&action=POST&strategy=bfs**](http://localhost:5000/api/simulate?actorId=u00&action=POST&strategy=bfs) | Local | Direct REST query test for BFS algorithm |

---

## 🌍 How Anyone Can Access This Project

### 1. Same Network / Wi-Fi (No Internet Connection Needed!)
When running the development server (`npm run dev`) on the host machine, anyone connected to the same Wi-Fi network, college LAN, or mobile hotspot can access the visualizer immediately:
1. Connect your smartphone, tablet, or another laptop to the same Wi-Fi as this PC.
2. In the browser, navigate to:
   ```
   http://172.16.202.27:5173
   ```
3. The interactive graph visualizer, Auto-Demo, and mobile feed will load directly on that device!

---

### 2. Worldwide Public Access (Any Device, Anywhere on the Internet)
To give anyone on a different Wi-Fi, mobile network (4G/5G), or different city permanent access 24/7:

1. Click the **[Deploy with Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fishant-chaudhary17%2Fmini-project-3yr)** button above (or log in to [vercel.com](https://vercel.com/signup) using your GitHub account **`ishant-chaudhary17`**).
2. Click **"Add New... ➔ Project"** and select **`ishant-chaudhary17/mini-project-3yr`**.
3. Click **"Deploy"** (Vercel uses the pre-configured `vercel.json` file in the repository root).
4. Within 45 seconds, you will receive a free public domain (e.g., `https://mini-project-3yr.vercel.app`).
5. Share this URL with your project examiners, classmates, or professors!

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
Network (LAN / Same Wi-Fi) → **http://172.16.202.27:5173**

---

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
