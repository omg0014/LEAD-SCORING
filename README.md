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

## 🔍 Verification

1.  **Dashboard**: Open the frontend. You should see the "Live Intelligence" dashboard.
2.  **Server Status**: Visit `http://localhost:5001/`. It should return `{"database": "Connected", ...}`.
3.  **Real-Time Test**:
    - Open the app in two different tabs.
    - Submit a "Simulate Event" in one tab.
    - Watch the score update instantly in the other tab.

---

## 🐛 Troubleshooting

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **ERR_CONNECTION_REFUSED** | Backend is not running. | Ensure `npm run dev` is running in `backend/` and port 5001 is free. |
**CORS Error** | Mismatched ports/origins. | Ensure `CLIENT_URL` in backend `.env` matches your frontend URL exactly. |
| **Socket Connection Failed** | Backend not reachable. | Check if `VITE_API_URL` points to the correct backend address. |
