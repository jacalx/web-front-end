// ===== MESSAGES DATA =====
// Dummy chat messages between users
// Each conversation has an id, the other participant, and a list of messages

export const conversations = [
  {
    id: "c1",
    participantId: "u2",
    participantName: "Chan Dara",
    participantAvatar: "https://i.pravatar.cc/150?img=3",
    lastMessage: "Sure, I can meet at the campus cafe tomorrow.",
    lastMessageTime: "2024-07-10T14:30:00",
    unread: 2,
    messages: [
      { id: "m1", senderId: "u2", text: "Hi! Is the laptop still available?", time: "2024-07-10T14:00:00" },
      { id: "m2", senderId: "me", text: "Yes it is! Still in great condition.", time: "2024-07-10T14:05:00" },
      { id: "m3", senderId: "u2", text: "Great! Can I see it in person first?", time: "2024-07-10T14:10:00" },
      { id: "m4", senderId: "me", text: "Of course. When are you free?", time: "2024-07-10T14:15:00" },
      { id: "m5", senderId: "u2", text: "How about tomorrow afternoon?", time: "2024-07-10T14:20:00" },
      { id: "m6", senderId: "u2", text: "Sure, I can meet at the campus cafe tomorrow.", time: "2024-07-10T14:30:00" },
    ],
  },
  {
    id: "c2",
    participantId: "u4",
    participantName: "Kim Sreypich",
    participantAvatar: "https://i.pravatar.cc/150?img=9",
    lastMessage: "Thank you! The books are perfect.",
    lastMessageTime: "2024-07-09T10:15:00",
    unread: 0,
    messages: [
      { id: "m1", senderId: "u4", text: "Hello, I'm interested in the English textbooks.", time: "2024-07-09T09:00:00" },
      { id: "m2", senderId: "me", text: "Hi! Yes, they're available. All 3 books for $25.", time: "2024-07-09T09:30:00" },
      { id: "m3", senderId: "u4", text: "That's a great price. I'll take them!", time: "2024-07-09T09:45:00" },
      { id: "m4", senderId: "u4", text: "Thank you! The books are perfect.", time: "2024-07-09T10:15:00" },
    ],
  },
  {
    id: "c3",
    participantId: "u5",
    participantName: "Nget Visal",
    participantAvatar: "https://i.pravatar.cc/150?img=12",
    lastMessage: "Can you do $180 for the monitor?",
    lastMessageTime: "2024-07-08T16:45:00",
    unread: 1,
    messages: [
      { id: "m1", senderId: "u5", text: "Hey, is the Dell monitor still for sale?", time: "2024-07-08T16:00:00" },
      { id: "m2", senderId: "me", text: "Yes! Asking $200, barely used.", time: "2024-07-08T16:15:00" },
      { id: "m3", senderId: "u5", text: "Can you do $180 for the monitor?", time: "2024-07-08T16:45:00" },
    ],
  },
  {
    id: "c4",
    participantId: "u7",
    participantName: "Thorn Ratanak",
    participantAvatar: "https://i.pravatar.cc/150?img=20",
    lastMessage: "Sounds good! See you on Friday.",
    lastMessageTime: "2024-07-07T11:30:00",
    unread: 0,
    messages: [
      { id: "m1", senderId: "u7", text: "I want to buy the drafting table.", time: "2024-07-07T10:00:00" },
      { id: "m2", senderId: "me", text: "Sure! It's $45, pickup at ITC dorm.", time: "2024-07-07T10:30:00" },
      { id: "m3", senderId: "u7", text: "Sounds good! See you on Friday.", time: "2024-07-07T11:30:00" },
    ],
  },
];