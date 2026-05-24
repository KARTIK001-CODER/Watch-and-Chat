# Synvik

> Real-time synchronized watch-party platform with AI-powered communication, scalable architecture, and production-grade engineering.

---

# Overview

Synvik is a modern real-time watch-party platform where users can watch videos together in synchronized playback while interacting through live chat, collaborative rooms, and AI-enhanced experiences.

The project is designed with a strong focus on:

* real-time systems
* scalability
* synchronization consistency
* clean architecture
* production readiness

Unlike basic clone projects, Synvik emphasizes engineering depth through modular architecture, socket-based synchronization, AI integration, and scalable backend design.

---

# Core Features

## Watch Party

* Real-time synchronized playback
* Shared room-based watching experience
* Admin-controlled playback
* Play/Pause synchronization
* Seek synchronization
* Shared video state management
* Playback recovery on reconnect

---

## Real-Time Communication

* Real-time room chat
* Typing indicators
* User presence tracking
* Emoji support
* Mentions system
* Message persistence
* Chat history recovery

---

## Room System

* Create private/public rooms
* Join via room ID or invite link
* Room-based user management
* Live viewer count
* Room ownership system
* Moderator roles

---

## AI Features

* AI moderation agent
* Toxicity detection
* Spam prevention
* Smart welcome assistant
* Future recommendation engine
* Future sentiment analysis

---

## Authentication & Security

* JWT authentication
* OAuth login
* Protected routes
* Role-based access control
* Rate limiting
* XSS prevention
* Input validation

---

## Analytics (Planned)

* Real-time engagement tracking
* Watch analytics
* Chat activity metrics
* User retention monitoring
* Room statistics dashboard

---

# System Architecture

```txt id="bc36a7"
Client (React)
       ↓
Socket.io Gateway
       ↓
Node.js Backend
       ↓
Supabase Database
```

---

# Real-Time Synchronization Flow

```txt id="3axtgq"
Admin Action
      ↓
Socket Event
      ↓
Server Validation
      ↓
Room State Update
      ↓
Broadcast to Connected Clients
      ↓
Clients Synchronize Playback
```

---

# Tech Stack

## Frontend

* React
* Vite
* Tailwind CSS
* Socket.io Client
* React Hot Toast
* React YouTube

---

## Backend

* Node.js
* Express.js
* Socket.io

---

## Database & Authentication

* Supabase PostgreSQL
* Supabase Auth

---

## Deployment

* Vercel
* Render

---

## AI Services

* Hugging Face Inference API

---

# Project Structure

```txt id="kprx8v"
synvik/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── socket/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── layouts/
│   │   └── App.jsx
│   │
│   └── public/
│
├── server/
│   ├── controllers/
│   ├── sockets/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── config/
│   ├── utils/
│   └── server.js
│
├── docs/
│   ├── HLD.md
│   ├── LLD.md
│   ├── SOCKET_EVENTS.md
│   ├── API_CONTRACTS.md
│   └── ARCHITECTURE.md
│
├── docker/
│
├── .github/
│
├── README.md
└── package.json
```

---

# Engineering Goals

Synvik is built to demonstrate:

* scalable real-time architecture
* synchronization consistency
* modular backend engineering
* AI integration
* clean frontend architecture
* production deployment workflows
* full-stack engineering practices

---

# Core Socket Events

## Room Events

```txt id="qf6t2p"
join-room
leave-room
user-joined
user-left
room-state
```

---

## Video Events

```txt id="jcvv6l"
play-video
pause-video
seek-video
change-video
sync-state
sync-correction
```

---

## Chat Events

```txt id="19j9lu"
send-message
new-message
typing-start
typing-stop
chat-history
```

---

# Installation

# 1. Clone Repository

```bash id="t2kzj5"
git clone https://github.com/yourusername/synvik.git
cd synvik
```

---

# 2. Setup Frontend

```bash id="i6x29v"
cd client
npm install
npm run dev
```

Frontend runs on:

```txt id="r5svr9"
http://localhost:5173
```

---

# 3. Setup Backend

```bash id="b8g5y7"
cd server
npm install
npm run dev
```

Backend runs on:

```txt id="k1ncbq"
http://localhost:3001
```

---

# Environment Variables

## Backend `.env`

```env id="o5y2ej"
PORT=3001

SUPABASE_URL=
SUPABASE_ANON_KEY=

JWT_SECRET=

HF_TOKEN=
```

---

# Database Schema

## Rooms Table

```sql id="yqf8k5"
CREATE TABLE rooms (
  id UUID PRIMARY KEY,
  name TEXT,
  admin_id UUID,
  current_video TEXT,
  current_time INTEGER,
  is_playing BOOLEAN,
  created_at TIMESTAMP
);
```

---

## Messages Table

```sql id="vxy2g8"
CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  room_id UUID,
  user_id UUID,
  content TEXT,
  created_at TIMESTAMP
);
```

---

# Synchronization Strategy

The backend acts as the authoritative synchronization source.

## Sync Principles

* Only admins can control playback
* Room state is stored centrally
* All playback events pass through the backend
* Clients synchronize using authoritative timestamps
* Reconnection restores latest room state

---

# AI Moderation Flow

```txt id="lnwuj4"
User Sends Message
        ↓
AI Moderation Agent
        ↓
Toxicity Analysis
        ↓
Allow / Block Decision
        ↓
Broadcast Approved Message
```

---

# Security Design

## Authentication

* JWT-based authentication
* OAuth support
* Session validation

---

## Authorization

Roles:

* Owner
* Moderator
* Viewer

---

## Protection Mechanisms

* Rate limiting
* Input sanitization
* Socket validation
* Protected routes
* XSS prevention

---

# Deployment Strategy

## Frontend

Deploy using:

* Vercel

---

## Backend

Deploy using:

* Render

---

## Database

Hosted using:

* Supabase

---

# Future Roadmap

## Phase 1 — MVP

* Rooms
* Real-time sync
* Chat system
* Deployment

---

## Phase 2 — AI Features

* AI moderation
* Welcome bot
* Smart recommendations

---

## Phase 3 — Advanced Communication

* WebRTC voice chat
* Reactions
* Collaborative queue
* Presence improvements

---

## Phase 4 — Scaling & DevOps

* Redis Pub/Sub
* Docker
* CI/CD
* Monitoring
* Horizontal scaling

---

# Performance Goals

| Metric                | Target |
| --------------------- | ------ |
| Message Latency       | <100ms |
| Playback Drift        | <300ms |
| Room Join Time        | <2s    |
| Concurrent Rooms      | 1000+  |
| Reconnection Recovery | <1s    |

---

# Documentation

Additional documentation available inside `/docs`:

* HLD.md
* LLD.md
* SOCKET_EVENTS.md
* API_CONTRACTS.md
* ARCHITECTURE.md

---

# Why Synvik?

Synvik is not just another watch-party application.

It is a real-time engineering project focused on:

* synchronization systems
* distributed communication
* AI-assisted moderation
* scalable backend design
* production-level architecture

The project is built to simulate how modern collaborative platforms handle real-time interactions at scale.

---

# Author

Built with engineering focus, real-time systems thinking, and scalable architecture principles.

---

# License

MIT License
