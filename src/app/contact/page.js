"use client";
// ===== Contact Page =====
// Contact form with name, email, subject, message, and submit button.
// Also includes a Google Map placeholder and social media icons.

import { useState } from "react";
import {
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebookF,
  FaInstagram, FaTelegram, FaPaperPlane,
} from "react-icons/fa";
import Breadcrumb from "../component/Breadcrumb/Breadcrumb";
import Modal from "../component/Modal/Modal";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="contact page-fade">
      <div className="contact-container">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Home", to: "/" },
            { label: "Contact" },
          ]}
        />

        {/* Header */}
        <div className="contact-header">
          <h1 className="contact-title">Get in Touch</h1>
          <p className="contact-subtitle">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="contact-layout">
          {/* ===== Left: Contact Form ===== */}
          <div className="contact-form-section">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="floating-field">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="x"
                  required
                />
                <label>Your Name *</label>
              </div>

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

              <div className="floating-field">
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="x"
                  required
                />
                <label>Subject *</label>
              </div>

              <div className="floating-field">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="x"
                  rows="5"
                  required
                />
                <label>Message *</label>
              </div>

              <button type="submit" className="contact-submit-btn">
                <FaPaperPlane /> Send Message
              </button>
            </form>
          </div>

          {/* ===== Right: Contact Info + Map ===== */}
          <div className="contact-info-section">
            {/* Contact details */}
            <div className="contact-info-card">
              <h3 className="contact-info-title">Contact Information</h3>
              <ul className="contact-info-list">
                <li>
                  <div className="contact-info-icon"><FaMapMarkerAlt /></div>
                  <div>
                    <strong>Address</strong>
                    <span>Phnom Penh, Cambodia</span>
                  </div>
                </li>
                <li>
                  <div className="contact-info-icon"><FaPhone /></div>
                  <div>
                    <strong>Phone</strong>
                    <span>+855 12 345 678</span>
                  </div>
                </li>
                <li>
                  <div className="contact-info-icon"><FaEnvelope /></div>
                  <div>
                    <strong>Email</strong>
                    <span>info@studentmarket.edu.kh</span>
                  </div>
                </li>
              </ul>

              {/* Social media icons */}
              <div className="contact-social">
                <a href="#" className="contact-social-link" aria-label="Facebook"><FaFacebookF /></a>
                <a href="#" className="contact-social-link" aria-label="Instagram"><FaInstagram /></a>
                <a href="#" className="contact-social-link" aria-label="Telegram"><FaTelegram /></a>
              </div>
            </div>

            {/* Google Map placeholder */}
            <div className="contact-map">
              <div className="contact-map-placeholder">
                <FaMapMarkerAlt className="contact-map-icon" />
                <p>Google Map Placeholder</p>
                <span>Phnom Penh, Cambodia</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success modal */}
      <Modal isOpen={showSuccess} onClose={() => setShowSuccess(false)} showClose={false}>
        <div className="contact-success">
          <FaPaperPlane className="contact-success-icon" />
          <h2>Message Sent!</h2>
          <p>Thank you for contacting us. We'll get back to you soon.</p>
          <button className="contact-success-btn" onClick={() => setShowSuccess(false)}>
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Contact;
