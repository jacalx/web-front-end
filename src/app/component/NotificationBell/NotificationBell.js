// ===== NotificationBell Component =====
// A bell icon that shows a dropdown of recent notifications.
// Shows an unread count badge. Used in the navbar.

import { useState } from "react";
import Link from "next/link";
import { FaBell, FaComment, FaHeart, FaCheck, FaFlag, FaInfoCircle } from "react-icons/fa";
import { notifications as dummyNotifications } from "../../../data/notifications";

function NotificationBell() {
  const [open, setOpen] = useState(false);

  const unread = dummyNotifications.filter((n) => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case "message": return <FaComment />;
      case "favorite": return <FaHeart />;
      case "sold": return <FaCheck />;
      case "report": return <FaFlag />;
      default: return <FaInfoCircle />;
    }
  };

  return (
    <div className="notifbell-wrapper">
      <button
        className="notifbell-btn"
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
      >
        <FaBell />
        {unread > 0 && <span className="notifbell-badge">{unread}</span>}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="notifbell-dropdown">
          <div className="notifbell-header">
            <h4>Notifications</h4>
            <span className="notifbell-unread">{unread} unread</span>
          </div>
          <div className="notifbell-list">
            {dummyNotifications.slice(0, 5).map((notif) => (
              <div
                key={notif.id}
                className={`notifbell-item ${!notif.read ? "unread" : ""}`}
              >
                <div className="notifbell-icon">{getIcon(notif.type)}</div>
                <div className="notifbell-content">
                  <p className="notifbell-title">{notif.title}</p>
                  <p className="notifbell-text">{notif.text}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/notifications"
            className="notifbell-viewall"
            onClick={() => setOpen(false)}
          >
            View All Notifications
          </Link>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
