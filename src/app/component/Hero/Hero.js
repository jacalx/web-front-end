// ===== Hero Component =====
// Editorial split layout: left content, right visual.
// Premium search, trust badges, live statistics, category quick-pills.

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaSearch, FaGraduationCap, FaShieldAlt, FaArrowRight, FaUsers, FaBoxOpen, FaStar } from "react-icons/fa";
import { categories } from "../../../data/products";
import { products } from "../../../data/products";
import { users } from "../../../data/users";

function Hero() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/marketplace?search=${encodeURIComponent(query)}`);
    } else {
      router.push("/marketplace");
    }
  };

  const quickCats = categories.slice(0, 6);
  const stats = [
    { icon: <FaBoxOpen />, value: `${products.length}+`, label: "Listings" },
    { icon: <FaUsers />, value: `${users.length}+`, label: "Students" },
    { icon: <FaStar />, value: "4.8", label: "Avg Rating" },
  ];

  return (
    <section className="hero">
      <div className="hero-inner">
        {/* Left: Content */}
        <div className="hero-content">
          {/* Trust badges */}
          <div className="hero-badges">
            <span className="hero-badge"><FaGraduationCap /> Verified Students</span>
            <span className="hero-badge"><FaShieldAlt /> Safe & Secure</span>
          </div>

          {/* Headline */}
          <h1 className="hero-title">
            The campus marketplace
            <span className="hero-title-accent">built for students.</span>
          </h1>

          <p className="hero-subtitle">
            Buy and sell textbooks, electronics, and supplies with verified
            peers across Cambodian universities. No middlemen, no markup.
          </p>

          {/* Search bar */}
          <form className="hero-search" onSubmit={handleSearch}>
            <FaSearch className="hero-search-icon" />
            <input
              type="text"
              placeholder="Search for textbooks, laptops, calculators..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="hero-search-btn">Search</button>
          </form>

          {/* Quick categories */}
          <div className="hero-cats">
            <span className="hero-cats-label">Popular:</span>
            {quickCats.map((cat) => (
              <button
                key={cat}
                className="hero-cat-pill"
                onClick={() => router.push(`/marketplace?category=${encodeURIComponent(cat)}`)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="hero-cta-row">
            <Link href="/register" className="hero-cta">
              Join Now <FaArrowRight />
            </Link>
            <Link href="/marketplace" className="hero-cta-secondary">
              Browse Products
            </Link>
          </div>
        </div>

        {/* Right: Visual + Stats */}
        <div className="hero-visual">
          <div className="hero-visual-card">
            <img
              src="https://images.pexels.com/photos/207580/pexels-photo-207580.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Students trading on campus"
              className="hero-visual-img"
            />
            <div className="hero-visual-overlay" />
          </div>

          {/* Stats */}
          <div className="hero-stats">
            {stats.map((stat, i) => (
              <div key={i} className="hero-stat">
                <span className="hero-stat-icon">{stat.icon}</span>
                <div className="hero-stat-info">
                  <span className="hero-stat-value">{stat.value}</span>
                  <span className="hero-stat-label">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
