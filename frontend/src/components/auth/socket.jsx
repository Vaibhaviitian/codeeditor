import React, { useState } from "react";
import { io } from "socket.io-client";

const CreateRoom = () => {
  const [s, sets] = useState();
  const [roomName, setRoomName] = useState("");
  const socket = io(`${import.meta.env.VITE_REACT_BACKEND_URL}`);
  const joinRoom = () => {
    sets(socket);
    if (s && roomName) {
      socket.emit("joinRoom", roomName);
      socket.on("message", (msg) => {
      });
    }
    return () => {
      socket.disconnect();
      console.log("Socket disconnected");
    };
  };

  const createRoom = () => {
    const randomRoom = "room-" + Math.floor(Math.random() * 10000);
    setRoomName(randomRoom);
    socket.emit("joinRoom", randomRoom);
    console.log(`Created & Joined Room: ${randomRoom}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4 bg-gray-100">
      <h2 className="text-2xl font-bold">Socket.IO Room Chat</h2>
      <button
        className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md"
        onClick={createRoom}
      >
        Create Room
      </button>

      <input
        type="text"
        placeholder="Enter Room Name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        className="px-4 py-2 border rounded-md"
      />

      <button
        className="px-6 py-2 bg-green-500 text-white rounded-lg shadow-md"
        onClick={joinRoom}
      >
        Join Room
      </button>
    </div>
  );
};

export default CreateRoom;
