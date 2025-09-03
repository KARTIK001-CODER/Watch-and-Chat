import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import YouTube from "react-youtube";

const socket = io("https://watch-and-chat.onrender.com");

function Room() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [videoId, setVideoId] = useState("dQw4w9WgXcQ"); // default
  const [linkInput, setLinkInput] = useState("");
  const playerRef = useRef(null);

  useEffect(() => {
    socket.emit("join-room", id);

    socket.on("chat-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("video-action", ({ action, time }) => {
      if (!playerRef.current) return;
      const player = playerRef.current.internalPlayer;

      if (action === "play") {
        player.seekTo(time, true);
        player.playVideo();
      } else if (action === "pause") {
        player.seekTo(time, true);
        player.pauseVideo();
      } else if (action === "seek") {
        player.seekTo(time, true);
      }
    });

    socket.on("init-video", ({ videoId, currentTime, state }) => {
      setVideoId(videoId);
      if (playerRef.current) {
        playerRef.current.internalPlayer.seekTo(currentTime);
        if (state === "play") playerRef.current.internalPlayer.playVideo();
        if (state === "pause") playerRef.current.internalPlayer.pauseVideo();
      }
    });

    socket.on("set-video", (vid) => {
      setVideoId(vid);
    });

    socket.on("error", (msg) => alert(msg));

    return () => {
      socket.off("chat-message");
      socket.off("video-action");
      socket.off("init-video");
      socket.off("set-video");
      socket.off("error");
    };
  }, [id]);

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit("chat-message", { roomId: id, message: input });
    setInput("");
  };

const handleVideoState = (event) => {
  const player = event.target;
  playerRef.current = { internalPlayer: player };

  if (event.data === 1) {
    // 1 = PLAYING
    const time = player.getCurrentTime();
    socket.emit("video-action", { roomId: id, action: "play", time });
  } else if (event.data === 2) {
    // 2 = PAUSED
    const time = player.getCurrentTime();
    socket.emit("video-action", { roomId: id, action: "pause", time });
  }
};


  const setVideo = async () => {
    const match = linkInput.match(/(?:v=|\.be\/)([a-zA-Z0-9_-]{11})/);
    if (!match) {
      alert("Invalid YouTube URL");
      return;
    }
    const vid = match[1];
    setVideoId(vid);
    await fetch("https://watch-and-chat.onrender.com/set-video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId: id, videoId: vid }),
    });
    setLinkInput("");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Room Code: {id}</h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Paste YouTube Link"
          value={linkInput}
          onChange={(e) => setLinkInput(e.target.value)}
        />
        <button onClick={setVideo}>Set Video</button>
      </div>

      <YouTube videoId={videoId} onStateChange={handleVideoState} />

      <div style={{ marginTop: "20px" }}>
        <h3>Chat</h3>
        <div
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            height: "200px",
            overflowY: "auto",
            marginBottom: "10px",
          }}
        >
          {messages.map((m, i) => (
            <p key={i}>
              <b>{m.user}:</b> {m.message}
            </p>
          ))}
        </div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Room;
