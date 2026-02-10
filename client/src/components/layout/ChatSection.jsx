import React, { useState } from "react";
import PrimaryButton from "../ui/PrimaryButton";

const ChatSection = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey there!", sender: "partner" },
    { id: 2, text: "Hi! How's it going?", sender: "me" },
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setMessages([...messages, { id: Date.now(), text: message, sender: "me" }]);
    setMessage("");
  };

  return (
    <section className="chat-section">
      <div className="chat-container">
        <header className="chat-header">
          <div className="avatar-placeholder">P</div>
          <div className="user-info">
            <h3>Partner</h3>
            <span className="status">Online</span>
          </div>
          <PrimaryButton className="exit-btn">Exit</PrimaryButton>
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
          />
          <button type="submit" className="send-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    </section>
  );
};

export default ChatSection;
