import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar2 from "../navbar/Navbar2.jsx";
import "./index.css";

// Reusable EventCard with Scroll Animation and Image Fallback
function EventCard({ title, mainDesc, subDesc, image, reverse }) {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.15,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const wrapperClasses = `past-events-card-wrapper ${reverse ? "card-pos-right" : "card-pos-left"} ${isVisible ? "is-visible" : ""}`;

  return (
    <div className={wrapperClasses.trim()} ref={cardRef}>
      <div className="past-events-card">
        <div className="event-image-container">
          <img
            src={image}
            alt={title}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2024/photo1?_a=BAMAPqcg0";
            }}
          />
        </div>
        <div className="event-text-content">
          <div className="event-title-box">
            <h2 className="event-title">{title}</h2>
          </div>
          <p className="event-description-main">{mainDesc}</p>
          {subDesc && <p className="event-description-sub">{subDesc}</p>}
        </div>
      </div>
    </div>
  );
}

export default function PastEvents() {
  const [transitionState, setTransitionState] = useState("entering"); // "entering" | "entered" | "exiting"
  const navigate = useNavigate();

  // Entrance transition: smoothly brighten from dark to the warm illuminated hall
  useEffect(() => {
    const timer = setTimeout(() => {
      setTransitionState("entered");
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  // Exit transition ("vice versa"): smoothly dim down from lit into darkness before navigating
  const handleNavigateAway = (targetUrl) => {
    if (transitionState === "exiting") return;
    setTransitionState("exiting");
    setTimeout(() => {
      navigate(targetUrl);
    }, 750);
  };

  // Intercept any internal link click (e.g. Navbar links) to trigger the lit-to-dark transition
  const handleRootClick = (e) => {
    const anchor = e.target.closest("a");
    if (anchor && anchor.getAttribute("href")) {
      const href = anchor.getAttribute("href");
      if (href && (href.startsWith("/") || href.startsWith("#")) && !href.startsWith("//") && !anchor.getAttribute("target")) {
        e.preventDefault();
        handleNavigateAway(href === "/home" ? "/" : href);
      }
    }
  };

  const events = [
    {
      title: "Pronite with Ash King",
      mainDesc: "An enchanting evening as Ash King graced the stage with his soulful voice and chart-topping hits. The audience was swept away by his mesmerizing performance, making Pro Nite a truly magical experience.",
      image: "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/Ashking?_a=BAMAPqcg0",
    },
    {
      title: "Pronite with Karan Kanchan",
      mainDesc: "A magical Pro Nite as Karan Kanchra set the stage alive with his soulful voice and heartfelt songs. The crowd swayed, sang along, and cherished every note in a night full of unforgettable melodies",
      image: "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/karan?_a=BAMAPqcg0",
      reverse: true
    },
    {
      title: "Band Performance with Yash raj",
      mainDesc: "Band Performance by Yash Raj brought a perfect blend of talent, rhythm, and stage presence. Their captivating music and seamless teamwork turned the evening into a mesmerizing experience for everyone present.",
      image: "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/Yash?_a=BAMAPqcg0",
    },
    {
      title: "EDM Night with Sartek",
      mainDesc: "EDM Night with Sartek was a high-voltage celebration of music, energy, and togetherness. The pulsating beats, stunning visuals, and electrifying atmosphere created memories that still resonate with every attendee.",
      image: "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/EDM?_a=BAMAPqcg0",
      reverse: true
    },
    {
      title: "Bollywood night with Gajender verma",
      mainDesc: "Bollywood Night with Gajendra Verma was a celebration of music and emotions. His soulful performances, combined with the audience’s enthusiasm, turned the evening into an unforgettable experience that resonated long after the final note",
      image: "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/Bollywood?_a=BAMAPqcg0",
    },
    {
      title: "DJ Night with Ravator",
      mainDesc: "Nonstop energy, thumping bass, and an electrifying crowd — that’s what DJ Night with Ravator was all about. Truly a night to remember!”",
      image: "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/Ravator?_a=BAMAPqcg0",
      reverse: true
    },
    {
      title: "Rap show with Thugs",
      mainDesc: "A power-packed night as Thugs from Overseas took the stage with hard-hitting rap, raw energy, and unstoppable flow. The beats dropped heavy, the crowd vibed harder — a true celebration of hip-hop culture.",
      image: "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/thugs?_a=BAMAPqcg0",
    }
  ];

  const isEntered = transitionState === "entered";
  const isExiting = transitionState === "exiting";

  return (
    <div onClick={handleRootClick} className="past-events-page">
      {/* 1. Castle Hall Background with Embedded Lamps — transitions dark <-> lit */}
      <div
        className="past-events-bg"
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
        className="past-events-lantern-bloom"
        style={{
          opacity: isEntered ? 0.35 : 0,
          transition: "opacity 1.4s ease-out",
        }}
      />

      {/* 3. Dark Portal Transition Curtain: dark -> lit when entering, lit -> dark when exiting */}
      <div
        className="past-events-curtain"
        style={{
          opacity: isEntered ? 0 : 1,
          transition: isExiting
            ? "opacity 0.75s ease-in"
            : "opacity 1.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      {/* 4. Atmospheric Vignette for Content Legibility */}
      <div className="past-events-vignette" />

      {/* Navigation Bar */}
      <Navbar2 />

      {/* Main Content */}
      <div className="past-events-container">
        <div className="past-events-header-box">
          <div className="past-events-tagline">
            <span>Udghosh Archives</span>
          </div>
          <h1 className="past-events-main-title">Our Past Events</h1>
          <div className="past-events-divider" />
        </div>

        <div className="past-events-cards">
          {events.map((event, i) => (
            <EventCard key={i} {...event} />
          ))}
        </div>
      </div>
    </div>
  );
}