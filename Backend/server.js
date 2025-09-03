const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { nanoid } = require("nanoid");

const app = express();

// CORS for frontend (Netlify)
app.use(cors({
  origin: "https://watch-and-chat.vercel.app"
}));
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://watch-and-chat.vercel.app",
    methods: ["GET", "POST"],
  },
});

let rooms = {};

// create room
app.get("/create-room", (req, res) => {
  const roomId = nanoid(6);
  rooms[roomId] = {
    users: [],
    videoId: "dQw4w9WgXcQ",
    currentTime: 0,
    state: "pause",
  };

  // Use deployed frontend link here
  res.json({
    roomId,
    link: `https://watch-and-chat.vercel.app/room/${roomId}`,
  });
});

// set video
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

      socket.emit("init-video", {
        videoId: rooms[roomId].videoId,
        currentTime: rooms[roomId].currentTime,
        state: rooms[roomId].state,
      });
    } else {
      socket.emit("error", "Room does not exist!");
    }
  });

  socket.on("video-action", ({ roomId, action, time }) => {
    if (rooms[roomId]) {
      rooms[roomId].currentTime = time;
      rooms[roomId].state = action;
      socket.to(roomId).emit("video-action", { action, time });
    }
  });

  socket.on("chat-message", ({ roomId, message }) => {
    io.to(roomId).emit("chat-message", { user: socket.id, message });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ✅ Use process.env.PORT for deployment
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
