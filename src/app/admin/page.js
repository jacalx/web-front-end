"use client";
// ===== Admin Dashboard =====
// SaaS-style admin panel: overview, analytics, tables, management tabs.
// Access is gated on profile.role === "admin" (Strapi — the single source
// of truth for roles). Previously this page had NO access check at all;
// the route being under Clerk's authenticated middleware only meant "signed
// in", not "admin" — so every signed-in user could reach it.

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaUsers, FaBox, FaFlag, FaShoppingBag, FaDollarSign,
  FaEye, FaTrash, FaBan, FaChartBar, FaClock, FaTachometerAlt,
  FaStore, FaBell, FaChevronRight, FaCheckCircle, FaTimesCircle,
  FaExclamationTriangle, FaArrowUp, FaArrowDown,
} from "react-icons/fa";
import { categories } from "../../data/products";
import Breadcrumb from "../component/Breadcrumb/Breadcrumb";
import Modal from "../component/Modal/Modal";
import { useApp } from "../../context/AppContext";

function AdminDashboard() {
  const router = useRouter();
  const { currentUser, profileLoading, hydrated } = useApp();
  const [activeSection, setActiveSection] = useState("overview");
  const [products, setProducts] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [userActionId, setUserActionId] = useState(null);
  const [userActionError, setUserActionError] = useState("");

  // These must be declared unconditionally (Rules of Hooks) — they used to
  // sit after the access-check early return below, which meant this
  // component called a different number of hooks on the "checking access"
  // render vs. the real render. React detects that as a hooks-order
  // mismatch and throws ("Rendered fewer hooks than expected") the moment
  // profile.role finishes loading and currentUser.isAdmin flips to true —
  // crashing the dashboard right when an actual admin reaches it.
  const [reportedProducts, setReportedProducts] = useState([
    { id: "r1", productId: "p7", reason: "Fake Item", reporter: "Sok Pisey", date: "2024-07-09", status: "Pending" },
    { id: "r2", productId: "p5", reason: "Wrong Category", reporter: "Chan Dara", date: "2024-07-08", status: "Pending" },
    { id: "r3", productId: "p17", reason: "Spam", reporter: "Ly Hour", date: "2024-07-07", status: "Reviewed" },
    { id: "r4", productId: "p21", reason: "Scam", reporter: "Kim Sreypich", date: "2024-07-06", status: "Pending" },
    { id: "r5", productId: "p29", reason: "Other", reporter: "Nget Visal", date: "2024-07-05", status: "Resolved" },
  ]);
  const [viewProduct, setViewProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ---- Access check: block anyone who isn't profile.role === "admin" ----
  useEffect(() => {
    if (profileLoading) return; // wait for the real profile before deciding
    if (!currentUser) {
      router.push("/login");
      return;
    }
    if (!currentUser.isAdmin) {
      alert("403 Access Denied: Admin privileges required");
      router.push("/");
    }
  }, [profileLoading, currentUser, router]);

  useEffect(() => {
    if (!currentUser?.isAdmin) return;
    let ignore = false;
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => { if (!ignore) setProducts(data.products || []); })
      .catch(() => {});
    return () => { ignore = true; };
  }, [currentUser]);

  const loadUsers = () => {
    setUsersLoading(true);
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => setUsers(data.users || []))
      .catch(() => {})
      .finally(() => setUsersLoading(false));
  };

  useEffect(() => {
    if (!currentUser?.isAdmin) return;
    loadUsers();
  }, [currentUser]);

  const handleBanToggle = async (user) => {
    const action = user.banned ? "unban" : "ban";
    if (!window.confirm(`${action === "ban" ? "Ban" : "Unban"} ${user.name}?`)) return;
    setUserActionId(user.id);
    setUserActionError("");
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to update user");
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, banned: !u.banned } : u)));
    } catch (err) {
      setUserActionError(err.message);
    }
    setUserActionId(null);
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Permanently delete ${user.name}'s account? This can't be undone.`)) return;
    setUserActionId(user.id);
    setUserActionError("");
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to delete user");
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (err) {
      setUserActionError(err.message);
    }
    setUserActionId(null);
  };

  if (!hydrated || profileLoading || !currentUser?.isAdmin) {
    return (
      <div className="admin page-fade">
        <div className="container" style={{ padding: "80px 0", textAlign: "center" }}>
          <h2>Checking admin access…</h2>
        </div>
      </div>
    );
  }

  const stats = [
    { icon: <FaUsers />, label: "Total Users", value: users.length, delta: "+2 this week", up: true, color: "primary" },
    { icon: <FaBox />, label: "Total Listings", value: products.length, delta: "+5 this week", up: true, color: "success" },
    { icon: <FaStore />, label: "Active Listings", value: products.filter(p => p.status === "available").length, delta: "-1 today", up: false, color: "info" },
    { icon: <FaFlag />, label: "Pending Reports", value: reportedProducts.filter(r => r.status === "Pending").length, delta: "Needs review", up: false, color: "warning" },
    { icon: <FaShoppingBag />, label: "Sales", value: products.filter(p => p.status === "sold").length, delta: "+3 this week", up: true, color: "primary" },
    { icon: <FaDollarSign />, label: "Commission", value: "$62.25", delta: "+$15 this week", up: true, color: "error" },
  ];

  const recentActivity = [
    { action: "New user registered", user: "Heng Mengly", time: "2h ago", icon: <FaUsers />, color: "primary" },
    { action: "Product sold", user: "Sok Pisey", time: "5h ago", icon: <FaShoppingBag />, color: "success" },
    { action: "New product listed", user: "Chan Dara", time: "8h ago", icon: <FaBox />, color: "info" },
    { action: "Report submitted", user: "Kim Sreypich", time: "1d ago", icon: <FaFlag />, color: "warning" },
    { action: "User suspended", user: "Unknown", time: "2d ago", icon: <FaBan />, color: "error" },
  ];

  const monthlySales = [
    { m: "Jan", v: 45 }, { m: "Feb", v: 62 }, { m: "Mar", v: 58 },
    { m: "Apr", v: 71 }, { m: "May", v: 89 }, { m: "Jun", v: 76 },
    { m: "Jul", v: 94 },
  ];
  const newUsers = [
    { m: "Jan", v: 12 }, { m: "Feb", v: 18 }, { m: "Mar", v: 15 },
    { m: "Apr", v: 22 }, { m: "May", v: 28 }, { m: "Jun", v: 24 },
    { m: "Jul", v: 31 },
  ];
  const maxSales = Math.max(...monthlySales.map(d => d.v));
  const maxUsers = Math.max(...newUsers.map(d => d.v));

  const categoryCounts = categories.map(cat => ({
    name: cat,
    count: products.filter(p => p.category === cat).length,
  })).sort((a, b) => b.count - a.count).slice(0, 8);
  const maxCat = Math.max(...categoryCounts.map(c => c.count));

  const recentProducts = products.slice(0, 100);
  const recentUsers = users.slice(0, 100);

  const sidebarItems = [
    { key: "overview", label: "Dashboard", icon: <FaTachometerAlt /> },
    { key: "products", label: "Products", icon: <FaBox /> },
    { key: "users", label: "Users", icon: <FaUsers /> },
    { key: "reports", label: "Reports", icon: <FaFlag /> },
    { key: "analytics", label: "Analytics", icon: <FaChartBar /> },
  ];

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Delete "${product.title || product.name}"? This can't be undone.`)) return;
    setDeletingId(product.id);
    setDeleteError("");
    try {
      const res = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to delete product");
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch (err) {
      setDeleteError(err.message);
    }
    setDeletingId(null);
  };

  const handleDelete = () => {
    setReportedProducts(reportedProducts.filter(r => r.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const getProduct = (id) => products.find(p => p.id === id);

  return (
    <div className="admin page-fade">
      <div className="admin-shell">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar-header">
            <FaChartBar className="admin-sidebar-logo" />
            <span>Admin Panel</span>
          </div>
          <nav className="admin-sidebar-nav">
            {sidebarItems.map(item => (
              <button
                key={item.key}
                className={`admin-sidebar-link ${activeSection === item.key ? "active" : ""}`}
                onClick={() => setActiveSection(item.key)}
              >
                <span className="admin-sidebar-icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.key === "reports" && reportedProducts.filter(r => r.status === "Pending").length > 0 && (
                  <span className="admin-sidebar-badge">
                    {reportedProducts.filter(r => r.status === "Pending").length}
                  </span>
                )}
              </button>
            ))}
          </nav>
          <Link href="/" className="admin-sidebar-back">
            <FaChevronRight /> Back to Marketplace
          </Link>
        </aside>

        {/* Main */}
        <main className="admin-main">
          <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Admin" }]} />

          <div className="admin-header">
            <div>
              <h1 className="admin-title">Admin Dashboard</h1>
              <p className="admin-subtitle">Manage users, products, and reports across the marketplace.</p>
            </div>
            <span className="admin-live">
              <span className="admin-live-dot" /> Live data
            </span>
          </div>

          {/* Overview */}
          {activeSection === "overview" && (
            <>
              <div className="admin-stats">
                {stats.map((stat, i) => (
                  <div key={i} className={`admin-stat-card admin-stat-${stat.color}`}>
                    <div className="admin-stat-icon">{stat.icon}</div>
                    <div className="admin-stat-info">
                      <span className="admin-stat-value">{stat.value}</span>
                      <span className="admin-stat-label">{stat.label}</span>
                      <span className={`admin-stat-delta ${stat.up ? "up" : "down"}`}>
                        {stat.up ? <FaArrowUp /> : <FaArrowDown />} {stat.delta}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="admin-charts">
                <div className="admin-chart-card">
                  <div className="admin-chart-head">
                    <h3>Monthly Sales</h3>
                    <span className="admin-chart-trend up"><FaArrowUp /> +18% vs last month</span>
                  </div>
                  <div className="admin-chart-bars">
                    {monthlySales.map((d, i) => (
                      <div key={i} className="admin-chart-bar" style={{ height: `${(d.v / maxSales) * 100}%` }}>
                        <span className="admin-chart-value">{d.v}</span>
                        <span className="admin-chart-label">{d.m}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="admin-chart-card">
                  <div className="admin-chart-head">
                    <h3>New Users</h3>
                    <span className="admin-chart-trend up"><FaArrowUp /> +29% vs last month</span>
                  </div>
                  <div className="admin-chart-bars admin-chart-bars-line">
                    {newUsers.map((d, i) => (
                      <div key={i} className="admin-chart-bar-line" style={{ height: `${(d.v / maxUsers) * 100}%` }}>
                        <span className="admin-chart-value">{d.v}</span>
                        <span className="admin-chart-label">{d.m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="admin-layout">
                <div className="admin-activity">
                  <h2 className="admin-section-title"><FaClock /> Recent Activity</h2>
                  <div className="admin-activity-list">
                    {recentActivity.map((a, i) => (
                      <div key={i} className="admin-activity-item">
                        <span className={`admin-activity-icon admin-activity-${a.color}`}>{a.icon}</span>
                        <div className="admin-activity-content">
                          <p className="admin-activity-action">{a.action}</p>
                          <span className="admin-activity-meta">{a.user} • {a.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="admin-activity">
                  <h2 className="admin-section-title"><FaChartBar /> Top Categories</h2>
                  <div className="admin-cat-bars">
                    {categoryCounts.map((c, i) => (
                      <div key={i} className="admin-cat-bar">
                        <span className="admin-cat-name">{c.name}</span>
                        <div className="admin-cat-track">
                          <div className="admin-cat-fill" style={{ width: `${(c.count / maxCat) * 100}%` }} />
                        </div>
                        <span className="admin-cat-count">{c.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Products */}
          {activeSection === "products" && (
            <div className="admin-table-card">
              <h2 className="admin-section-title"><FaBox /> Recent Products</h2>
              {deleteError && <p style={{ color: "#e53e3e", marginBottom: 12 }}>{deleteError}</p>}
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product</th><th>Price</th><th>Category</th><th>Condition</th><th>Status</th><th>Views</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProducts.map(p => (
                      <tr key={p.id}>
                        <td>
                          <div className="admin-table-product">
                            <img src={p.images[0]} alt={p.name} />
                            <span>{p.name}</span>
                          </div>
                        </td>
                        <td>${p.price}</td>
                        <td>{p.category}</td>
                        <td>{p.condition}</td>
                        <td><span className={`admin-status admin-status-${p.status.toLowerCase()}`}>{p.status}</span></td>
                        <td>{p.views}</td>
                        <td>
                          <div className="admin-table-actions">
                            <button className="admin-action-btn view" onClick={() => setViewProduct(p)} title="View"><FaEye /></button>
                            <button
                              className="admin-action-btn delete"
                              title="Delete"
                              onClick={() => handleDeleteProduct(p)}
                              disabled={deletingId === p.id}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Users */}
          {activeSection === "users" && (
            <div className="admin-table-card">
              <h2 className="admin-section-title"><FaUsers /> Users</h2>
              {userActionError && <p style={{ color: "#e53e3e", marginBottom: 12 }}>{userActionError}</p>}
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr><th>User</th><th>Email</th><th>University</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {usersLoading ? (
                      <tr><td colSpan={7} className="admin-empty-row">Loading users…</td></tr>
                    ) : users.length === 0 ? (
                      <tr><td colSpan={7} className="admin-empty-row">No users yet.</td></tr>
                    ) : (
                      users.map(u => (
                        <tr key={u.id}>
                          <td>
                            <div className="admin-table-product">
                              <img src={u.avatar} alt={u.name} />
                              <span>{u.name}</span>
                            </div>
                          </td>
                          <td>{u.email}</td>
                          <td className="admin-uni-cell">{u.university || "—"}</td>
                          <td>{u.role}</td>
                          <td>{u.banned ? "Banned" : "Active"}</td>
                          <td>{u.joinedDate}</td>
                          <td>
                            <div className="admin-table-actions">
                              <button
                                className="admin-action-btn suspend"
                                title={u.banned ? "Unban" : "Ban"}
                                onClick={() => handleBanToggle(u)}
                                disabled={userActionId === u.id}
                              >
                                <FaBan />
                              </button>
                              <button
                                className="admin-action-btn delete"
                                title="Delete"
                                onClick={() => handleDeleteUser(u)}
                                disabled={userActionId === u.id}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Reports */}
          {activeSection === "reports" && (
            <div className="admin-table-card">
              <h2 className="admin-section-title"><FaFlag /> Reported Products</h2>
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr><th>Product</th><th>Reason</th><th>Reporter</th><th>Date</th><th>Status</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {reportedProducts.length === 0 ? (
                      <tr><td colSpan={6} className="admin-empty-row">
                        <FaCheckCircle className="admin-empty-icon" />
                        <span>All reports resolved. Great work!</span>
                      </td></tr>
                    ) : (
                      reportedProducts.map(r => {
                        const p = getProduct(r.productId);
                        return (
                          <tr key={r.id}>
                            <td>
                              {p ? (
                                <div className="admin-table-product">
                                  <img src={p.images[0]} alt={p.name} />
                                  <span>{p.name}</span>
                                </div>
                              ) : <span>Unknown</span>}
                            </td>
                            <td><span className="admin-reason-badge">{r.reason}</span></td>
                            <td>{r.reporter}</td>
                            <td>{r.date}</td>
                            <td><span className={`admin-status admin-status-${r.status.toLowerCase()}`}>{r.status}</span></td>
                            <td>
                              <div className="admin-table-actions">
                                <button className="admin-action-btn view" onClick={() => setViewProduct(p)} title="View"><FaEye /></button>
                                <button className="admin-action-btn delete" onClick={() => setDeleteTarget(r)} title="Delete"><FaTrash /></button>
                                <button className="admin-action-btn suspend" title="Suspend User"><FaBan /></button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Analytics */}
          {activeSection === "analytics" && (
            <>
              <div className="admin-charts">
                <div className="admin-chart-card">
                  <div className="admin-chart-head"><h3>Monthly Sales</h3></div>
                  <div className="admin-chart-bars">
                    {monthlySales.map((d, i) => (
                      <div key={i} className="admin-chart-bar" style={{ height: `${(d.v / maxSales) * 100}%` }}>
                        <span className="admin-chart-value">{d.v}</span>
                        <span className="admin-chart-label">{d.m}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="admin-chart-card">
                  <div className="admin-chart-head"><h3>New Users</h3></div>
                  <div className="admin-chart-bars admin-chart-bars-line">
                    {newUsers.map((d, i) => (
                      <div key={i} className="admin-chart-bar-line" style={{ height: `${(d.v / maxUsers) * 100}%` }}>
                        <span className="admin-chart-value">{d.v}</span>
                        <span className="admin-chart-label">{d.m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="admin-table-card">
                <h2 className="admin-section-title"><FaChartBar /> Product Categories</h2>
                <div className="admin-cat-bars">
                  {categoryCounts.map((c, i) => (
                    <div key={i} className="admin-cat-bar">
                      <span className="admin-cat-name">{c.name}</span>
                      <div className="admin-cat-track">
                        <div className="admin-cat-fill" style={{ width: `${(c.count / maxCat) * 100}%` }} />
                      </div>
                      <span className="admin-cat-count">{c.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* View Product Modal */}
      <Modal isOpen={!!viewProduct} onClose={() => setViewProduct(null)} title="Product Details">
        {viewProduct && (
          <div className="admin-view-product">
            <img src={viewProduct.images[0]} alt={viewProduct.name} className="admin-view-image" />
            <h3>{viewProduct.name}</h3>
            <p className="admin-view-price">${viewProduct.price}</p>
            <p className="admin-view-desc">{viewProduct.description}</p>
            <div className="admin-view-meta">
              <span>Category: {viewProduct.category}</span>
              <span>Condition: {viewProduct.condition}</span>
              <span>Status: {viewProduct.status}</span>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Report">
        <div className="admin-delete-confirm">
          <p>Are you sure you want to delete this report? This action cannot be undone.</p>
          <div className="admin-delete-actions">
            <button className="admin-delete-confirm-btn" onClick={handleDelete}>Yes, Delete</button>
            <button className="admin-delete-cancel-btn" onClick={() => setDeleteTarget(null)}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AdminDashboard;
