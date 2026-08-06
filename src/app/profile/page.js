"use client";
// ===== Profile Page =====
// Student identity: verification, trust score, reviews, sales, achievements.

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaEdit, FaSignOutAlt, FaStar, FaStore, FaShoppingBag,
  FaShoppingCart, FaEnvelope, FaPhone, FaIdCard, FaUniversity,
  FaCheckCircle, FaAward, FaMedal, FaTrophy, FaShieldAlt,
  FaThumbsUp, FaHandshake, FaRocket,
} from "react-icons/fa";
import { useApp } from "../../context/AppContext";
import Breadcrumb from "../component/Breadcrumb/Breadcrumb";

function Profile() {
  const { currentUser, logout } = useApp();
  const router = useRouter();
  const [myProducts, setMyProducts] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    let ignore = false;
    fetch(`/api/products?sellerId=${encodeURIComponent(currentUser.id)}`)
      .then((res) => res.json())
      .then((data) => { if (!ignore) setMyProducts(data.products || []); })
      .catch(() => {});
    return () => { ignore = true; };
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="profile page-fade">
        <div className="profile-container">
          <div className="profile-not-logged-in">
            <h2>Please log in to view your profile</h2>
            <Link href="/login" className="profile-login-prompt-btn">Login</Link>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = () => { logout(); router.push("/"); };

  const soldCount = currentUser.productsSold || 0;
  const listedCount = currentUser.productsListed || 0;
  const boughtCount = currentUser.productsBought || 0;
  const rating = currentUser.rating || 5.0;

  const trustScore = Math.min(100, Math.round(
    (rating / 5) * 40 + Math.min(soldCount, 10) * 3 + Math.min(listedCount, 10) * 2 + Math.min(boughtCount, 5) * 2 + 10
  ));

  const stats = [
    { icon: <FaStore />, label: "Listed", value: listedCount, color: "primary" },
    { icon: <FaShoppingBag />, label: "Sold", value: soldCount, color: "success" },
    { icon: <FaShoppingCart />, label: "Bought", value: boughtCount, color: "info" },
    { icon: <FaStar />, label: "Rating", value: `${rating} / 5`, color: "warning" },
  ];

  const achievements = [
    { icon: <FaCheckCircle />, title: "Verified Student", desc: "Identity confirmed", unlocked: currentUser.verified, color: "success" },
    { icon: <FaRocket />, title: "First Sale", desc: "Sold your first item", unlocked: soldCount >= 1, color: "primary" },
    { icon: <FaHandshake />, title: "Trusted Seller", desc: "5+ items sold", unlocked: soldCount >= 5, color: "accent" },
    { icon: <FaMedal />, title: "Active Member", desc: "10+ listings posted", unlocked: listedCount >= 10, color: "warning" },
    { icon: <FaTrophy />, title: "Top Seller", desc: "Rating 4.8 or higher", unlocked: rating >= 4.8, color: "error" },
    { icon: <FaAward />, title: "Marketplace Pro", desc: "15+ total transactions", unlocked: (soldCount + boughtCount) >= 15, color: "info" },
  ];

  const reviews = [
    { name: "Chan Dara", rating: 5, text: "Great seller, fast response and fair price!", time: "2 weeks ago" },
    { name: "Kim Sreypich", rating: 5, text: "Item was exactly as described. Recommended!", time: "1 month ago" },
    { name: "Ly Hour", rating: 4, text: "Smooth transaction, would buy again.", time: "2 months ago" },
  ];

  return (
    <div className="profile page-fade">
      <div className="profile-container">
        <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Profile" }]} />

        {/* Header card */}
        <div className="profile-header-card">
          <div className="profile-header-top">
            <div className="profile-avatar-wrap">
              <img
                src={currentUser.avatar || "https://i.pravatar.cc/150?img=1"}
                alt={currentUser.name}
                className="profile-avatar"
              />
              {currentUser.verified && (
                <span className="profile-avatar-badge" title="Verified student">
                  <FaCheckCircle />
                </span>
              )}
            </div>
            <div className="profile-info">
              <div className="profile-name-row">
                <h1 className="profile-name">{currentUser.name}</h1>
                {currentUser.verified && (
                  <span className="profile-verified"><FaCheckCircle /> Verified</span>
                )}
              </div>
              <p className="profile-bio">{currentUser.bio || "No bio yet."}</p>
              <div className="profile-details">
                <span><FaUniversity /> {currentUser.university}</span>
                <span><FaEnvelope /> {currentUser.email}</span>
                <span><FaPhone /> {currentUser.phone}</span>
              </div>
            </div>
            <div className="profile-actions">
              <Link href="/profile/edit" className="profile-edit-btn">
                <FaEdit /> Edit Profile
              </Link>
              <button className="profile-logout-btn" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>

          {/* Trust score bar */}
          <div className="profile-trust">
            <div className="profile-trust-head">
              <span className="profile-trust-label"><FaShieldAlt /> Trust Score</span>
              <span className={`profile-trust-value ${trustScore >= 80 ? "high" : trustScore >= 50 ? "mid" : "low"}`}>
                {trustScore} / 100
              </span>
            </div>
            <div className="profile-trust-track">
              <div
                className={`profile-trust-fill ${trustScore >= 80 ? "high" : trustScore >= 50 ? "mid" : "low"}`}
                style={{ width: `${trustScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="profile-stats">
          {stats.map((stat, i) => (
            <div key={i} className={`profile-stat-card profile-stat-${stat.color}`}>
              <div className="profile-stat-icon">{stat.icon}</div>
              <div className="profile-stat-info">
                <span className="profile-stat-value">{stat.value}</span>
                <span className="profile-stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div className="profile-section">
          <h2 className="profile-section-title"><FaAward /> Achievements</h2>
          <div className="profile-achievements">
            {achievements.map((ach, i) => (
              <div
                key={i}
                className={`profile-achievement ${ach.unlocked ? "unlocked" : "locked"} profile-ach-${ach.color}`}
              >
                <div className="profile-achievement-icon">{ach.icon}</div>
                <div className="profile-achievement-info">
                  <span className="profile-achievement-title">{ach.title}</span>
                  <span className="profile-achievement-desc">{ach.desc}</span>
                </div>
                {!ach.unlocked && <span className="profile-achievement-lock">Locked</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="profile-section">
          <h2 className="profile-section-title"><FaThumbsUp /> Reviews ({reviews.length})</h2>
          <div className="profile-reviews">
            {reviews.map((review, i) => (
              <div key={i} className="profile-review">
                <div className="profile-review-head">
                  <strong>{review.name}</strong>
                  <div className="profile-review-stars">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <FaStar key={j} className={j < review.rating ? "filled" : ""} />
                    ))}
                  </div>
                </div>
                <p>{review.text}</p>
                <span className="profile-review-time">{review.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="profile-quick-links">
          <Link href="/my-products" className="profile-quick-link">
            <FaStore /> My Products
          </Link>
          <Link href="/wishlist" className="profile-quick-link">
            <FaStar /> Wishlist
          </Link>
          <Link href="/chat" className="profile-quick-link">
            <FaEnvelope /> Messages
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Profile;
