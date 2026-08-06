"use client";
// ===== Chat Page =====
// Modern messenger with product preview, typing indicator, and meet-up planning.

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  FaSearch, FaPaperPlane, FaSmile, FaComments, FaMapMarkerAlt,
  FaCalendarAlt, FaImage, FaCheck, FaCheckDouble,
} from "react-icons/fa";
import { conversations as dummyConversations } from "../../data/messages";
import ChatPreview from "../component/ChatPreview/ChatPreview";

function Chat() {
  const [conversations, setConversations] = useState(dummyConversations);
  const [activeId, setActiveId] = useState(dummyConversations[0]?.id || null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showMeetup, setShowMeetup] = useState(false);
  const [meetup, setMeetup] = useState({ location: "Campus Cafe", date: "Tomorrow", time: "2:00 PM" });
  const [demoProduct, setDemoProduct] = useState(null);

  const messagesEndRef = useRef(null);
  const activeConversation = conversations.find((c) => c.id === activeId);

  // Chat threads are still demo data (no real messaging backend yet) — this
  // just pulls one real listing from Strapi to preview in the first thread,
  // instead of a hardcoded mock product id that no longer exists.
  useEffect(() => {
    fetch("/api/products?pageSize=1")
      .then((res) => res.json())
      .then((data) => setDemoProduct(data.products?.[0] || null))
      .catch(() => {});
  }, []);

  const linkedProduct = activeId === "c1" ? demoProduct : null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages, isTyping]);

  const filteredConversations = conversations.filter((c) =>
    c.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim() || !activeConversation) return;

    const newMessage = {
      id: `m${Date.now()}`,
      senderId: "me",
      text: message,
      time: new Date().toISOString(),
    };

    const updatedConversations = conversations.map((c) =>
      c.id === activeId
        ? { ...c, messages: [...c.messages, newMessage], lastMessage: message, lastMessageTime: new Date().toISOString(), unread: 0 }
        : c
    );
    setConversations(updatedConversations);
    setMessage("");
    setShowEmojis(false);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const reply = {
        id: `m${Date.now() + 1}`,
        senderId: activeConversation.participantId,
        text: "Got it, thanks! Let me check and get back to you.",
        time: new Date().toISOString(),
      };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? { ...c, messages: [...c.messages, reply], lastMessage: reply.text, lastMessageTime: new Date().toISOString() }
            : c
        )
      );
    }, 1800);
  };

  const emojis = ["😀", "😂", "❤️", "👍", "🎉", "🔥", "😊", "🙏", "💯", "😎", "✅", "🤝"];
  const addEmoji = (emoji) => { setMessage(message + emoji); setShowEmojis(false); };

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const formatTime = (timeStr) => {
    if (!mounted) return "";
    return new Date(timeStr).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  return (
    <div className="chat page-fade">
      <div className="chat-container">
        {/* Sidebar */}
        <div className="chat-sidebar">
          <div className="chat-sidebar-header">
            <h2 className="chat-sidebar-title"><FaComments /> Messages</h2>
          </div>
          <div className="chat-search">
            <FaSearch className="chat-search-icon" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="chat-search-input"
              aria-label="Search conversations"
            />
          </div>
          <div className="chat-conversations">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => (
                <ChatPreview
                  key={conv.id}
                  conversation={conv}
                  isActive={conv.id === activeId}
                  onClick={() => setActiveId(conv.id)}
                />
              ))
            ) : (
              <div className="chat-empty-search">No conversations found</div>
            )}
          </div>
        </div>

        {/* Window */}
        <div className="chat-window">
          {activeConversation ? (
            <>
              <div className="chat-header">
                <img src={activeConversation.participantAvatar} alt={activeConversation.participantName} className="chat-header-avatar" />
                <div className="chat-header-info">
                  <h3 className="chat-header-name">{activeConversation.participantName}</h3>
                  <span className="chat-header-status">Online</span>
                </div>
                <button
                  className="chat-meetup-btn"
                  onClick={() => setShowMeetup(!showMeetup)}
                  aria-label="Plan meetup"
                >
                  <FaMapMarkerAlt /> <span>Meetup</span>
                </button>
              </div>

              {/* Meetup panel */}
              {showMeetup && (
                <div className="chat-meetup-panel">
                  <h4><FaCalendarAlt /> Plan a Meetup</h4>
                  <div className="chat-meetup-fields">
                    <div className="chat-meetup-field">
                      <label>Location</label>
                      <input
                        type="text"
                        value={meetup.location}
                        onChange={(e) => setMeetup({ ...meetup, location: e.target.value })}
                      />
                    </div>
                    <div className="chat-meetup-field">
                      <label>Date</label>
                      <input
                        type="text"
                        value={meetup.date}
                        onChange={(e) => setMeetup({ ...meetup, date: e.target.value })}
                      />
                    </div>
                    <div className="chat-meetup-field">
                      <label>Time</label>
                      <input
                        type="text"
                        value={meetup.time}
                        onChange={(e) => setMeetup({ ...meetup, time: e.target.value })}
                      />
                    </div>
                  </div>
                  <button
                    className="chat-meetup-send"
                    onClick={() => {
                      setMessage(`Let's meet at ${meetup.location} on ${meetup.date} at ${meetup.time}. Does that work for you?`);
                      setShowMeetup(false);
                    }}
                  >
                    Send meetup proposal
                  </button>
                </div>
              )}

              {/* Messages */}
              <div className="chat-messages">
                {/* Linked product preview */}
                {linkedProduct && (
                  <Link href={`/product/${linkedProduct.id}`} className="chat-product-preview">
                    <img src={linkedProduct.images[0]} alt={linkedProduct.name} />
                    <div className="chat-product-info">
                      <span className="chat-product-name">{linkedProduct.name}</span>
                      <span className="chat-product-price">${linkedProduct.price}</span>
                      <span className="chat-product-cond">{linkedProduct.condition} • {linkedProduct.category}</span>
                    </div>
                    <span className="chat-product-link">View</span>
                  </Link>
                )}

                {activeConversation.messages.map((msg) => (
                  <div key={msg.id} className={`chat-message ${msg.senderId === "me" ? "sent" : "received"}`}>
                    <div className="chat-message-bubble">
                      <p>{msg.text}</p>
                      <span className="chat-message-time">
                        {formatTime(msg.time)} {msg.senderId === "me" && <FaCheckDouble className="chat-read" />}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="chat-message received">
                    <div className="chat-message-bubble chat-typing">
                      <span className="chat-typing-dot" />
                      <span className="chat-typing-dot" />
                      <span className="chat-typing-dot" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Emoji picker */}
              {showEmojis && (
                <div className="chat-emoji-picker">
                  {emojis.map((emoji) => (
                    <button key={emoji} className="chat-emoji-btn" onClick={() => addEmoji(emoji)}>{emoji}</button>
                  ))}
                </div>
              )}

              {/* Input */}
              <form className="chat-input-area" onSubmit={handleSend}>
                <button type="button" className="chat-emoji-toggle" onClick={() => setShowEmojis(!showEmojis)} aria-label="Emoji">
                  <FaSmile />
                </button>
                <button type="button" className="chat-attach-btn" aria-label="Attach image">
                  <FaImage />
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="chat-input"
                  aria-label="Message"
                />
                <button type="submit" className="chat-send-btn" disabled={!message.trim()} aria-label="Send">
                  <FaPaperPlane />
                </button>
              </form>
            </>
          ) : (
            <div className="chat-no-conversation">
              <FaComments className="chat-no-conv-icon" />
              <h3>Select a conversation</h3>
              <p>Choose a chat from the list to start messaging.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;
