"use client";
// ===== Wishlist Page =====
// Shows products the user has saved to their wishlist (stored in LocalStorage).
// Each product can be removed from the wishlist or viewed in detail.

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaHeart, FaTrash, FaEye } from "react-icons/fa";
import { useApp } from "../../context/AppContext";
import Breadcrumb from "../component/Breadcrumb/Breadcrumb";

function Wishlist() {
  const { wishlist, removeFromWishlist } = useApp();
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlist.length === 0) {
      setWishlistProducts([]);
      setLoading(false);
      return;
    }
    let ignore = false;
    setLoading(true);
    // Fetch everything and filter here, rather than trusting the server-side
    // ids filter (?ids=...&filters[documentId][$in][n]=...) — that's the
    // documented Strapi syntax, but it wasn't actually narrowing results in
    // this setup, so this sidesteps it instead of chasing the query parser.
    fetch(`/api/products`)
      .then((res) => res.json())
      .then((data) => {
        if (ignore) return;
        const all = data.products || [];
        setWishlistProducts(all.filter((p) => wishlist.includes(p.id)));
      })
      .catch(() => {})
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [wishlist]);

  return (
    <div className="wishlist page-fade">
      <div className="wishlist-container">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Home", to: "/" },
            { label: "Wishlist" },
          ]}
        />

        {/* Header */}
        <div className="wishlist-header">
          <h1 className="wishlist-title">My Wishlist</h1>
          <p className="wishlist-subtitle">
            {wishlistProducts.length} saved {wishlistProducts.length === 1 ? "product" : "products"}
          </p>
        </div>

        {/* Products grid or empty state */}
        {loading ? (
          <p style={{ padding: "40px 0", textAlign: "center" }}>Loading your wishlist…</p>
        ) : wishlistProducts.length > 0 ? (
          <div className="wishlist-grid">
            {wishlistProducts.map((product) => {
              return (
                <div key={product.id} className="wishlist-card">
                  {/* Image */}
                  <Link href={`/product/${product.id}`}>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="wishlist-card-image"
                    />
                  </Link>

                  {/* Info */}
                  <div className="wishlist-card-body">
                    <span className="wishlist-card-category">{product.category}</span>
                    <Link href={`/product/${product.id}`}>
                      <h3 className="wishlist-card-name">{product.name}</h3>
                    </Link>
                    <p className="wishlist-card-price">${product.price}</p>
                    <div className="wishlist-card-meta">
                      <span>{product.condition}</span>
                      <span>•</span>
                      <span>{product.university}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="wishlist-card-actions">
                    <Link href={`/product/${product.id}`} className="wishlist-card-view-btn">
                      <FaEye /> View
                    </Link>
                    <button
                      className="wishlist-card-remove-btn"
                      onClick={() => removeFromWishlist(product.id)}
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="wishlist-empty">
            <FaHeart className="wishlist-empty-icon" />
            <h3>Your wishlist is empty</h3>
            <p>Save products you're interested in by clicking the heart icon.</p>
            <Link href="/marketplace" className="wishlist-empty-btn">
              Browse Marketplace
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
