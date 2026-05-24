# Synvik — Low Level Design (LLD)

---

# 1. Introduction

Synvik is a real-time synchronized watch-party platform that enables users to:

* watch videos together,
* communicate through real-time chat,
* synchronize playback across connected users,
* and interact within collaborative rooms.

The system is designed with a strong focus on:

* low latency communication,
* synchronization consistency,
* modular architecture,
* scalability,
* and production readiness.

---

# 2. Objectives

The primary objectives of Synvik are:

* Real-time synchronized playback
* Stable room state management
* Low latency communication
* Scalable WebSocket architecture
* Persistent chat storage
* Modular backend services
* AI-assisted moderation
* Production-grade deployment structure

---

# 3. System Architecture

```txt id="04xw9i"
 ┌──────────────┐
 │   Frontend   │
 │   (React)    │
 └──────┬───────┘
        │
        ▼
 ┌──────────────┐
 │ Socket Layer │
 │  Socket.io   │
 └──────┬───────┘
        │
        ▼
 ┌──────────────┐
 │ Node Backend │
 │  Express.js  │
 └──────┬───────┘
        │
        ▼
 ┌──────────────┐
 │  Supabase DB │
 └──────────────┘
```

---

# 4. High-Level Module Breakdown

| Module                 | Responsibility                    |
| ---------------------- | --------------------------------- |
| Frontend Client        | UI rendering and user interaction |
| Socket Gateway         | Real-time event communication     |
| Room Manager           | Room lifecycle and state          |
| Sync Engine            | Playback synchronization          |
| Chat Service           | Messaging system                  |
| AI Moderation Service  | Toxicity filtering                |
| Authentication Service | User authentication               |
| Persistence Layer      | Database operations               |

---

# 5. Frontend Design

## Responsibilities

The frontend is responsible for:

* rendering UI,
* maintaining local state,
* handling socket communication,
* updating playback state,
* and displaying chat updates.

---

## Frontend Stack

| Technology       | Purpose                 |
| ---------------- | ----------------------- |
| React            | UI framework            |
| Vite             | Build tool              |
| Tailwind CSS     | Styling                 |
| Socket.io Client | Real-time communication |
| React YouTube    | Video player            |
| React Hot Toast  | Notifications           |

---

## Frontend Folder Structure

```txt id="ww0hl5"
client/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── context/
│   ├── socket/
│   ├── services/
│   ├── utils/
│   ├── layouts/
│   └── App.jsx
```

---

# 6. Backend Design

## Responsibilities

The backend is responsible for:

* handling WebSocket communication,
* maintaining authoritative room state,
* validating synchronization events,
* persisting chat messages,
* and broadcasting updates to clients.

---

## Backend Stack

| Technology | Purpose                 |
| ---------- | ----------------------- |
| Node.js    | Runtime                 |
| Express.js | API server              |
| Socket.io  | Real-time communication |
| Supabase   | Database/Auth           |
| JWT        | Authentication          |

---

## Backend Folder Structure

```txt id="z0hylr"
server/
│
├── controllers/
├── sockets/
├── middleware/
├── routes/
├── services/
├── config/
├── utils/
└── server.js
```

---

# 7. Room Management System

## Purpose

The Room Manager handles:

* room creation,
* room deletion,
* user joins/leaves,
* admin ownership,
* room state tracking.

---

## Room State Schema

```js id="w4lh7z"
{
  roomId,
  adminId,
  currentVideo,
  currentTime,
  isPlaying,
  users: [],
  createdAt
}
```

---

## Room Lifecycle

```txt id="j1bydy"
Create Room
    ↓
User Joins
    ↓
State Initialization
    ↓
Playback Synchronization
    ↓
User Leaves
    ↓
Room Cleanup
```

---

# 8. Synchronization Engine

## Purpose

The Synchronization Engine ensures all connected users maintain synchronized playback state.

---

## Supported Synchronization Actions

* Play
* Pause
* Seek
* Change Video
* Reconnect Sync

---

## Synchronization Flow

```txt id="8sajhi"
Admin Action
      ↓
Socket Event Triggered
      ↓
Backend Validation
      ↓
Room State Updated
      ↓
Broadcast to Room
      ↓
Clients Apply State
```

---

## Synchronization Rules

* Only admins can control playback
* Backend acts as authoritative state source
* Clients must sync to backend timestamps
* Desynchronization correction occurs periodically

---

## Drift Correction Strategy

```txt id="d9q3xw"
Client Reports Playback Time
        ↓
Server Compares Drift
        ↓
If Drift > Threshold
        ↓
Sync Correction Sent
```

---

# 9. Chat System Design

## Purpose

The Chat Service manages:

* real-time messaging,
* message persistence,
* typing indicators,
* moderation hooks.

---

## Message Flow

```txt id="l56x2i"
User Sends Message
        ↓
Moderation Validation
        ↓
Database Persistence
        ↓
Broadcast to Room
        ↓
Client Rendering
```

---

## Chat Features

* Real-time updates
* Typing indicators
* Chat history recovery
* Mentions system
* Persistent storage

---

# 10. AI Moderation Service

## Purpose

The moderation layer filters:

* toxic content,
* spam,
* abusive language.

---

## AI Provider

* Hugging Face Inference API

---

## Moderation Flow

```txt id="7l9k0m"
Incoming Message
       ↓
AI Toxicity Analysis
       ↓
Confidence Scoring
       ↓
Allow / Reject Decision
```

---

# 11. Authentication System

## Responsibilities

The authentication service manages:

* login,
* signup,
* OAuth authentication,
* session validation,
* role authorization.

---

## Authentication Methods

* JWT Authentication
* OAuth Login

---

## Roles

| Role      | Permissions       |
| --------- | ----------------- |
| Owner     | Full room control |
| Moderator | Chat moderation   |
| Viewer    | Standard access   |

---

# 12. Database Design

## Database Provider

* Supabase PostgreSQL

---

# 12.1 Users Table

```sql id="n4lq1j"
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username TEXT,
  email TEXT,
  avatar TEXT,
  created_at TIMESTAMP
);
```

---

# 12.2 Rooms Table

```sql id="q0sjb1"
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

# 12.3 Messages Table

```sql id="t8j5r1"
CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  room_id UUID,
  user_id UUID,
  content TEXT,
  created_at TIMESTAMP
);
```

---

# 13. Socket Event Contracts

# 13.1 Room Events

## join-room

```js id="f4m2sl"
{
  roomId,
  username,
  userId
}
```

---

## leave-room

```js id="6t5h0s"
{
  roomId,
  userId
}
```

---

# 13.2 Video Events

## play-video

```js id="qf26p0"
{
  roomId,
  currentTime
}
```

---

## pause-video

```js id="l6flh7"
{
  roomId
}
```

---

## seek-video

```js id="4tck5j"
{
  roomId,
  seekTime
}
```

---

## change-video

```js id="ebj5p0"
{
  roomId,
  videoUrl
}
```

---

# 13.3 Chat Events

## send-message

```js id="z2kl4s"
{
  roomId,
  userId,
  message
}
```

---

## typing-start

```js id="q8skn2"
{
  roomId,
  userId
}
```

---

# 14. Reconnection Strategy

## Purpose

Handle unexpected disconnects while preserving synchronization state.

---

## Reconnection Flow

```txt id="xh2m1y"
User Reconnects
       ↓
Fetch Latest Room State
       ↓
Restore Playback State
       ↓
Seek To Current Timestamp
       ↓
Resume Synchronization
```

---

# 15. Error Handling Strategy

## Client Errors

* connection timeout
* synchronization failure
* invalid room
* authentication failure

---

## Server Errors

* invalid socket events
* room not found
* unauthorized actions
* database failure

---

# 16. Security Design

## Security Features

* JWT authentication
* OAuth validation
* Rate limiting
* Input sanitization
* XSS prevention
* Socket validation
* Protected routes

---

# 17. Scalability Design

## Current Architecture

* Monolithic backend
* In-memory room state
* Single WebSocket gateway

---

## Future Scaling Plan

```txt id="1vzhf5"
Socket.io Clustering
        ↓
Redis Pub/Sub
        ↓
Horizontal Scaling
        ↓
Distributed Synchronization
```

---

# 18. Performance Targets

| Metric                | Target |
| --------------------- | ------ |
| Message Latency       | <100ms |
| Playback Drift        | <300ms |
| Room Join Time        | <2s    |
| Reconnection Recovery | <1s    |
| Concurrent Rooms      | 1000+  |

---

# 19. Deployment Strategy

## Frontend

* Vercel

---

## Backend

* Render

---

## Database

* Supabase

---

# 20. Future Enhancements

* WebRTC voice channels
* Collaborative playlists
* AI recommendation engine
* Real-time analytics dashboard
* Distributed microservices
* Redis-based scaling
* Mobile application
* Offline synchronization

---

# 21. Conclusion

Synvik is designed as a scalable, modular, production-oriented real-time platform focused on synchronization, communication, and collaborative experiences.

The architecture prioritizes:

* low latency,
* clean modularity,
* scalability,
* and production-readiness while remaining extensible for future distributed system evolution.
