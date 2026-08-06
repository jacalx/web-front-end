"use client";
// ===== Terms Page =====
// Explains the rules and terms of using Student Marketplace.
// Covers: student-only access, verification, genuine info, prohibited items,
// admin rights, service fee, and user conduct.

import { FaCheckCircle, FaTimesCircle, FaShieldAlt, FaHandshake, FaPercentage, FaUserShield } from "react-icons/fa";
import Breadcrumb from "../component/Breadcrumb/Breadcrumb";

function Terms() {
  const terms = [
    {
      icon: <FaUserShield />,
      title: "Student-Only Access",
      text: "Only currently enrolled university students may use this website. You must provide a valid student ID and university email during registration.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Student Verification Required",
      text: "All users must complete the student verification process. Accounts that fail verification will be suspended immediately.",
    },
    {
      icon: <FaCheckCircle />,
      title: "Genuine Information",
      text: "Users must upload genuine and accurate information, including real photos of products, correct descriptions, and honest condition ratings.",
    },
    {
      icon: <FaTimesCircle />,
      title: "Scam Products Prohibited",
      text: "Posting scam products, misleading listings, or attempting to defraud other students is strictly prohibited and will result in permanent ban.",
    },
    {
      icon: <FaTimesCircle />,
      title: "Illegal Products Prohibited",
      text: "Illegal items, counterfeit goods, weapons, drugs, and any prohibited items are not allowed. Violators will be reported to authorities.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Admin Rights",
      text: "Administrators reserve the right to remove any product, suspend any account, or ban any user who violates these terms without prior notice.",
    },
    {
      icon: <FaPercentage />,
      title: "5% Service Fee",
      text: "After a successful sale, a 5% service fee will be charged to the seller. This fee helps maintain the platform and keep it safe for all students.",
    },
    {
      icon: <FaHandshake />,
      title: "Respect Other Users",
      text: "All users must treat each other with respect. Harassment, hate speech, or abusive behavior will not be tolerated and may result in account suspension.",
    },
  ];

  return (
    <div className="terms page-fade">
      <div className="terms-container">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Home", to: "/" },
            { label: "Terms & Rules" },
          ]}
        />

        {/* Header */}
        <div className="terms-header">
          <h1 className="terms-title">Terms & Rules</h1>
          <p className="terms-subtitle">
            Please read these terms carefully before using Student Marketplace.
            By using this platform, you agree to follow all rules listed below.
          </p>
        </div>

        {/* Terms list */}
        <div className="terms-list">
          {terms.map((term, index) => (
            <div key={index} className="terms-item">
              <div className="terms-item-icon">{term.icon}</div>
              <div className="terms-item-content">
                <h3 className="terms-item-title">
                  {String(index + 1).padStart(2, "0")}. {term.title}
                </h3>
                <p className="terms-item-text">{term.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="terms-footer-note">
          <p>
            These terms may be updated from time to time. Continued use of Student Marketplace
            after changes constitutes acceptance of the updated terms.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Terms;
