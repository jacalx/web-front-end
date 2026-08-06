// ===== ChatPreview Component =====
// A compact preview of a conversation, shown in the chat sidebar.
// Props:
//   - conversation: the conversation object from data/messages.js
//   - isActive: whether this conversation is currently selected
//   - onClick: callback when the conversation is clicked

import { useState, useEffect } from "react";
import { FaCircle } from "react-icons/fa";

function ChatPreview({ conversation, isActive, onClick }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const formatTime = (timeStr) => {
    if (!mounted) return "";
    const date = new Date(timeStr);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div
      className={`chatpreview ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      {/* Avatar */}
      <img
        src={conversation.participantAvatar}
        alt={conversation.participantName}
        className="chatpreview-avatar"
      />

      {/* Conversation info */}
      <div className="chatpreview-info">
        <div className="chatpreview-top">
          <span className="chatpreview-name">{conversation.participantName}</span>
          <span className="chatpreview-time">{formatTime(conversation.lastMessageTime)}</span>
        </div>
        <p className="chatpreview-last">{conversation.lastMessage}</p>
      </div>

      {/* Unread badge */}
      {conversation.unread > 0 && (
        <span className="chatpreview-badge">{conversation.unread}</span>
      )}
    </div>
  );
}

export default ChatPreview;