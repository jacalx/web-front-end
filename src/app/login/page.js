"use client";
// ===== Login Page =====
// Google/Facebook sign-in is the primary path (matches how the friend's
// project works). Email/password stays as a fallback. Student ID was
// dropped per request. School-domain enforcement happens in DomainGuard.js
// for BOTH paths, since Google/Facebook have no idea about our rule.

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { FaSignInAlt } from "react-icons/fa";
import { FaGoogle, FaFacebook, FaTiktok } from "react-icons/fa6";

function Login() {
  const router = useRouter();
  const { isLoaded, signIn } = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleOAuth = async (strategy) => {
    if (!isLoaded) return;
    setError("");
    try {
      await signIn.authenticateWithRedirect({
        strategy, // "oauth_google" | "oauth_facebook" | "oauth_tiktok"
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
        // Google (and other providers that support it) will otherwise
        // silently reuse whichever Google account is already logged in
        // in the browser. select_account forces the account chooser to
        // show every time, so users can pick which account to use.
        ...(strategy === "oauth_google" ? { additionalData: { prompt: "select_account" } } : {}),
      });
    } catch (err) {
      setError(err?.errors?.[0]?.message || "Could not start sign-in. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isLoaded) return;

    setSubmitting(true);
    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status !== "complete") {
        setError("Invalid email or password");
        setSubmitting(false);
        return;
      }
      if (remember) localStorage.setItem("sm_remember", "true");
      router.push("/");
    } catch (err) {
      setError(err?.errors?.[0]?.message || "Invalid email or password");
      setSubmitting(false);
    }
  };

  return (
    <div className="login page-fade">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in to your student account</p>
          </div>

          {error && <div className="login-error">{error}</div>}

          <div className="login-oauth-buttons" style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
            <button
              type="button"
              className="login-btn"
              style={{ background: "#fff", color: "#333", border: "1px solid #ddd" }}
              onClick={() => handleOAuth("oauth_google")}
            >
              <FaGoogle /> Continue with Google
            </button>
            <button
              type="button"
              className="login-btn"
              style={{ background: "#1877F2", color: "#fff" }}
              onClick={() => handleOAuth("oauth_facebook")}
            >
              <FaFacebook /> Continue with Facebook
            </button>
            <button
              type="button"
              className="login-btn"
              style={{ background: "#000", color: "#fff" }}
              onClick={() => handleOAuth("oauth_tiktok")}
            >
              <FaTiktok /> Continue with TikTok
            </button>
          </div>

          <div style={{ textAlign: "center", color: "#999", margin: "16px 0", fontSize: "14px" }}>
            — or sign in with email —
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="floating-field">
              <input
                type="email"
                id="login-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="x"
                required
              />
              <label htmlFor="login-email">Email *</label>
            </div>

            <div className="floating-field">
              <input
                type="password"
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="x"
                required
              />
              <label htmlFor="login-password">Password *</label>
            </div>

            <div className="login-options">
              <label className="login-remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <a href="#" className="login-forgot">Forgot password?</a>
            </div>

            <button type="submit" className="login-btn" disabled={submitting}>
              <FaSignInAlt /> {submitting ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="login-register-text">
            Don't have an account? <Link href="/register" className="login-register-link">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
