const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { nanoid } = require("nanoid"); // npm install nanoid

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // frontend
    methods: ["GET", "POST"],
  },
});

// store rooms in memory
let rooms = {};
/*
rooms[roomId] = {
  users: [],
  videoId: "abc123",
  currentTime: 0,
  state: "pause"
}
*/

// create new room
app.get("/create-room", (req, res) => {
  const roomId = nanoid(6);
  rooms[roomId] = {
    users: [],
    videoId: "dQw4w9WgXcQ", // default
    currentTime: 0,
    state: "pause",
  };
  res.json({
    roomId,
    link: `http://localhost:5173/room/${roomId}`,
  });
});

// set custom video for a room
app.post("/set-video", (req, res) => {
  const { roomId, videoId } = req.body;
  if (rooms[roomId]) {
    rooms[roomId].videoId = videoId;
    rooms[roomId].currentTime = 0;
    rooms[roomId].state = "pause";
    io.to(roomId).emit("set-video", videoId);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Room not found" });
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (roomId) => {
    if (rooms[roomId]) {
      socket.join(roomId);
      rooms[roomId].users.push(socket.id);
      console.log(`${socket.id} joined room ${roomId}`);

      // send current state to new user
      socket.emit("init-video", {
        videoId: rooms[roomId].videoId,
        currentTime: rooms[roomId].currentTime,
        state: rooms[roomId].state,
      });
    } else {
      socket.emit("error", "Room does not exist!");
    }
  });

  // handle play, pause, seek
  socket.on("video-action", ({ roomId, action, time }) => {
    if (rooms[roomId]) {
      rooms[roomId].currentTime = time;
      rooms[roomId].state = action;
      socket.to(roomId).emit("video-action", { action, time });
    }
  });

  // chat messages
  socket.on("chat-message", ({ roomId, message }) => {
    io.to(roomId).emit("chat-message", { user: socket.id, message });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("✅ Backend running on http://localhost:5000");
});
