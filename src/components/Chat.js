import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = process.env.REACT_APP_DEV_SERVER_URL;

const Chat = ({ videoId, summary }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState("");
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL);

    socketRef.current.on("chatgpt_response", (response) => {
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { sender: "chatbot", message: response },
      ]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (summary) {
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { sender: "chatbot", message: summary },
      ]);
    }
  }, [summary]);

  const handleUserInput = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setChatHistory((prevChatHistory) => [
      ...prevChatHistory,
      { sender: "user", message: userInput },
    ]);

    socketRef.current.emit("userMessage", userInput);

    setUserInput("");
  };

  return (
    <div className="chat">
      <div className="chat-area">
        {chatHistory.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.message}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userInput}
          onChange={handleUserInput}
          placeholder="Ask a question"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
