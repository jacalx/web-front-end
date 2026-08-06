// ===== Modal Component =====
// A reusable popup/modal dialog that overlays the screen.
// Props:
//   - isOpen: boolean that controls whether the modal is visible
//   - onClose: function to call when the modal should close
//   - title: optional heading text
//   - children: the content inside the modal body
//   - showClose: whether to show the X close button (default: true)

import { FaTimes, FaCheckCircle } from "react-icons/fa";

function Modal({ isOpen, onClose, title, children, showClose = true }) {
  // If isOpen is false, don't render anything
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* stopPropagation prevents clicking inside the modal from closing it */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        {showClose && (
          <div className="modal-header">
            <h3 className="modal-title">
              {title || "Notification"}
            </h3>
            <button className="modal-close" onClick={onClose} aria-label="Close">
              <FaTimes />
            </button>
          </div>
        )}

        {/* Modal Body - renders whatever children are passed in */}
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;