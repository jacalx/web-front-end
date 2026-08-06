// ===== LoadingSpinner Component =====
// A simple animated loading indicator shown while data is being fetched.
// Props:
//   - size: "small", "medium", or "large" (default: "medium")
//   - message: optional text to display below the spinner



function LoadingSpinner({ size = "medium", message = "" }) {
  return (
    <div className={`loading-spinner-wrapper loading-${size}`}>
      {/* The spinner is a div with a CSS animation that rotates it */}
      <div className="loading-spinner"></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
}

export default LoadingSpinner;