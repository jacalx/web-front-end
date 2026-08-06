"use client";
import Link from "next/link";
import { FaHome, FaSearch, FaArrowLeft } from "react-icons/fa";

function NotFound() {
  return (
    <div className="notfound page-fade">
      <div className="notfound-inner">
        <div className="notfound-code">404</div>
        <h1 className="notfound-title">Page not found</h1>
        <p className="notfound-text">
          The page you're looking for may have been moved, sold, or never listed.
          Let's get you back to browsing.
        </p>
        <div className="notfound-actions">
          <Link href="/" className="notfound-btn-primary">
            <FaHome /> Back to Home
          </Link>
          <Link href="/marketplace" className="notfound-btn-secondary">
            <FaSearch /> Browse Marketplace
          </Link>
        </div>
        <Link href="/" className="notfound-back">
          <FaArrowLeft /> Return to safety
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
