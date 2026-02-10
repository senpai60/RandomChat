import React, { useState, useEffect } from "react";
import { useUserContext } from "../../context/UserContext";
import PrimaryButton from "../ui/PrimaryButton";

const ChatSection = () => {
  const { socket, roomId, strangerName } = useUserContext();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("Connecting...");

  useEffect(() => {
    if (roomId) {
      setStatus(`Connected with ${strangerName || "Stranger"}`);
    }
    socket.on("waiting", (msg) => setStatus(msg));

    socket.on("start-chat", ({ roomId: newRoomId, user1, user2 }) => {
      setStatus("Connected");
    });

    socket.on("receive-message", (data) => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text: data.message, sender: "partner" },
      ]);
    });

    return () => {
      socket.off("waiting");
      socket.off("start-chat");
      socket.off("receive-message");
    };
  }, [socket, roomId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !roomId) return;

    // UI update karo
    setMessages([...messages, { id: Date.now(), text: message, sender: "me" }]);

    // Server ko bhejo
    socket.emit("send-message", { roomId, message });
    setMessage("");
  };

  return (
    <section className="chat-section">
      <div className="chat-container">
        <header className="chat-header">
          <div className="user-info">
            <h3>{strangerName || "Stranger"}</h3>
            <span className="status">{status}</span>
          </div>
        </header>

        <div className="messages-area">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message-bubble ${msg.sender === "me" ? "my-message" : "partner-message"}`}
            >
              <p>{msg.text}</p>
            </div>
          ))}
        </div>

        <form className="input-area" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!roomId} // Jab tak connect na ho, type mat karne do
          />
          <button type="submit" className="send-btn" disabled={!roomId}>
            Send
          </button>
        </form>
      </div>
    </section>
  );
};

export default ChatSection;
