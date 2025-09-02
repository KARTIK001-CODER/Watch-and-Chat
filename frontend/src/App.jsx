import { useState } from "react";
import { useNavigate } from "react-router-dom";

function App() {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const createRoom = async () => {
    const res = await fetch("http://localhost:5000/create-room");
    const data = await res.json();
    alert(`Share this link: ${data.link}`);
    navigate(`/room/${data.roomId}`);
  };

  const joinRoom = () => {
    if (!roomId) {
      alert("Enter a room code first!");
      return;
    }
    navigate(`/room/${roomId}`);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🎬 Watch Party</h1>
      <button onClick={createRoom}>Create Room</button>
      <br /><br />
      <input
        type="text"
        placeholder="Enter Room Code"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={joinRoom}>Join Room</button>
    </div>
  );
}

export default App;
