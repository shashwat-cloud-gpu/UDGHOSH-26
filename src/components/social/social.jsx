import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar2 from "../navbar/Navbar2.jsx";
import Footer2 from "../Footer2/Footer2.jsx";
import "./social.css";

const initiativesData = [
  {
    id: "udaan",
    title: "UDAAN",
    image: "https://live.staticflickr.com/65535/53225579402_da49bc827c_c.jpg",
    description:
      "UDAAN is a social initiative by UDGHOSH, to celebrate the differently-abled children of god. UDGHOSH reveres the spirit of the children by organizing various activities, talks, games and friendly sports competitions wherein the children can enjoy themselves and savor sportsmanship.",
  },
  {
    id: "marathon",
    title: "MARATHON",
    image: "https://live.staticflickr.com/65535/52398183996_f8cb83a0c5.jpg",
    description:
      "The Udghosh family's marathon unites Kanpur residents and locals, spreading awareness about women's empowerment and girl child education, engaging both the community and city in these vital causes.",
  },
  {
    id: "blood-donation",
    title: "BLOOD DONATION CAMP",
    image: "https://live.staticflickr.com/65535/52397672797_2a584fc67e.jpg",
    description:
      "This Gandhi Jayanti, Udghosh stands proud to organize “ Blood Donation Camp”, in collaboration with Raktarpan. Make a difference on this day to become the hero society needs. Battle fears, take a leap, and give someone a chance at life by voluntarily donating blood.",
  },
  {
    id: "plantation",
    title: "PLANTATION FOR DONATION",
    image: "https://live.staticflickr.com/65535/52398183966_610f96d4e1.jpg",
    description:
      "We are continuing the legacy of Udghosh's renowned social efforts. Udghosh, IIT Kanpur is hosting a tree-planting event on campus titled \"Plantation for Donation\" to battle challenges such as deforestation and global warming while improving the area's aesthetic appeal and ecological stability.",
  },
];

const Social = () => {
  const [transitionState, setTransitionState] = useState("entering"); // "entering" | "entered" | "exiting"
  const [deckOffsets, setDeckOffsets] = useState([]);
  const [dealtIndices, setDealtIndices] = useState(new Set());
  const [isDeckReady, setIsDeckReady] = useState(false);
  const [isDealing, setIsDealing] = useState(false);

  const gridRef = useRef(null);
  const cardRefs = useRef([]);
  const timersRef = useRef([]);
  const navigate = useNavigate();

  // Clean all dealing timers
  const clearDealTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  // Measure deck positions and deal cards 1 by 1
  const dealCardsOneByOne = useCallback(() => {
    clearDealTimers();
    if (!gridRef.current) return;

    const gridRect = gridRef.current.getBoundingClientRect();
    const centerX = gridRect.left + gridRect.width / 2;
    const centerY = gridRect.top + gridRect.height / 2;

    const newOffsets = cardRefs.current.map((el, i) => {
      if (!el) return { dx: 0, dy: 0, rot: 0 };
      const r = el.getBoundingClientRect();
      const elCenterX = r.left + r.width / 2;
      const elCenterY = r.top + r.height / 2;
      return {
        dx: centerX - elCenterX,
        dy: centerY - elCenterY,
        rot: (i - 1.5) * 2.8,
      };
    });

    setDeckOffsets(newOffsets);
    setDealtIndices(new Set());
    setIsDeckReady(true);
    setIsDealing(true);

    // Stagger slide out from deck 1 by 1
    const delays = [400, 800, 1200, 1600];
    delays.forEach((delay, idx) => {
      const timer = setTimeout(() => {
        setDealtIndices((prev) => new Set([...prev, idx]));
        if (idx === delays.length - 1) {
          setIsDealing(false);
        }
      }, delay);
      timersRef.current.push(timer);
    });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Trigger illumination transition
    const enterTimer = setTimeout(() => {
      setTransitionState("entered");
    }, 60);

    // Initial deck deal animation when site opens
    const dealInitTimer = setTimeout(() => {
      dealCardsOneByOne();
    }, 220);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(dealInitTimer);
      clearDealTimers();
    };
  }, [dealCardsOneByOne]);

  // Lit to dark transition before navigating
  const handleNavigateAway = (targetUrl) => {
    if (transitionState === "exiting") return;
    setTransitionState("exiting");
    setTimeout(() => {
      navigate(targetUrl);
    }, 750);
  };

  // Intercept internal link click
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
          <h1 className="social-main-title">Social Initiatives</h1>
          <div className="social-divider" />
          <button
            type="button"
            className="social-redeal-btn"
            onClick={dealCardsOneByOne}
            disabled={isDealing}
            title="Deal deck again"
          >
            <span>Re-deal Deck</span>
            <span>↺</span>
          </button>
        </div>

        {/* Deck Stage & Cards Grid */}
        <div className="social-deck-stage">
          <div className="social-cards-grid" ref={gridRef}>
            {initiativesData.map((item, index) => {
              const isDealt = dealtIndices.has(index);
              const offset = deckOffsets[index] || { dx: 0, dy: 0, rot: 0 };

              const cardStyle = !isDeckReady
                ? { opacity: 0 }
                : !isDealt
                ? {
                    transform: `translate3d(${offset.dx}px, ${offset.dy}px, 0) rotate(${offset.rot}deg) scale(0.96)`,
                    zIndex: 20 + (4 - index),
                    boxShadow: "0 18px 45px rgba(0, 0, 0, 0.9), 0 0 25px rgba(245, 158, 11, 0.2)",
                    transition: "transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.85s ease",
                  }
                : {
                    transform: "translate3d(0, 0, 0) rotate(0deg) scale(1)",
                    zIndex: 1,
                    transition: "transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.85s ease",
                  };

              return (
                <div
                  key={item.id}
                  ref={(el) => (cardRefs.current[index] = el)}
                  className={`social-card ${isDealt ? "is-dealt" : "in-deck"}`}
                  style={cardStyle}
                  onClick={() => {
                    if (!isDealt) {
                      setDealtIndices((prev) => new Set([...prev, index]));
                    }
                  }}
                >
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
                    <h3 className="social-card-title">{item.title}</h3>
                    <p className="social-card-desc">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer2 />
    </div>
  );
};

export default Social;
