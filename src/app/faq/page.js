"use client";
import { useState } from "react";
import Link from "next/link";
import { FaChevronDown, FaQuestionCircle, FaEnvelope } from "react-icons/fa";
import Breadcrumb from "../component/Breadcrumb/Breadcrumb";

const faqCategories = [
  {
    title: "Buying",
    items: [
      {
        q: "How do I buy a product?",
        a: "Browse the marketplace, find an item you like, and click 'Chat Seller' to start a conversation. Arrange a safe campus meetup, inspect the item, and pay in person.",
      },
      {
        q: "Can I negotiate the price?",
        a: "Yes. Most sellers are open to reasonable offers. Use the in-app chat to discuss pricing politely before meeting up.",
      },
      {
        q: "Is payment handled through the app?",
        a: "No. All payments happen in person at the meetup. We never ask for your card or bank details. This keeps you safe from scams.",
      },
    ],
  },
  {
    title: "Selling",
    items: [
      {
        q: "Who can sell on Student Marketplace?",
        a: "Only verified students enrolled at a Cambodian university. You must register with a valid student ID and university email.",
      },
      {
        q: "Is there a fee for selling?",
        a: "A small 5% service fee applies when your item sells. This helps us maintain the platform and keep it safe for students.",
      },
      {
        q: "How do I mark a product as sold?",
        a: "Go to My Products, find the listing, and update its status. This removes it from search results and keeps your profile accurate.",
      },
    ],
  },
  {
    title: "Safety",
    items: [
      {
        q: "How do I know a seller is verified?",
        a: "Every verified student has a green checkmark badge and a university tag on their profile and product cards. Never transact with unverified users.",
      },
      {
        q: "Where should I meet a seller?",
        a: "Always meet in a public place on or near campus during daylight hours. Popular spots include university cafeterias, libraries, and dorm lobbies.",
      },
      {
        q: "How do I report a suspicious listing?",
        a: "Click the 'Report' button on any product page and choose a reason. Our admin team reviews every report within 24 hours.",
      },
    ],
  },
];

function FAQ() {
  const [openId, setOpenId] = useState("0-0");

  return (
    <div className="faq page-fade">
      <div className="faq-container">
        <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "FAQ" }]} />

        <div className="faq-header">
          <span className="faq-eyebrow">
            <FaQuestionCircle /> Help Center
          </span>
          <h1 className="faq-title">Frequently asked questions</h1>
          <p className="faq-subtitle">
            Everything you need to know about buying, selling, and staying safe
            on Student Marketplace.
          </p>
        </div>

        <div className="faq-grid">
          {faqCategories.map((cat, ci) => (
            <div key={cat.title} className="faq-category">
              <h2 className="faq-category-title">{cat.title}</h2>
              <div className="faq-items">
                {cat.items.map((item, ii) => {
                  const id = `${ci}-${ii}`;
                  const open = openId === id;
                  return (
                    <div
                      key={id}
                      className={`faq-item ${open ? "open" : ""}`}
                    >
                      <button
                        className="faq-question"
                        onClick={() => setOpenId(open ? null : id)}
                        aria-expanded={open}
                      >
                        <span>{item.q}</span>
                        <FaChevronDown className="faq-chevron" />
                      </button>
                      <div className="faq-answer">
                        <p>{item.a}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="faq-contact-cta">
          <h3>Still have questions?</h3>
          <p>Our team is here to help. Reach out and we'll respond within a day.</p>
          <Link href="/contact" className="faq-contact-btn">
            <FaEnvelope /> Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FAQ;
