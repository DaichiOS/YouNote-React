import React, { useEffect } from "react";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://127.0.0.1:8001";

function App() {
  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL);

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("message", (message) => {
      console.log("Message from server:", message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="App">
      <h1>Test</h1>
    </div>
  );
}

export default App;
