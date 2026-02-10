import React, { useState, useEffect } from "react";
import { useUserContext } from "../../context/UserContext";
import PrimaryButton from "../ui/PrimaryButton";
import { useNavigate } from "react-router-dom";

const ChatSection = () => {
  const { socket, roomId, strangerName } = useUserContext();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("Connecting...");
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId = null;
    if (!roomId) {
      navigate("/queue");
    }
    const intervalId = setTimeout(() => {
      // Check if we are still connecting and have no room ID
      // We check !roomId because if we have a room, we shouldn't redirect
      if (!roomId && status === "Connecting...") {
        navigate("/queue");
      }
    }, 3000);
    if (roomId) {
      setStatus(`Connected with ${strangerName || "Stranger"}`);
    }
    socket.on("waiting", (msg) => setStatus(msg));
    socket.on("stranger-left", (msg) => {
      setStatus(msg);
      setStrangerName(null);
      timeoutId = setTimeout(() => {
        navigate("/queue");
      }, 3000);
    });

    socket.on("start-chat", ({ roomId: newRoomId, user1, user2 }) => {
      setStatus("Connected");
    });

    socket.on("receive-message", (data) => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text: data.message, sender: "partner" },
      ]);
    });

    socket.on("display-typing", () => {
      setIsTyping(true);
    });

    socket.on("hide-typing", () => {
      setIsTyping(false);
    });

    return () => {
      socket.off("waiting");
      socket.off("start-chat");
      socket.off("receive-message");
      socket.off("stranger-left");
      socket.off("display-typing");
      socket.off("hide-typing");
      clearTimeout(intervalId);
      clearTimeout(timeoutId);
    };
  }, [socket, roomId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !roomId) return;

    // UI update karo
    setMessages([...messages, { id: Date.now(), text: message, sender: "me" }]);

    // Server ko bhejo
    socket.emit("send-message", { roomId, message });

    // Stop typing indicator immediately when sending
    socket.emit("stop-typing", { roomId });
    setMessage("");
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);

    socket.emit("typing", { roomId });

    if (typingTimeout) clearTimeout(typingTimeout);

    const newTimeout = setTimeout(() => {
      socket.emit("stop-typing", { roomId });
    }, 1000);

    setTypingTimeout(newTimeout);
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
          {isTyping && (
            <div className="message-bubble partner-message typing-indicator">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          )}
        </div>

        <form className="input-area" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={handleInputChange}
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
