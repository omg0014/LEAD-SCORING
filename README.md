# Event-Driven Lead Scoring System

A real-time lead scoring application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.IO. This system processes events (like Page Views, Form Submissions) to update lead scores dynamically and visualize them on a live dashboard.

## 🚀 Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Shadcn UI, Socket.IO Client.
- **Backend**: Node.js, Express, A/synchronous Event Queue, Socket.IO.
- **Database**: MongoDB (Atlas or Local).

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local) or a [MongoDB Atlas](https://www.mongodb.com/atlas) account.

---

## 📦 Installation

### 1. Clone the Repository
```bash
git clone [<your-repo-url>](https://github.com/omg0014/LEAD-SCORING.git)
cd lead-scoring
```

### 2. Setup Backend
```bash
cd backend
npm install
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
```

---

## ⚙️ Environment Setup

### Backend Configuration
Create a `.env` file in the `backend/` directory:

```env
# Server Port
PORT=5001

# MongoDB Connection String (Local or Atlas)
# For Local: mongodb://127.0.0.1:27017/leadscoring
# For Atlas: mongodb+srv://<user>:<pass>@cluster.mongodb.net/leadscoring
MONGO_URI=mongodb://127.0.0.1:27017/leadscoring

# Frontend Access (CORS)
# Use http://localhost:5173 for local Vite dev
CLIENT_URL=http://localhost:5173
```

### Frontend Configuration
Create a `.env` file in the `frontend/` directory (optional if relying on defaults, but recommended):

```env
# Backend API URL
# Points to local backend by default
VITE_API_URL=http://localhost:5001
```

---

## 🏃‍♂️ Running Locally

You need to run the **Backend** and **Frontend** in separate terminal windows.

### Terminal 1: Start Backend
```bash
cd backend
npm run dev
```
> You should see: `Server running on port 5001`, `MongoDB Connected`, and `Socket.IO initialized`.

### Terminal 2: Start Frontend
```bash
cd frontend
npm run dev
```
> Open the URL shown (usually `http://localhost:5173`) in your browser.

---

## � API Documentation

### Events
| Method | Endpoint | Description | Payload Example |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/events` | Ingest a single event used for scoring. | `{ "eventId": "evt_001", "leadId": "lead_123", "eventType": "Page View", "timestamp": "2023-10-27T10:00:00Z" }` |
| **POST** | `/api/events/batch` | Ingest multiple events at once. | `[ { "eventId": "evt_001", ... }, { "eventId": "evt_002", ... } ]` |

### Leads
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/leads` | Retrieve a leaderboard of top leads (supports `?limit=N` and `?search=ID`). |
| **GET** | `/api/leads/:id` | Get detailed profile, score history, and raw event logs for a specific lead. |

### Rules
| Method | Endpoint | Description | Payload Example |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/rules` | Fetch all active scoring rules and point values. | N/A |
| **POST** | `/api/rules` | Create or update a scoring rule. | `{ "eventType": "Webinar", "points": 50, "isActive": true }` |

---

## 🗄️ Database Schema

The system uses **MongoDB** with Mongoose ODM.

### 1. Leads Collection
Stores the current state of a user/lead.
- `_id` (String): Unique identifier (e.g., email or user ID).
- `score` (Number): Current calculated score.
- `lastEventId` (String): ID of the last processed event to ensure idempotency.
- `updatedAt` (Date): Last activity timestamp.

### 2. Events Collection
An append-only log of all raw events received.
- `eventId` (String): Unique event ID (deduplication key).
- `leadId` (String): Reference to the lead.
- `eventType` (String): Type of interaction (e.g., "Page View").
- `metadata` (Object): Arbitrary context data.
- `processed` (Boolean): Flag indicating if score has been calculated.

### 3. ScoreHistory Collection
Tracks score changes over time for analytics and charts.
- `leadId` (String): Reference to the lead.
- `oldScore` / `newScore` (Number): Score before and after the event.
- `delta` (Number): Points added/subtracted.
- `timestamp` (Date): When the change occurred.

### 4. ScoringRules Collection
Configurable rules engine.
- `eventType` (String): The trigger key.
- `points` (Number): Value to add (can be negative).
- `isActive` (Boolean): Master switch for the rule.

---

## 🏗️ Architecture & Decisions

### Event-Driven Architecture
The system is designed to be **asynchronous** and **non-blocking**.
- **Ingestion**: Events are accepted immediately by the API (`202 Accepted`) and pushed to an in-memory queue.
- **Processing**: A worker consumes the queue, validates the event, calculates the score based on active rules, and updates the database.
- **Real-Time Feedback**: Once a score is updated, the backend emits a Socket.IO event (`leadUpdated`) to connected clients, ensuring the dashboard is always live without polling.

### Trade-offs
- **In-Memory Queue**: Currently uses a JavaScript array/object for the queue. **Pros**: Zero infrastructure overhead, fastest possible implementation. **Cons**: Events are lost if the server crashes. *Production Plan: Replace with Redis/BullMQ.*
- **MongoDB for Ledger**: We store both the *current state* (Leads) and the *transaction log* (Events/ScoreHistory). This allows for replaying history if scoring rules change, at the cost of higher storage usage.

---

## 🧠 Operational Strategies

### 1. Conflict Resolution
- **Idempotency**: Every event must have a unique `eventId`. The system creates an `Event` record first; if a duplicate `eventId` is received, it is discarded immediately, preventing double-counting of scores.
- **Atomic Updates**: MongoDB atomic operators (like `$inc` could be used, though we currently read-modify-write for validation) ensure data integrity.

### 2. Rate Limiting Strategy
- **Ingestion Layer**: While the current MVP lacks explicit middleware, the architecture supports high throughput by offloading processing to the queue. The API creates a lightweight promise and returns quickly.
- **Batch Processing**: The `/api/events/batch` endpoint allows clients to send bulk data (e.g., 100 events/sec) in a single HTTP request, significantly reducing network overhead and TCP handshake costs.

### 3. Error Recovery
- **Global Error Handler**: A centralized Express error handler catches unhandled exceptions to prevent server crashes.
- **Graceful Degradation**: If the WebSocket connection fails, the frontend handles the disconnection gracefully and attempts to reconnect. The HTTP API remains functional for fetching data manually.
- **Queue Safeties**: Failed events are logged. In a production version using Redis, these would be moved to a "Dead Letter Queue" for manual inspection.

### 4. Performance Optimizations
- **Indexing**: MongoDB collections are indexed on frequently queried fields (`leadId`, `score` descending for leaderboards, `timestamp`).
- **Projection**: API endpoints select only necessary fields to reduce payload size.
- **Asynchronous I/O**: Heavy database writes happen in the background after the API has already responded to the client, ensuring low latency for the event source.
