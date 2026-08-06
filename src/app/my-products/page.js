"use client";
// ===== My Products Page =====
// Shows the current signed-in user's real listings (from Strapi via
// /api/products?sellerId=...), organized in tabs: Selling, Sold, Reserved.

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  FaEdit, FaTrash, FaEye, FaStore, FaPlus,
} from "react-icons/fa";
import { useApp } from "../../context/AppContext";
import Breadcrumb from "../component/Breadcrumb/Breadcrumb";
import Modal from "../component/Modal/Modal";

function MyProducts() {
  const { currentUser } = useApp();

  const [activeTab, setActiveTab] = useState("selling");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const fetchMyProducts = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/products?sellerId=${encodeURIComponent(currentUser.id)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load your products");
      setMyProducts(data.products || []);
      setLoadError("");
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchMyProducts();
  }, [fetchMyProducts]);

  if (!currentUser) {
    return (
      <div className="myproducts page-fade">
        <div className="myproducts-container">
          <div className="myproducts-not-logged-in">
            <h2>Please log in to view your products</h2>
            <Link href="/login" className="myproducts-login-btn">Login</Link>
          </div>
        </div>
      </div>
    );
  }

  const getFilteredProducts = () => {
    switch (activeTab) {
      case "selling":
        return myProducts.filter((p) => p.status === "available");
      case "sold":
        return myProducts.filter((p) => p.status === "sold");
      case "reserved":
        return myProducts.filter((p) => p.status === "reserved");
      default:
        return myProducts;
    }
  };

  const filteredProducts = getFilteredProducts();

  const tabs = [
    { key: "selling", label: "Selling", count: myProducts.filter((p) => p.status === "available").length },
    { key: "sold", label: "Sold", count: myProducts.filter((p) => p.status === "sold").length },
    { key: "reserved", label: "Reserved", count: myProducts.filter((p) => p.status === "reserved").length },
  ];

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${deleteTarget.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete product");
      setMyProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="myproducts page-fade">
      <div className="myproducts-container">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Home", to: "/" },
            { label: "My Products" },
          ]}
        />

        {/* Header */}
        <div className="myproducts-header">
          <div>
            <h1 className="myproducts-title">My Products</h1>
            <p className="myproducts-subtitle">Manage your listings</p>
          </div>
          <Link href="/sell" className="myproducts-add-btn">
            <FaPlus /> Sell New Product
          </Link>
        </div>

        {loadError && <div className="sellproduct-error" style={{ marginBottom: "16px" }}>{loadError}</div>}

        {/* Tabs */}
        <div className="myproducts-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`myproducts-tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              <span className="myproducts-tab-count">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Products list or empty/loading state */}
        {loading ? (
          <div className="myproducts-empty">
            <p>Loading your products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="myproducts-list">
            {filteredProducts.map((product) => (
              <div key={product.id} className="myproducts-item">
                {/* Product image */}
                <img
                  src={product.image_url || "/placeholder-product.png"}
                  alt={product.title}
                  className="myproducts-item-image"
                />
                {/* Product info */}
                <div className="myproducts-item-info">
                  <h3 className="myproducts-item-name">{product.title}</h3>
                  <p className="myproducts-item-price">${product.price}</p>
                  <div className="myproducts-item-meta">
                    <span>{product.category}</span>
                    <span>•</span>
                    <span>{product.condition}</span>
                    <span>•</span>
                    <span className={`myproducts-item-status myproducts-status-${product.status}`}>
                      {product.status}
                    </span>
                  </div>
                </div>
                {/* Action buttons */}
                <div className="myproducts-item-actions">
                  <Link href={`/product/${product.id}`} className="myproducts-action-btn view">
                    <FaEye /> View
                  </Link>
                  <button
                    className="myproducts-action-btn delete"
                    onClick={() => setDeleteTarget(product)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="myproducts-empty">
            <FaStore className="myproducts-empty-icon" />
            <h3>No products here</h3>
            <p>You don't have any products in this category yet.</p>
            <Link href="/sell" className="myproducts-empty-btn">
              <FaPlus /> Sell a Product
            </Link>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Product?"
      >
        <div className="myproducts-delete-confirm">
          <p>Are you sure you want to delete "{deleteTarget?.title}"? This action cannot be undone.</p>
          <div className="myproducts-delete-actions">
            <button
              className="myproducts-delete-confirm-btn"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Yes, Delete"}
            </button>
            <button
              className="myproducts-delete-cancel-btn"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default MyProducts;
