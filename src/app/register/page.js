"use client";
// ===== Register Page =====
// Google/Facebook sign-up is the primary path. Email/password form stays
// as a fallback. Student ID was dropped per request. School-domain
// enforcement happens in DomainGuard.js for BOTH paths.

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignUp, useClerk } from "@clerk/nextjs";
import { FaImage, FaUserPlus } from "react-icons/fa";
import { FaGoogle, FaFacebook, FaTiktok } from "react-icons/fa6";

function Register() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const clerk = useClerk();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [imagePreview, setImagePreview] = useState(""); // base64, for on-screen preview only
  const [imageFile, setImageFile] = useState(null);       // the real File, uploaded to Clerk directly
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleOAuth = async (strategy) => {
    if (!isLoaded) return;
    setError("");
    try {
      await signUp.authenticateWithRedirect({
        strategy, // "oauth_google" or "oauth_facebook"
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
        ...(strategy === "oauth_google" ? { additionalData: { prompt: "select_account" } } : {}),
      });
    } catch (err) {
      setError(err?.errors?.[0]?.message || "Could not start sign-up. Please try again.");
    }
  };

  const validate = () => {
    if (!formData.name) return "Full name is required";
    if (!formData.email) return "Email is required";
    if (!formData.phone) return "Phone number is required";
    if (!formData.password) return "Password is required";
    if (formData.password.length < 6) return "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) return "Passwords do not match";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!isLoaded) return;
    setSubmitting(true);

    try {
      await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
        firstName: formData.name.split(" ")[0],
        lastName: formData.name.split(" ").slice(1).join(" ") || undefined,
        unsafeMetadata: {
          // Read once by /api/profile's auto-create (GET) the first time this
          // user's Strapi profile is created, then never touched again —
          // Strapi is the ongoing source of truth for phone from then on.
          phone: formData.phone,
        },
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      setError(err?.errors?.[0]?.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    if (!isLoaded) return;
    setSubmitting(true);

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });

        // Upload the photo to Clerk's own avatar storage (not metadata —
        // metadata is capped at 8KB and a photo blows past that instantly).
        if (imageFile && clerk.user) {
          try {
            await clerk.user.setProfileImage({ file: imageFile });
          } catch (imgErr) {
            // Don't block account creation just because the photo upload failed.
            console.error("Profile image upload failed:", imgErr);
          }
        }

        router.push("/");
      } else {
        setError("Verification incomplete. Please check the code and try again.");
      }
    } catch (err) {
      setError(err?.errors?.[0]?.message || "Invalid or expired code.");
    } finally {
      setSubmitting(false);
    }
  };

  if (pendingVerification) {
    return (
      <div className="register page-fade">
        <div className="register-container">
          <div className="register-card">
            <div className="register-header">
              <h1 className="register-title">Check your email</h1>
              <p className="register-subtitle">
                We sent a verification code to {formData.email}
              </p>
            </div>

            {error && <div className="register-error">{error}</div>}

            <form className="register-form" onSubmit={handleVerify}>
              <div className="floating-field">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="x"
                  required
                />
                <label>Verification Code *</label>
              </div>

              <button type="submit" className="register-btn" disabled={submitting}>
                <FaUserPlus /> {submitting ? "Verifying..." : "Verify & Create Account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register page-fade">
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <h1 className="register-title">Create Account</h1>
            <p className="register-subtitle">Join the Student Marketplace community</p>
          </div>

          {error && <div className="register-error">{error}</div>}

          <div className="register-oauth-buttons" style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
            <button
              type="button"
              className="register-btn"
              style={{ background: "#fff", color: "#333", border: "1px solid #ddd" }}
              onClick={() => handleOAuth("oauth_google")}
            >
              <FaGoogle /> Continue with Google
            </button>
            <button
              type="button"
              className="register-btn"
              style={{ background: "#1877F2", color: "#fff" }}
              onClick={() => handleOAuth("oauth_facebook")}
            >
              <FaFacebook /> Continue with Facebook
            </button>
            <button
              type="button"
              className="register-btn"
              style={{ background: "#000", color: "#fff" }}
              onClick={() => handleOAuth("oauth_tiktok")}
            >
              <FaTiktok /> Continue with TikTok
            </button>
          </div>

          <div style={{ textAlign: "center", color: "#999", margin: "16px 0", fontSize: "14px" }}>
            — or register with email —
          </div>

          <form className="register-form" onSubmit={handleSubmit}>
            {/* Profile Image Upload */}
            <div className="register-field">
              <label className="register-label">Profile Image</label>
              <div className="register-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  id="register-file"
                  className="register-file-input"
                />
                <label htmlFor="register-file" className="register-upload-area">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="register-preview" />
                  ) : (
                    <div className="register-upload-placeholder">
                      <FaImage className="register-upload-icon" />
                      <span>Upload photo</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Full Name */}
            <div className="floating-field">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="x"
                required
              />
              <label>Full Name *</label>
            </div>

            {/* Email */}
            <div className="floating-field">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="x"
                required
              />
              <label>Email *</label>
            </div>

            {/* Phone */}
            <div className="floating-field">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="x"
                required
              />
              <label>Phone *</label>
            </div>

            {/* Password and Confirm Password */}
            <div className="register-row">
              <div className="floating-field">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="x"
                  required
                />
                <label>Password *</label>
              </div>

              <div className="floating-field">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="x"
                  required
                />
                <label>Confirm Password *</label>
              </div>
            </div>

            {/* Clerk needs this empty div to mount its bot-protection widget (CAPTCHA) */}
            <div id="clerk-captcha" />

            <button type="submit" className="register-btn" disabled={submitting}>
              <FaUserPlus /> {submitting ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="register-login-text">
            Already have an account? <Link href="/login" className="register-login-link">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
