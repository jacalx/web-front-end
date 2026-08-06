"use client";
// ===== Edit Profile Page =====
// Allows the user to edit their profile information.
// Fields: photo, name, phone, university, bio. Email is shown but read-only.
// Changes are saved to Strapi via AppContext.updateProfile -> PUT /api/profile.

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaSave, FaImage, FaArrowLeft } from "react-icons/fa";
import { useApp } from "../../../context/AppContext";
import Breadcrumb from "../../component/Breadcrumb/Breadcrumb";
import { universities } from "../../../data/products";

function EditProfile() {
  const router = useRouter();
  const { currentUser, profileLoading, updateProfile } = useApp();

  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    phone: currentUser?.phone || "",
    university: currentUser?.university || "",
    bio: currentUser?.bio || "",
    email: currentUser?.email || "",
  });

  const [imagePreview, setImagePreview] = useState(currentUser?.avatar || "");
  const [imageFile, setImageFile] = useState(null); // real File, uploaded to Clerk directly
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!profileLoading && !currentUser) {
      router.push("/login");
    }
  }, [profileLoading, currentUser, router]);

  // formData's useState initial value only runs once — but currentUser
  // arrives asynchronously (it depends on the Strapi profile fetch), so
  // without this the form can render permanently blank if this page mounts
  // before that fetch resolves. Sync once real data shows up.
  useEffect(() => {
    if (!currentUser) return;
    setFormData({
      name: currentUser.name || "",
      phone: currentUser.phone || "",
      university: currentUser.university || "",
      bio: currentUser.bio || "",
      email: currentUser.email || "",
    });
    setImagePreview(currentUser.avatar || "");
  }, [currentUser]);

  if (profileLoading || !currentUser) {
    return null;
  }

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await updateProfile({
        ...formData,
        avatarFile: imageFile, // only set when the user actually picked a new photo
      });
      router.push("/profile");
    } catch (err) {
      // Previously this only logged to the console — the save silently
      // "did nothing" from the user's point of view with no indication of
      // why (a Strapi permission error, a field mismatch, a network
      // failure, etc. all looked identical: nothing happened). Surface it.
      console.error("Failed to update profile:", err);
      setError(err.message || "Failed to save changes. Please try again.");
      setSaving(false);
    }
  };

  return (
    <div className="editprofile page-fade">
      <div className="editprofile-container">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Home", to: "/" },
            { label: "Profile", to: "/profile" },
            { label: "Edit Profile" },
          ]}
        />

        {/* Back link */}
        <Link href="/profile" className="editprofile-back">
          <FaArrowLeft /> Back to Profile
        </Link>

        {/* Page header */}
        <div className="editprofile-header">
          <h1 className="editprofile-title">Edit Profile</h1>
          <p className="editprofile-subtitle">Update your account information</p>
        </div>

        {error && <div className="editprofile-error">{error}</div>}

        {/* Form card */}
        <form className="editprofile-form" onSubmit={handleSubmit}>
          {/* Photo upload */}
          <div className="editprofile-field">
            <label className="editprofile-label">Profile Photo</label>
            <div className="editprofile-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                id="editprofile-file"
                className="editprofile-file-input"
              />
              <label htmlFor="editprofile-file" className="editprofile-upload-area">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="editprofile-preview" />
                ) : (
                  <div className="editprofile-upload-placeholder">
                    <FaImage className="editprofile-upload-icon" />
                    <span>Upload photo</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Name */}
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

          {/* Email (read-only — identity comes from Clerk, not editable here) */}
          <div className="floating-field">
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="x"
              readOnly
              disabled
              title="Email can't be changed here"
            />
            <label>Email</label>
          </div>

          {/* Phone */}
          <div className="floating-field">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="x"
            />
            <label>Phone</label>
          </div>

          {/* University */}
          <div className="floating-field">
            <select
              name="university"
              value={formData.university}
              onChange={handleChange}
            >
              <option value="">Select university</option>
              {universities.map((uni) => (
                <option key={uni} value={uni}>{uni}</option>
              ))}
            </select>
            <label>University</label>
          </div>

          {/* Bio */}
          <div className="floating-field">
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="x"
              rows="4"
            />
            <label>Bio</label>
          </div>

          {/* Save button */}
          <button type="submit" className="editprofile-save-btn" disabled={saving}>
            <FaSave /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
