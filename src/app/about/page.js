"use client";
// ===== About Page =====
// Explains the mission, vision, objectives, benefits, and purpose of Student Marketplace.

import { FaBullseye, FaEye, FaRocket, FaCheckCircle, FaHeart, FaUsers, FaShieldAlt } from "react-icons/fa";
import Breadcrumb from "../component/Breadcrumb/Breadcrumb";

function About() {
  const sections = [
    {
      icon: <FaBullseye />,
      title: "Our Mission",
      text: "To create a safe and trusted marketplace where university students can buy and sell school supplies and second-hand products without fear of scams. We verify every student to ensure a secure trading environment.",
    },
    {
      icon: <FaEye />,
      title: "Our Vision",
      text: "To become the leading student-only marketplace in Cambodia, connecting every university campus and making affordable education accessible to all students through safe peer-to-peer trading.",
    },
    {
      icon: <FaRocket />,
      title: "Our Objectives",
      text: "Reduce scams by allowing only verified students. Provide an easy-to-use platform for buying and selling. Foster a community of trust among university students. Keep fees low with just a 5% service charge on successful sales.",
    },
  ];

  const benefits = [
    { icon: <FaShieldAlt />, title: "Safe Trading", desc: "Only verified university students can participate." },
    { icon: <FaUsers />, title: "Student Community", desc: "Connect with peers from 5 universities across Cambodia." },
    { icon: <FaHeart />, title: "Affordable Prices", desc: "Save money on textbooks, electronics, and supplies." },
    { icon: <FaCheckCircle />, title: "Verified Profiles", desc: "Every user is verified with their student ID." },
  ];

  return (
    <div className="about page-fade">
      <div className="about-container">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Home", to: "/" },
            { label: "About" },
          ]}
        />

        {/* Hero section */}
        <div className="about-hero">
          <h1 className="about-hero-title">About Student Marketplace</h1>
          <p className="about-hero-text">
            Student Marketplace was created to solve a real problem: university students
            need affordable supplies but existing marketplaces are full of scams and strangers.
            We built a platform where only verified students can trade — making campus commerce
            safe, simple, and trustworthy.
          </p>
        </div>

        {/* Mission, Vision, Objectives */}
        <div className="about-sections">
          {sections.map((section, index) => (
            <div key={index} className="about-section-card">
              <div className="about-section-icon">{section.icon}</div>
              <h2 className="about-section-title">{section.title}</h2>
              <p className="about-section-text">{section.text}</p>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="about-benefits">
          <h2 className="about-benefits-title">Benefits of Using Student Marketplace</h2>
          <div className="about-benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="about-benefit-card">
                <div className="about-benefit-icon">{benefit.icon}</div>
                <h3 className="about-benefit-name">{benefit.title}</h3>
                <p className="about-benefit-desc">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why we exist */}
        <div className="about-why">
          <h2 className="about-why-title">Why This Website Exists</h2>
          <p className="about-why-text">
            Many students struggle with the cost of textbooks, electronics, and other school
            supplies. At the same time, graduating students have items they no longer need.
            Student Marketplace bridges this gap by creating a trusted space where students can
            help each other — buying and selling at fair prices, without the risk of dealing with
            anonymous sellers on public marketplaces. By requiring student verification, we ensure
            that every transaction is between real, accountable university students.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
