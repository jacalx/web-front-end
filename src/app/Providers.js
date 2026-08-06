"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AppProvider, useApp } from "../context/AppContext";
import DomainGuard from "./DomainGuard";
import Navbar from "./component/Navbar/Navbar";
import Footer from "./component/Footer/Footer";

import "../index.css";
import "../App.css";

import "./component/Breadcrumb/Breadcrumb.css";
import "./component/CategoryCard/CategoryCard.css";
import "./component/ChatPreview/ChatPreview.css";
import "./component/FilterPanel/FilterPanel.css";
import "./component/Footer/Footer.css";
import "./component/Hero/Hero.css";
import "./component/LoadingSpinner/LoadingSpinner.css";
import "./component/Modal/Modal.css";
import "./component/Navbar/Navbar.css";
import "./component/NotificationBell/NotificationBell.css";
import "./component/Pagination/Pagination.css";
import "./component/ProductCard/ProductCard.css";
import "./component/SearchBar/SearchBar.css";
import "./component/Sidebar/Sidebar.css";

import "../pages/About/About.css";
import "../pages/AdminDashboard/AdminDashboard.css";
import "../pages/Chat/Chat.css";
import "../pages/Contact/Contact.css";
import "../pages/EditProfile/EditProfile.css";
import "../pages/FAQ/FAQ.css";
import "../pages/Home/Home.css";
import "../pages/Login/Login.css";
import "../pages/Marketplace/Marketplace.css";
import "../pages/MyProducts/MyProducts.css";
import "../pages/NotFound/NotFound.css";
import "../pages/Notifications/Notifications.css";
import "../pages/ProductDetail/ProductDetail.css";
import "../pages/Profile/Profile.css";
import "../pages/Register/Register.css";
import "../pages/SellProduct/SellProduct.css";
import "../pages/Terms/Terms.css";
import "../pages/Wishlist/Wishlist.css";

function ScrollToTop() {
  const pathname = usePathname();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent({ children }) {
  const { hydrated } = useApp();
  if (!hydrated) return null;
  return (
    <>
      <ScrollToTop />
      <div className="app">
        <Navbar />
        <main className="app-main">{children}</main>
        <Footer />
      </div>
    </>
  );
}

export default function Providers({ children }) {
  return (
    <AppProvider>
      <DomainGuard />
      <AppContent>{children}</AppContent>
    </AppProvider>
  );
}
