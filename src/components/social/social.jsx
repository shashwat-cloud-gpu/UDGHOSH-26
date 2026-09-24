import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar2 from "../navbar/Navbar2.jsx";
import Footer2 from "../Footer2/Footer2.jsx";
import "./social.css";

const initiativesData = [
  {
    id: "udaan",
    badge: "Inclusivity & Smiles",
    title: "UDAAN",
    image: "https://live.staticflickr.com/65535/53225579402_da49bc827c_c.jpg",
    description:
      "UDAAN is a social initiative by UDGHOSH, to celebrate the differently-abled children of god. UDGHOSH reveres the spirit of the children by organizing various activities, talks, games and friendly sports competitions wherein the children can enjoy themselves and savor sportsmanship.",
  },
  {
    id: "marathon",
    badge: "Women Empowerment & Education",
    title: "Udghosh Marathon",
    image: "https://live.staticflickr.com/65535/52398183996_f8cb83a0c5.jpg",
    description:
      "The Udghosh family's marathon unites Kanpur residents and locals, spreading awareness about women's empowerment and girl child education, engaging both the community and city in these vital causes.",
  },
  {
    id: "blood-donation",
    badge: "Gift of Life • Raktarpan",
    title: "Blood Donation Camp",
    image: "https://live.staticflickr.com/65535/52397672797_2a584fc67e.jpg",
    description:
      "This Gandhi Jayanti, Udghosh stands proud to organize “Blood Donation Camp”, in collaboration with Raktarpan. Make a difference on this day to become the hero society needs. Battle fears, take a leap, and give someone a chance at life by voluntarily donating blood.",
  },
  {
    id: "plantation",
    badge: "Green Earth & Ecological Hope",
    title: "Plantation for Donation",
    image: "https://live.staticflickr.com/65535/52398183966_610f96d4e1.jpg",
    description:
      "We are continuing the legacy of Udghosh's renowned social efforts. Udghosh, IIT Kanpur is hosting a tree-planting event on campus titled \"Plantation for Donation\" to battle challenges such as deforestation and global warming while improving the area's aesthetic appeal and ecological stability.",
  },
];

const valuesData = [
  {
    icon: "♥",
    heading: "Inclusive Play",
    text: "Every game is an open invitation. We believe every soul deserves the joy of play, genuine companionship, and celebration regardless of background or ability.",
  },
  {
    icon: "★",
    heading: "City & Community First",
    text: "Bridging the university and Kanpur with empathy, blood donation camps, and girl child empowerment initiatives that create lasting grassroots impact.",
  },
  {
    icon: "✿",
    heading: "Ecological Care",
    text: "Honoring our environment with mindful campus greening, active tree planting, and sustainable stewardship for the generations to follow.",
  },
];

const Social = () => {
  const [transitionState, setTransitionState] = useState("entering"); // "entering" | "entered" | "exiting"
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setTransitionState("entered");
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  // Exit transition: smoothly dim down from lit into darkness before navigating
  const handleNavigateAway = (targetUrl) => {
    if (transitionState === "exiting") return;
    setTransitionState("exiting");
    setTimeout(() => {
      navigate(targetUrl);
    }, 750);
  };

  // Intercept internal link click to trigger the lit-to-dark transition
  const handleRootClick = (e) => {
    const anchor = e.target.closest("a");
    if (anchor && anchor.getAttribute("href")) {
      const href = anchor.getAttribute("href");
      if (
        href &&
        (href.startsWith("/") || href.startsWith("#")) &&
        !href.startsWith("//") &&
        !anchor.getAttribute("target")
      ) {
        e.preventDefault();
        handleNavigateAway(href === "/home" ? "/" : href);
      }
    }
  };

  const isEntered = transitionState === "entered";
  const isExiting = transitionState === "exiting";

  return (
    <div onClick={handleRootClick} className="social-page">
      {/* 1. Castle Hall Background with Embedded Lamps — transitions dark <-> lit */}
      <div
        className="social-bg"
        style={{
          backgroundImage: "url('/images/gallery_bg.jpg')",
          filter:
            transitionState === "entering"
              ? "contrast(1.15) brightness(0.12) saturate(0.6) blur(6px)"
              : isExiting
              ? "contrast(1.15) brightness(0.10) saturate(0.5) blur(6px)"
              : "contrast(1.05) brightness(0.95) saturate(1.0) blur(0px)",
          transform:
            transitionState === "entering" || isExiting ? "scale(1.05)" : "scale(1.01)",
          transition: isExiting
            ? "filter 0.75s ease-in, transform 0.75s ease-in"
            : "filter 1.3s cubic-bezier(0.16, 1, 0.3, 1), transform 1.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      {/* 2. Warm Lantern Light Flare Burst that blooms as we emerge into the lit hall */}
      <div
        className="social-lantern-bloom"
        style={{
          opacity: isEntered ? 0.35 : 0,
          transition: "opacity 1.4s ease-out",
        }}
      />

      {/* 3. Dark Portal Transition Curtain: dark -> lit when entering, lit -> dark when exiting */}
      <div
        className="social-curtain"
        style={{
          opacity: isEntered ? 0 : 1,
          transition: isExiting
            ? "opacity 0.75s ease-in"
            : "opacity 1.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      {/* 4. Atmospheric Vignette for Content Legibility */}
      <div className="social-vignette" />

      {/* Navigation */}
      <Navbar2 />

      {/* Main Container */}
      <div className="social-container">
        {/* Header Section */}
        <div className="social-header-box">
          <div className="social-tagline">
            <span>✦ Citadel of Compassion ✦</span>
          </div>
          <h1 className="social-main-title">Our Social Initiatives</h1>
          <p className="social-subtext">
            Beyond the roar of competition lies a deeper purpose. At Udghosh, we
            champion inclusivity, celebrate resilience, and illuminate lives through
            sportsmanship, health, and community stewardship.
          </p>
          <div className="social-divider" />
        </div>

        {/* Initiatives Grid */}
        <div className="social-grid">
          {initiativesData.map((item) => (
            <div key={item.id} className="social-card">
              <div className="social-card-img-wrap">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2024/photo1?_a=BAMAPqcg0";
                  }}
                />
              </div>
              <div className="social-card-body">
                <span className="social-card-badge">✦ {item.badge}</span>
                <h3 className="social-card-title">{item.title}</h3>
                <p className="social-card-desc">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Wholesome Community Values Strip */}
        <div className="social-values-section">
          <div className="social-values-header">
            <h2 className="social-values-title">The Heart That Guides Us</h2>
            <p className="social-values-desc">
              Three foundational pillars that unite our sporting festival with heartfelt
              humanitarian care and responsibility.
            </p>
          </div>
          <div className="social-values-grid">
            {valuesData.map((val, idx) => (
              <div key={idx} className="social-value-box">
                <div className="social-value-icon">{val.icon}</div>
                <h4 className="social-value-heading">{val.heading}</h4>
                <p className="social-value-text">{val.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer2 />
    </div>
  );
};

export default Social;
