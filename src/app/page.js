"use client";
// ===== Home Page =====
// Marketplace homepage — no hero. Pure browsing experience.
// Quick search → Categories → Trending → Deals strip → Recommended
// → Books → Electronics → Recently Posted → Safety tips → Stats → Footer

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaBook, FaLaptop, FaMobileAlt, FaTabletAlt, FaCalculator, FaPencilAlt,
  FaPenNib, FaShoppingBag, FaTshirt, FaBolt, FaChair, FaGem,
  FaPrint, FaDesktop, FaKeyboard, FaMouse, FaHeadphones, FaEllipsisH,
  FaSearch, FaArrowRight, FaShieldAlt, FaUsers, FaBoxOpen, FaStar,
  FaTag, FaFireAlt, FaClock, FaGraduationCap,
} from "react-icons/fa";
import ProductCard from "./component/ProductCard/ProductCard";
import CategoryCard from "./component/CategoryCard/CategoryCard";
import { useApp } from "../context/AppContext";
import { categories } from "../data/products";
import { useLiveSearch } from "./hooks/useLiveSearch";
import SearchSuggestions from "./component/SearchSuggestions/SearchSuggestions";
import "./component/SearchSuggestions/SearchSuggestions.css";

function Home() {
  const { recentlyViewed } = useApp();
  const [query, setQuery] = useState("");
  const router = useRouter();

  // Live "type-ahead" suggestions for the homepage quick-search bar —
  // same shared hook/dropdown the Navbar search uses, so behaviour is
  // consistent everywhere in the app.
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const { categoryMatches, productMatches, loading: searchLoading } = useLiveSearch(query);
  const searchRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [siteStats, setSiteStats] = useState({ userCount: null, universityCount: null });

  useEffect(() => {
    let ignore = false;
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => { if (!ignore) setSiteStats(data); })
      .catch(() => {});
    return () => { ignore = true; };
  }, []);

  useEffect(() => {
    let ignore = false;
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (!ignore && res.ok) setProducts(data.products || []);
      } catch {
        // Home page degrades gracefully to empty sections on failure —
        // Marketplace page shows the real error state.
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchProducts();
    return () => { ignore = true; };
  }, []);

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
    setSearchOpen(false);
    if (query.trim()) router.push(`/marketplace?search=${encodeURIComponent(query)}`);
    else router.push("/marketplace");
  };

  const goToCategory = (category) => {
    setSearchOpen(false);
    setActiveIndex(-1);
    router.push(`/marketplace?category=${encodeURIComponent(category)}`);
  };

  const goToProduct = (product) => {
    setSearchOpen(false);
    setActiveIndex(-1);
    router.push(`/product/${product.id}`);
  };

  const handleSearchKeyDown = (e) => {
    const total = categoryMatches.length + productMatches.length;
    if (!total) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % total);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? total - 1 : i - 1));
    } else if (e.key === "Escape") {
      setSearchOpen(false);
    }
  };

  // Close the suggestions dropdown when clicking anywhere outside it.
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const trending = useMemo(() => [...products].sort((a, b) => b.views - a.views).slice(0, 10), [products]);
  const latest = useMemo(() => [...products].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5), [products]);
  const books = useMemo(() => products.filter((p) => p.category === "Books").slice(0, 10), [products]);
  const electronicsCats = ["Laptop", "Phone", "Tablet", "Headphone", "Monitor"];
  const electronics = useMemo(() => products.filter((p) => electronicsCats.includes(p.category)).slice(0, 10), [products]);
  // No discount data from Strapi yet, so "deals" shows the lowest-priced items instead.
  const deals = useMemo(() => [...products].sort((a, b) => a.price - b.price).slice(0, 5), [products]);

  const recentlyViewedProducts = recentlyViewed
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 10);

  const categoryIcons = {
    Books: <FaBook />, Laptop: <FaLaptop />, Phone: <FaMobileAlt />,
    Tablet: <FaTabletAlt />, Calculator: <FaCalculator />, Notebook: <FaPencilAlt />,
    Stationery: <FaPenNib />, Bag: <FaShoppingBag />, Uniform: <FaTshirt />,
    Electronics: <FaBolt />, Furniture: <FaChair />, Accessories: <FaGem />,
    Printer: <FaPrint />, Monitor: <FaDesktop />, Keyboard: <FaKeyboard />,
    Mouse: <FaMouse />, Headphone: <FaHeadphones />, Other: <FaEllipsisH />,
  };

  const getCategoryCount = (cat) => products.filter((p) => p.category === cat).length;

  const stats = [
    { icon: <FaBoxOpen />, value: `${products.length}+`, label: "Active Listings" },
    { icon: <FaUsers />, value: siteStats.userCount !== null ? `${siteStats.userCount}` : "—", label: "Verified Students" },
    { icon: <FaGraduationCap />, value: siteStats.universityCount !== null ? `${siteStats.universityCount}` : "—", label: "Universities" },
    { icon: <FaStar />, value: "4.8", label: "Avg Rating" },
  ];

  const safetyTips = [
    { title: "Meet on Campus", desc: "Always meet in public university areas during daylight hours." },
    { title: "Verify Student ID", desc: "Check the seller's verified badge before making any payment." },
    { title: "Use In-App Chat", desc: "Keep all communication within the platform for your safety." },
  ];

  return (
    <div className="home page-fade">
      {/* ===== Quick Search Bar ===== */}
      <section className="home-search-section">
        <div className="container">
          <div className="home-search-wrapper" ref={searchRef}>
            <form className="home-search-bar" onSubmit={handleSearch} autoComplete="off">
              <FaSearch className="home-search-icon" />
              <input
                type="text"
                placeholder="Search for textbooks, laptops, calculators..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSearchOpen(true);
                  setActiveIndex(-1);
                }}
                onFocus={() => setSearchOpen(true)}
                onKeyDown={handleSearchKeyDown}
              />
              <button type="submit" className="home-search-btn">Search</button>
            </form>
            {searchOpen && query.trim() && (
              <SearchSuggestions
                query={query}
                categoryMatches={categoryMatches}
                productMatches={productMatches}
                loading={searchLoading}
                activeIndex={activeIndex}
                onHoverIndex={setActiveIndex}
                onSelectCategory={goToCategory}
                onSelectProduct={goToProduct}
                onSeeAll={() => {
                  setSearchOpen(false);
                  router.push(`/marketplace?search=${encodeURIComponent(query)}`);
                }}
              />
            )}
          </div>
          <div className="home-search-cats">
            <span>Popular:</span>
            {categories.slice(0, 5).map((cat) => (
              <button key={cat} onClick={() => router.push(`/marketplace?category=${encodeURIComponent(cat)}`)}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Categories ===== */}
      <section className="home-section">
        <div className="container">
          <div className="home-sec-head">
            <div>
              <h2 className="section-title">Browse Categories</h2>
              <p className="section-subtitle">{categories.length} categories to explore</p>
            </div>
            <Link href="/marketplace" className="home-link">All Products <FaArrowRight /></Link>
          </div>
          <div className="home-cat-scroll">
            {categories.map((cat) => (
              <CategoryCard key={cat} category={cat} icon={categoryIcons[cat]} count={getCategoryCount(cat)} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== Trending (horizontal scroll) ===== */}
      <section className="home-section home-section-muted">
        <div className="container">
          <div className="home-sec-head">
            <div>
              <h2 className="section-title"><FaFireAlt className="home-sec-icon" /> Trending Now</h2>
              <p className="section-subtitle">Most viewed items this week</p>
            </div>
            <Link href="/marketplace" className="home-link">View All <FaArrowRight /></Link>
          </div>
          <div className="hscroll home-hscroll">
            {trending.map((product) => (
              <div key={product.id} className="hscroll-item home-hscroll-item">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Student Deals (grid) ===== */}
      <section className="home-section">
        <div className="container">
          <div className="home-sec-head">
            <div>
              <h2 className="section-title"><FaTag className="home-sec-icon" /> Student Deals</h2>
              <p className="section-subtitle">Best prices across all categories</p>
            </div>
            <Link href="/marketplace" className="home-link">View All <FaArrowRight /></Link>
          </div>
          <div className="home-prod-grid">
            {deals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== Books (horizontal scroll) ===== */}
      <section className="home-section home-section-muted">
        <div className="container">
          <div className="home-sec-head">
            <div>
              <h2 className="section-title">Books & Textbooks</h2>
              <p className="section-subtitle">Save on course materials</p>
            </div>
            <Link href="/marketplace?category=Books" className="home-link">View All <FaArrowRight /></Link>
          </div>
          <div className="hscroll home-hscroll">
            {books.map((product) => (
              <div key={product.id} className="hscroll-item home-hscroll-item">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Electronics (grid) ===== */}
      <section className="home-section">
        <div className="container">
          <div className="home-sec-head">
            <div>
              <h2 className="section-title">Electronics</h2>
              <p className="section-subtitle">Laptops, phones, tablets and more</p>
            </div>
            <Link href="/marketplace?category=Laptop" className="home-link">View All <FaArrowRight /></Link>
          </div>
          <div className="home-prod-grid">
            {electronics.slice(0, 5).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== Recently Posted (grid) ===== */}
      <section className="home-section home-section-muted">
        <div className="container">
          <div className="home-sec-head">
            <div>
              <h2 className="section-title"><FaClock className="home-sec-icon" /> Recently Posted</h2>
              <p className="section-subtitle">Newest additions to the marketplace</p>
            </div>
            <Link href="/marketplace?sort=newest" className="home-link">View All <FaArrowRight /></Link>
          </div>
          <div className="home-prod-grid">
            {latest.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== Recently Viewed ===== */}
      {recentlyViewedProducts.length > 0 && (
        <section className="home-section">
          <div className="container">
            <div className="home-sec-head">
              <div>
                <h2 className="section-title">Recently Viewed</h2>
                <p className="section-subtitle">Pick up where you left off</p>
              </div>
            </div>
            <div className="hscroll home-hscroll">
              {recentlyViewedProducts.map((product) => (
                <div key={product.id} className="hscroll-item home-hscroll-item">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== Safety Tips ===== */}
      <section className="home-section home-section-muted">
        <div className="container">
          <div className="home-sec-head">
            <div>
              <h2 className="section-title"><FaShieldAlt className="home-sec-icon" /> Safety Tips</h2>
              <p className="section-subtitle">Trade safely on campus</p>
            </div>
          </div>
          <div className="home-safety">
            {safetyTips.map((tip, i) => (
              <div key={i} className="home-safety-card">
                <div className="home-safety-num">{i + 1}</div>
                <h3>{tip.title}</h3>
                <p>{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Stats ===== */}
      <section className="home-stats">
        <div className="container">
          <div className="home-stats-grid">
            {stats.map((stat, i) => (
              <div key={i} className="home-stat">
                <span className="home-stat-icon">{stat.icon}</span>
                <span className="home-stat-value">{stat.value}</span>
                <span className="home-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;