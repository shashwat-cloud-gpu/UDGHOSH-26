import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Homepage.css";
import CinematicHero from "../CinematicHero/CinematicHero";
import AfterMovies from "../Aftermovies/Aftermovies";
import JoinCommunity from "../Community/Community";
import Footer2 from "../Footer2/Footer2.jsx";

gsap.registerPlugin(ScrollTrigger);

export default function Homepage() {
  const sectionRef = useRef(null);
  const pinWrapperRef = useRef(null);
  const bgRef = useRef(null);
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    const urlParams = new URLSearchParams(window.location.search);
    return (
      window.innerWidth < 820 ||
      urlParams.get("mobile") === "desk" ||
      urlParams.get("mobile") === "table" ||
      urlParams.get("mobile") === "1"
    );
  });

  useEffect(() => {
    const checkMobile = () => {
      const urlParams = new URLSearchParams(window.location.search);
      setIsMobile(
        window.innerWidth < 820 ||
        urlParams.get("mobile") === "desk" ||
        urlParams.get("mobile") === "table" ||
        urlParams.get("mobile") === "1"
      );
    };
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Fade the background in perfectly underneath Panel 2's final moments
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "top top",
        scrub: true,
        onUpdate: (self) => {
          const opacity = String(self.progress);
          if (bgRef.current) bgRef.current.style.opacity = opacity;
          if (overlayRef.current) overlayRef.current.style.opacity = opacity;
        },
      });

      // 2. Lock the page in place exactly when Panel 2 begins its fade out
      ScrollTrigger.create({
        trigger: pinWrapperRef.current,
        start: "top top",
        end: "+=200%", // Keep it pinned for 2 screen heights (100vh for crossfade, 100vh for read time)
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          if (contentRef.current) {
            // Fade in over the first half of the pin duration
            contentRef.current.style.opacity = Math.min(1, self.progress * 2);
          }
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <CinematicHero />

      {/* Fixed backgrounds must be OUTSIDE the pinned sectionRef to prevent GSAP from stretching/scrolling them */}
      <div
        ref={bgRef}
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: isMobile ? "url(https://res.cloudinary.com/u5qztegz/image/upload/q_auto,f_auto/v1790203295/udghosh-23/images/mobile_desk.webp)" : "url(https://res.cloudinary.com/u5qztegz/image/upload/q_auto,f_auto/v1790203292/udghosh-23/images/next_hall.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: -1,
          pointerEvents: "none",
          opacity: 0,
        }}
      />
      <div
        ref={overlayRef}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          zIndex: -1,
          pointerEvents: "none",
          opacity: 0,
        }}
      />

      {/* marginTop: -200vh pulls this section up so it perfectly overlaps the final 100vh of the Hero pin */}
      <div ref={sectionRef} style={{ position: "relative", marginTop: "-200vh", zIndex: 1 }}>
        <div ref={pinWrapperRef}>
          {/* Content fades in motionlessly while the background is locked */}
          <div ref={contentRef} style={{ opacity: 0 }}>
            <AfterMovies />
            <JoinCommunity />
          </div>
        </div>
      </div>

      <Footer2 />
    </>
  );
}
