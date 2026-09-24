import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar2 from "../navbar/Navbar2";

const cardData = {
  y2025: [
    { src: 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2024/photo1?_a=BAMAPqcg0', alt: '2025 Image 1' },
    { src: 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2024/photo2?_a=BAMAPqcg0', alt: '2025 Image 2' },
    { src: 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2024/photo3?_a=BAMAPqcg0', alt: '2025 Image 3' },
    { src: 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2024/photo4?_a=BAMAPqcg0', alt: '2025 Image 4' },
    { src: 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2024/photo5?_a=BAMAPqcg0', alt: '2025 Image 5' },
    { src: 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2024/photo6?_a=BAMAPqcg0', alt: '2025 Image 6' },
    { src: 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2024/photo7?_a=BAMAPqcg0', alt: '2025 Image 7' },
  ],
  y2024: [
    { src: 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2024/photo7?_a=BAMAPqcg0', alt: '2024 Image 1' },
    { src: 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2024/photo6?_a=BAMAPqcg0', alt: '2024 Image 2' },
    { src: 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2024/photo5?_a=BAMAPqcg0', alt: '2024 Image 3' },
    { src: 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2024/photo4?_a=BAMAPqcg0', alt: '2024 Image 4' },
    { src: 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2024/photo3?_a=BAMAPqcg0', alt: '2024 Image 5' },
    { src: 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2024/photo2?_a=BAMAPqcg0', alt: '2024 Image 6' },
    { src: 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2024/photo1?_a=BAMAPqcg0', alt: '2024 Image 7' },
  ],
  y2023: [
    { src: 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2023/photo1?_a=BAMAPqcg0', alt: '2023 Image 1' },
    { src: 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2023/photo2?_a=BAMAPqcg0', alt: '2023 Image 2' },
    { src: 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2023/photo3?_a=BAMAPqcg0', alt: '2023 Image 3' },
    { src: 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2023/photo4?_a=BAMAPqcg0', alt: '2023 Image 4' },
    { src: 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2023/photo5?_a=BAMAPqcg0', alt: '2023 Image 5' },
    { src: 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2023/photo6?_a=BAMAPqcg0', alt: '2023 Image 6' },
    { src: 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2023/photo7?_a=BAMAPqcg0', alt: '2023 Image 7' },
    { src: 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2023/photo8?_a=BAMAPqcg0', alt: '2023 Image 8' },
  ],
};

function App() {
  const [activeYear, setActiveYear] = useState("2024");
  const [currentCards, setCurrentCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
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

  // Intercept any internal link click (e.g. Navbar logo, links) to trigger the lit-to-dark transition
  const handleRootClick = (e) => {
    const anchor = e.target.closest("a");
    if (anchor && anchor.getAttribute("href")) {
      const href = anchor.getAttribute("href");
      if (href && (href.startsWith("/") || href.startsWith("#")) && !href.startsWith("//")) {
        e.preventDefault();
        handleNavigateAway(href === "/home" ? "/" : href);
      }
    }
  };

  useEffect(() => {
    const dataKey = `y${activeYear}`;
    const data = cardData[dataKey] || cardData.y2024;
    setCurrentCards(data);
    setCurrentIndex(Math.floor(data.length / 2));
  }, [activeYear]);

  useEffect(() => {
    let isThrottled = false;
    const handleWheel = (event) => {
      event.preventDefault();
      if (isThrottled) return;

      if (event.deltaY > 0) {
        setCurrentIndex((prev) => (prev + 1) % currentCards.length);
      } else {
        setCurrentIndex((prev) => (prev - 1 + currentCards.length) % currentCards.length);
      }

      isThrottled = true;
      setTimeout(() => {
        isThrottled = false;
      }, 600);
    };
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [currentCards.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % currentCards.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + currentCards.length) % currentCards.length);
  };

  const handleCardClick = (index) => {
    setCurrentIndex(index);
  };

  const handleYearChange = (year) => {
    setActiveYear(year);
  };

  const isEntered = transitionState === "entered";
  const isExiting = transitionState === "exiting";

  return (
    <div
      onClick={handleRootClick}
      className="app-root min-h-screen overflow-hidden relative text-white select-none bg-[#090807]"
    >
      {/* 1. Castle Hall Background with Embedded Lamps — transitions from dark to lit (and vice versa) */}
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/gallery_bg.jpg')",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
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
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle 800px at 50% 45%, rgba(254, 240, 138, 0.35) 0%, rgba(245, 158, 11, 0.18) 35%, transparent 70%)",
          opacity: isEntered ? 0.3 : 0,
          transition: "opacity 1.4s ease-out",
        }}
      />

      {/* 3. Dark Portal Transition Curtain: dark -> lit when entering, lit -> dark when exiting */}
      <div
        className="fixed inset-0 pointer-events-none z-30"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(9, 8, 7, 0.45) 0%, rgba(9, 8, 7, 1) 100%)",
          backgroundColor: "#090807",
          opacity: isEntered ? 0 : 1,
          transition: isExiting
            ? "opacity 0.75s ease-in"
            : "opacity 1.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      {/* 4. Atmospheric Vignette for Content Legibility */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.08) 0%, rgba(0, 0, 0, 0.48) 100%)",
        }}
      />

      <Navbar2 />

      {/* Header */}
      <div
        className="absolute top-[9.5vh] left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20 pointer-events-auto"
        style={{
          opacity: isEntered ? 1 : 0,
          transform: isEntered ? "translate(-50%, 0)" : "translate(-50%, -16px)",
          transition: isExiting
            ? "opacity 0.4s ease, transform 0.4s ease"
            : "opacity 1s ease 0.2s, transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
        }}
      >
        <h1
          className="text-4xl md:text-5xl font-bold uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-stone-100 to-amber-300 drop-shadow-[0_4px_24px_rgba(245,158,11,0.4)] mt-4"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          Gallery
        </h1>
        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-full shadow-[0_4px_25px_rgba(245,158,11,0.22)] border border-amber-500/30">
          {["2024", "2025"].map((year) => (
            <button
              key={year}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold tracking-wider transition-all duration-300 ${
                activeYear === year
                  ? "bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-stone-950 shadow-[0_0_20px_rgba(245,158,11,0.55)] font-bold"
                  : "text-stone-300 hover:text-white hover:bg-white/10"
              }`}
              style={{ fontFamily: "'Cinzel', serif" }}
              onClick={() => handleYearChange(year)}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div
        className="pointer-events-none relative w-full h-screen flex items-end justify-center max-w-[95vw] mx-auto [perspective:1500px] z-10"
        style={{
          opacity: isEntered ? 1 : 0,
          transform: isEntered ? "scale(1)" : "scale(0.95)",
          transition: isExiting
            ? "opacity 0.4s ease, transform 0.4s ease"
            : "opacity 1.1s ease 0.25s, transform 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.25s",
        }}
      >
        {currentCards.map((card, index) => {
          const numCards = currentCards.length;
          let offsetFromCurrent = index - currentIndex;
          if (offsetFromCurrent > numCards / 2) offsetFromCurrent -= numCards;
          if (offsetFromCurrent < -numCards / 2) offsetFromCurrent += numCards;

          const isCurrentCard = index === currentIndex;
          const distanceFromCenter = Math.abs(offsetFromCurrent);

          const isVisible = distanceFromCenter < 6;

          const xOffsetFactor = 120;
          const yOffsetFactor = 30;
          const rotationFactor = 40;
          const baseScale = 0.9;
          const centralCardScale = 1.1;

          let yOffset, xOffset, rotation, scale;
          scale = isCurrentCard ? centralCardScale : baseScale;

          if (isVisible) {
            yOffset = distanceFromCenter * yOffsetFactor;
            xOffset = offsetFromCurrent * xOffsetFactor;
            rotation = offsetFromCurrent * rotationFactor;
          } else {
            yOffset = 500;
            xOffset = 0;
            rotation = 0;
          }

          const style = {
            transform: `translateX(calc(-50% + ${xOffset}px)) translateY(${yOffset}px) rotate(${rotation}deg) scale(${scale})`,
            filter: isCurrentCard
              ? "grayscale(0%) brightness(1.06) drop-shadow(0 0 25px rgba(245,158,11,0.3))"
              : "grayscale(20%) brightness(0.85) contrast(0.95)",
            zIndex: numCards - distanceFromCenter,
            opacity: isVisible ? "1" : "0",
            transformOrigin: "bottom center",
            transition:
              "transform 0.6s cubic-bezier(0.65, 0, 0.35, 1), filter 0.6s cubic-bezier(0.65, 0, 0.35, 1), opacity 0.6s cubic-bezier(0.65, 0, 0.35, 1)",
          };

          return (
            <div
              key={`${activeYear}-${index}`}
              className="absolute w-[300px] h-[420px] left-1/2 bottom-[5vh] rounded-xl overflow-hidden shadow-[0_12px_28px_rgba(0,0,0,0.6),0_6px_10px_rgba(0,0,0,0.4)] pointer-events-auto cursor-pointer border border-white/10"
              style={style}
              onClick={() => handleCardClick(index)}
            >
              <img
                src={card.src}
                alt={card.alt}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2024/photo1?_a=BAMAPqcg0";
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <button
        id="prev-btn"
        aria-label="Previous"
        className="absolute top-1/2 left-[2vw] -translate-y-1/2 w-[48px] h-[48px] rounded-full bg-black/65 hover:bg-black/90 border border-amber-500/40 hover:border-amber-400 backdrop-blur-md flex items-center justify-center text-amber-200 hover:text-amber-100 shadow-[0_4px_20px_rgba(245,158,11,0.25)] hover:scale-110 active:scale-95 transition z-20 cursor-pointer pointer-events-auto"
        style={{
          opacity: isEntered ? 1 : 0,
          transition: isExiting ? "opacity 0.3s ease" : "opacity 1s ease 0.4s",
        }}
        onClick={handlePrev}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        id="next-btn"
        aria-label="Next"
        className="absolute top-1/2 right-[2vw] -translate-y-1/2 w-[48px] h-[48px] rounded-full bg-black/65 hover:bg-black/90 border border-amber-500/40 hover:border-amber-400 backdrop-blur-md flex items-center justify-center text-amber-200 hover:text-amber-100 shadow-[0_4px_20px_rgba(245,158,11,0.25)] hover:scale-110 active:scale-95 transition z-20 cursor-pointer pointer-events-auto"
        style={{
          opacity: isEntered ? 1 : 0,
          transition: isExiting ? "opacity 0.3s ease" : "opacity 1s ease 0.4s",
        }}
        onClick={handleNext}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <style>{`
        .app-root img {
          border-radius: 0 !important;
          box-shadow: none !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}

export default App;