// ===== Navbar Component =====
// Floating glassmorphism navigation with search, notification dropdown, profile dropdown.

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  FaBars, FaTimes, FaBell, FaUser, FaSignOutAlt, FaStore,
  FaSearch, FaHeart, FaComment, FaChevronDown, FaTag,
  FaCheck, FaCheckDouble,
} from "react-icons/fa";
import { useApp } from "../../../context/AppContext";
import { notifications as dummyNotifications } from "../../../data/notifications";
import { categories } from "../../../data/products";
import { useLiveSearch } from "../../hooks/useLiveSearch";
import SearchSuggestions from "../SearchSuggestions/SearchSuggestions";
import "../SearchSuggestions/SearchSuggestions.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifs, setNotifs] = useState(dummyNotifications);

  // Live "type-ahead" suggestions (categories + products) shown while
  // typing in either the desktop or the mobile search box.
  const [searchOpen, setSearchOpen] = useState(false); // desktop dropdown visibility
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false); // mobile dropdown visibility
  const [activeIndex, setActiveIndex] = useState(-1); // keyboard-highlighted row
  const { categoryMatches, productMatches, loading } = useLiveSearch(searchQuery);
  const suggestionCount = categoryMatches.length + productMatches.length;

  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const { currentUser, logout, wishlist, hydrated } = useApp();
  const router = useRouter();
  const pathname = usePathname();

  const unreadCount = notifs.filter((n) => !n.read).length;
  const wishlistCount = wishlist.length;

  useEffect(() => {
    setProfileOpen(false);
    setMenuOpen(false);
    setCatOpen(false);
    setNotifOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target)) {
        setMobileSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // If a suggestion row is keyboard-highlighted, Enter picks that
    // instead of doing a plain text search.
    const suggestions = [...categoryMatches, ...productMatches];
    if (activeIndex >= 0 && activeIndex < suggestions.length) {
      const picked = suggestions[activeIndex];
      typeof picked === "string" ? goToCategory(picked) : goToProduct(picked);
      return;
    }
    if (searchQuery.trim()) {
      setSearchOpen(false);
      setMobileSearchOpen(false);
      router.push(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const goToCategory = (category) => {
    setSearchOpen(false);
    setMobileSearchOpen(false);
    setActiveIndex(-1);
    router.push(`/marketplace?category=${encodeURIComponent(category)}`);
  };

  const goToProduct = (product) => {
    setSearchOpen(false);
    setMobileSearchOpen(false);
    setActiveIndex(-1);
    router.push(`/product/${product.id}`);
  };

  const handleSearchKeyDown = (e) => {
    const total = suggestionCount;
    if (!total) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % total);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? total - 1 : i - 1));
    } else if (e.key === "Escape") {
      setSearchOpen(false);
      setMobileSearchOpen(false);
    }
  };

  const markAllRead = () => {
    setNotifs(notifs.map((n) => ({ ...n, read: true })));
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case "message": return <FaComment />;
      case "favorite": return <FaHeart />;
      case "sold": return <FaCheck />;
      case "report": return <FaTag />;
      default: return <FaBell />;
    }
  };

  const formatNotifTime = (timeStr) => {
    if (!hydrated) return "";
    const date = new Date(timeStr);
    const now = new Date();
    const diffH = Math.floor((now - date) / (1000 * 60 * 60));
    if (diffH >= 24) return `${Math.floor(diffH / 24)}d`;
    if (diffH > 0) return `${diffH}h`;
    return "now";
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/marketplace", label: "Browse" },
    { to: "/sell", label: "Sell" },
    { to: "/about", label: "About" },
  ];

  return (
    <header className={`nb ${scrolled ? "scrolled" : ""}`}>
      <div className="nb-bar">
        <div className="nb-inner">

          {/* Logo */}
          <Link href="/" className="nb-logo" aria-label="Home">
            <img src="/logo.png" alt="Logo" style={{ width: 40, height: 40, objectFit: "contain" }} />
            <span className="nb-logo-text">STmarket</span>
          </Link>

          {/* Nav links */}
          <nav className="nb-nav" aria-label="Primary">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                href={link.to}
                className={`nb-nav-link ${pathname === link.to ? "active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search */}
          <div className="nb-search-wrapper" ref={searchRef}>
            <form className="nb-search" onSubmit={handleSearch} role="search" autoComplete="off">
              <FaSearch className="nb-search-icon" />
              <input
                type="text"
                placeholder="Search products, categories..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                  setActiveIndex(-1);
                }}
                onFocus={() => setSearchOpen(true)}
                onKeyDown={handleSearchKeyDown}
                className="nb-search-input"
                aria-label="Search products"
              />
            </form>
            {searchOpen && searchQuery.trim() && (
              <SearchSuggestions
                query={searchQuery}
                categoryMatches={categoryMatches}
                productMatches={productMatches}
                loading={loading}
                activeIndex={activeIndex}
                onHoverIndex={setActiveIndex}
                onSelectCategory={goToCategory}
                onSelectProduct={goToProduct}
                onSeeAll={() => {
                  setSearchOpen(false);
                  router.push(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
                }}
              />
            )}
          </div>

          {/* Right actions */}
          <div className="nb-right">
            {/* Categories trigger */}
            <button
              className="nb-cat-btn"
              onClick={() => setCatOpen(!catOpen)}
              aria-expanded={catOpen}
              aria-label="Browse categories"
            >
              <FaTag /> <span className="nb-hide-sm">Categories</span>
              <FaChevronDown className={`nb-cat-chevron ${catOpen ? "open" : ""}`} />
            </button>

            {/* Wishlist */}
            <Link href="/wishlist" className="nb-icon-btn" aria-label={`Wishlist, ${wishlistCount} items`}>
              <FaHeart />
              {wishlistCount > 0 && <span className="nb-badge">{wishlistCount}</span>}
            </Link>

            {/* Notifications dropdown */}
            <div className="nb-notif" ref={notifRef}>
              <button
                className="nb-icon-btn"
                onClick={() => setNotifOpen(!notifOpen)}
                aria-expanded={notifOpen}
                aria-label={`Notifications, ${unreadCount} unread`}
              >
                <FaBell />
                {unreadCount > 0 && <span className="nb-badge">{unreadCount}</span>}
              </button>
              {notifOpen && (
                <div className="nb-notif-dropdown" role="menu">
                  <div className="nb-notif-header">
                    <span className="nb-notif-title">Notifications</span>
                    {unreadCount > 0 && (
                      <button className="nb-notif-mark" onClick={markAllRead}>
                        <FaCheckDouble /> Mark all read
                      </button>
                    )}
                  </div>
                  <div className="nb-notif-list">
                    {notifs.slice(0, 5).map((n) => (
                      <Link
                        href="/notifications"
                        key={n.id}
                        className={`nb-notif-item ${!n.read ? "unread" : ""}`}
                        onClick={() => setNotifOpen(false)}
                      >
                        <span className={`nb-notif-icon nb-notif-icon-${n.type}`}>
                          {getNotifIcon(n.type)}
                        </span>
                        <span className="nb-notif-body">
                          <span className="nb-notif-text">{n.text}</span>
                          <span className="nb-notif-time">{formatNotifTime(n.time)}</span>
                        </span>
                        {!n.read && <span className="nb-notif-dot" />}
                      </Link>
                    ))}
                  </div>
                  <Link href="/notifications" className="nb-notif-viewall" onClick={() => setNotifOpen(false)}>
                    View all notifications
                  </Link>
                </div>
              )}
            </div>

            {/* Chat */}
            <Link href="/chat" className="nb-icon-btn nb-hide-sm" aria-label="Chat">
              <FaComment />
            </Link>

            {/* Profile */}
            {hydrated && currentUser ? (
              <div className="nb-profile" ref={profileRef}>
                <button
                  className="nb-profile-btn"
                  onClick={() => setProfileOpen(!profileOpen)}
                  aria-expanded={profileOpen}
                  aria-label="Profile menu"
                >
                  <img src={currentUser.avatar} alt={currentUser.name} className="nb-avatar" />
                  <FaChevronDown className={`nb-chevron ${profileOpen ? "open" : ""}`} />
                </button>
                {profileOpen && (
                  <div className="nb-dropdown" role="menu">
                    <div className="nb-dropdown-header">
                      <img src={currentUser.avatar} alt="" className="nb-dropdown-avatar" />
                      <div className="nb-dropdown-id">
                        <p className="nb-dropdown-name">{currentUser.name}</p>
                        <p className="nb-dropdown-email">{currentUser.email}</p>
                      </div>
                    </div>
                    <Link href="/profile" className="nb-dropdown-item"><FaUser /> My Profile</Link>
                    <Link href="/my-products" className="nb-dropdown-item"><FaStore /> My Products</Link>
                    <Link href="/wishlist" className="nb-dropdown-item"><FaHeart /> Wishlist</Link>
                    <button className="nb-dropdown-item nb-dropdown-logout" onClick={handleLogout}>
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : hydrated ? (
              <Link href="/login" className="nb-login-btn">Sign In</Link>
            ) : null}

            <button
              className="nb-hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Category slide-down panel */}
      {catOpen && (
        <div className="nb-cat-panel" onMouseLeave={() => setCatOpen(false)}>
          <div className="nb-cat-panel-inner">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/marketplace?category=${encodeURIComponent(cat)}`}
                className="nb-cat-item"
                onClick={() => setCatOpen(false)}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <div className="nb-mobile-menu">
          <div className="nb-mobile-search-wrapper" ref={mobileSearchRef}>
            <form className="nb-mobile-search" onSubmit={handleSearch} autoComplete="off">
              <FaSearch className="nb-mobile-search-icon" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setMobileSearchOpen(true);
                  setActiveIndex(-1);
                }}
                onFocus={() => setMobileSearchOpen(true)}
                onKeyDown={handleSearchKeyDown}
                aria-label="Search"
              />
            </form>
            {mobileSearchOpen && searchQuery.trim() && (
              <SearchSuggestions
                query={searchQuery}
                categoryMatches={categoryMatches}
                productMatches={productMatches}
                loading={loading}
                activeIndex={activeIndex}
                onHoverIndex={setActiveIndex}
                onSelectCategory={goToCategory}
                onSelectProduct={goToProduct}
                onSeeAll={() => {
                  setMobileSearchOpen(false);
                  router.push(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
                }}
              />
            )}
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              href={link.to}
              className={`nb-mobile-link ${pathname === link.to ? "active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/wishlist" className="nb-mobile-link" onClick={() => setMenuOpen(false)}>Wishlist</Link>
          <Link href="/chat" className="nb-mobile-link" onClick={() => setMenuOpen(false)}>Chat</Link>
          <Link href="/notifications" className="nb-mobile-link" onClick={() => setMenuOpen(false)}>Notifications</Link>
          <Link href="/contact" className="nb-mobile-link" onClick={() => setMenuOpen(false)}>Contact</Link>
          <Link href="/faq" className="nb-mobile-link" onClick={() => setMenuOpen(false)}>Help Center</Link>
          <Link href="/admin" className="nb-mobile-link" onClick={() => setMenuOpen(false)}>Admin</Link>
          {!currentUser && (
            <Link href="/login" className="nb-mobile-link nb-mobile-signin" onClick={() => setMenuOpen(false)}>
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
