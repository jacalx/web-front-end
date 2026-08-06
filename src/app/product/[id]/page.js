"use client";
// ===== Product Detail Page =====
// Simplified to match the real Supabase `products` table columns.

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaHeart, FaComment, FaShare, FaFlag, FaArrowLeft,
  FaUserCircle, FaShieldAlt, FaArrowRight,
} from "react-icons/fa";
import Breadcrumb from "../../component/Breadcrumb/Breadcrumb";
import Modal from "../../component/Modal/Modal";
import ProductCard from "../../component/ProductCard/ProductCard";
import { useApp } from "../../../context/AppContext";

function ProductDetail({ params }) {
  const { id } = params;
  const { isInWishlist, toggleWishlist, addToRecentlyViewed, recentlyViewed } = useApp();

  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState([]);

  // Fetch the product itself
  useEffect(() => {
    let ignore = false;
    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (ignore) return;
        const found = res.ok ? data.product : null;
        setProduct(found);
        if (found) addToRecentlyViewed(found.id);
      } catch {
        if (!ignore) setProduct(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    if (id) fetchProduct();
    return () => { ignore = true; };
  }, [id]);

  // Fetch related products (same category)
  useEffect(() => {
    let ignore = false;
    async function fetchRelated() {
      if (!product) return;
      try {
        const res = await fetch(`/api/products?category=${encodeURIComponent(product.category)}`);
        const data = await res.json();
        if (!ignore && res.ok) {
          setRelatedProducts((data.products || []).filter((p) => p.id !== product.id).slice(0, 5));
        }
      } catch {
        // related products are a nice-to-have — fail silently
      }
    }
    fetchRelated();
    return () => { ignore = true; };
  }, [product]);

  // Fetch recently viewed products (excluding the current one)
  useEffect(() => {
    let ignore = false;
    async function fetchRecent() {
      const ids = recentlyViewed.filter((rid) => rid !== id);
      if (ids.length === 0) { setRecentlyViewedProducts([]); return; }
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (!ignore && res.ok) {
          setRecentlyViewedProducts((data.products || []).filter((p) => ids.includes(p.id)));
        }
      } catch {
        // recently-viewed is a nice-to-have — fail silently
      }
    }
    fetchRecent();
    return () => { ignore = true; };
  }, [recentlyViewed, id]);

  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportError, setReportError] = useState("");

  const handleReportSubmit = async () => {
    if (!reportReason || !product) return;
    setReportSubmitting(true);
    setReportError("");
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          productTitle: product.title,
          productImage: product.image_url,
          reason: reportReason,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to submit report");
      setReportSubmitted(true);
      setTimeout(() => {
        setReportOpen(false);
        setReportSubmitted(false);
        setReportReason("");
      }, 3000);
    } catch (err) {
      setReportError(err.message);
    }
    setReportSubmitting(false);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="productdetail page-fade">
        <div className="container">
          <div className="productdetail-notfound">
            <h2>Loading…</h2>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="productdetail page-fade">
        <div className="container">
          <div className="productdetail-notfound">
            <h2>Product not found</h2>
            <p>This product may have been removed or doesn't exist.</p>
            <Link href="/marketplace" className="productdetail-back-btn">
              <FaArrowLeft /> Back to Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="productdetail page-fade">
      <div className="container">
        <Breadcrumb
          items={[
            { label: "Home", to: "/" },
            { label: "Marketplace", to: "/marketplace" },
            { label: product.title },
          ]}
        />

        {/* Main layout: image + sticky info */}
        <div className="productdetail-main">
          {/* ===== Left: Image ===== */}
          <div className="productdetail-gallery">
            <div className="productdetail-main-image">
              <img src={product.image_url || "/placeholder-product.png"} alt={product.title} />
            </div>
          </div>

          {/* ===== Right: Sticky Product Info ===== */}
          <div className="productdetail-info">
            <div className="productdetail-info-sticky">
              <span className="productdetail-category">{product.category}</span>
              <h1 className="productdetail-name">{product.title}</h1>

              {/* Price */}
              <div className="productdetail-price-row">
                <span className="productdetail-price">${product.price}</span>
              </div>

              {/* Condition + Posted date */}
              <div className="productdetail-meta-row">
                {product.condition && (
                  <span className="productdetail-condition">{product.condition}</span>
                )}
                {product.created_at && (
                  <span className="productdetail-posted-date">
                    Posted {new Date(product.created_at).toLocaleDateString(undefined, {
                      year: "numeric", month: "short", day: "numeric",
                    })}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="productdetail-description">
                <h3>Description</h3>
                <p>{product.description}</p>
              </div>

              {/* Actions */}
              <div className="productdetail-actions">
                <Link href="/chat" className="productdetail-btn-chat">
                  <FaComment /> Chat Seller
                </Link>
                <button
                  className={`productdetail-btn-wishlist ${isInWishlist(product.id) ? "active" : ""}`}
                  onClick={() => toggleWishlist(product.id)}
                >
                  <FaHeart /> {isInWishlist(product.id) ? "Saved" : "Save"}
                </button>
                <button className="productdetail-btn-share" onClick={handleShare}>
                  <FaShare /> Share
                </button>
                <button className="productdetail-btn-report" onClick={() => setReportOpen(true)}>
                  <FaFlag /> Report
                </button>
              </div>

              {/* Trust */}
              <div className="productdetail-trust">
                <FaShieldAlt /> Verified student seller • Safe campus meetup
              </div>
            </div>
          </div>
        </div>

        {/* ===== Seller Card ===== */}
        {product.seller_name && (
          <div className="productdetail-seller">
            <h3 className="productdetail-sec-title">Seller Information</h3>
            <div className="productdetail-seller-card">
              {product.seller_avatar ? (
                <img
                  src={product.seller_avatar}
                  alt={product.seller_name}
                  className="productdetail-seller-avatar"
                  style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }}
                />
              ) : (
                <FaUserCircle className="productdetail-seller-avatar" style={{ fontSize: "48px" }} />
              )}
              <div className="productdetail-seller-info">
                <div className="productdetail-seller-name-row">
                  <h4>{product.seller_name}</h4>
                </div>
                <p className="productdetail-seller-university">
                  {product.university ? product.university : "University not provided"}
                </p>
              </div>
              <Link href="/chat" className="productdetail-seller-contact">
                <FaComment /> Contact
              </Link>
            </div>
          </div>
        )}

        {/* ===== Related Products (horizontal scroll) ===== */}
        {relatedProducts.length > 0 && (
          <div className="productdetail-related">
            <div className="productdetail-sec-head">
              <h3 className="productdetail-sec-title">Related Products</h3>
              <Link href={`/marketplace?category=${encodeURIComponent(product.category)}`} className="productdetail-sec-link">
                View All <FaArrowRight />
              </Link>
            </div>
            <div className="hscroll">
              {relatedProducts.map((rp) => (
                <div key={rp.id} className="hscroll-item productdetail-hscroll-item">
                  <ProductCard product={rp} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== Recently Viewed (horizontal scroll) ===== */}
        {recentlyViewedProducts.length > 0 && (
          <div className="productdetail-recently">
            <h3 className="productdetail-sec-title">Recently Viewed</h3>
            <div className="hscroll">
              {recentlyViewedProducts.map((rp) => (
                <div key={rp.id} className="hscroll-item productdetail-hscroll-item">
                  <ProductCard product={rp} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ===== Report Modal ===== */}
      <Modal
        isOpen={reportOpen}
        onClose={() => { setReportOpen(false); setReportSubmitted(false); setReportReason(""); }}
        title="Report Product"
      >
        {reportSubmitted ? (
          <div className="productdetail-report-success">
            <FaShieldAlt className="productdetail-report-success-icon" />
            <h3>Report Submitted</h3>
            <p>Thank you. Our admin team will review this report shortly.</p>
          </div>
        ) : (
          <div className="productdetail-report-form">
            <p className="productdetail-report-text">
              Why are you reporting this product? Please select a reason:
            </p>
            <div className="productdetail-report-reasons">
              {["Spam", "Scam", "Wrong Category", "Fake Item", "Other"].map((reason) => (
                <label key={reason} className="productdetail-report-reason">
                  <input
                    type="radio"
                    name="reason"
                    value={reason}
                    checked={reportReason === reason}
                    onChange={(e) => setReportReason(e.target.value)}
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>
            {reportError && <p className="productdetail-report-text" style={{ color: "#e53e3e" }}>{reportError}</p>}
            <button
              className="productdetail-report-submit"
              onClick={handleReportSubmit}
              disabled={!reportReason || reportSubmitting}
            >
              {reportSubmitting ? "Submitting…" : "Submit Report"}
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ProductDetail;
