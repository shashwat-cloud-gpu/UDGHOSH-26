import React, { useEffect, useRef } from "react";
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
  const bgRef = useRef(null);
  const overlayRef = useRef(null);

  // CinematicHero's last panel hands off to this section with a hard cut,
  // because this backdrop used to sit at opacity 1 the whole time, simply
  // hidden behind the still-pinned hero content until it releases. Instead,
  // fade this backdrop in on its own scroll-linked trigger as the section
  // approaches — since scroll position is tracked in real document
  // coordinates (unaffected by the hero panel's fixed/pinned overlay), this
  // fade completes *underneath* the hero panel while it's still visible, so
  // by the time the hero content actually goes away there's nothing left to
  // visibly change.
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "top top",
        scrub: 0.8,
        onUpdate: (self) => {
          const opacity = String(self.progress);
          if (bgRef.current) bgRef.current.style.opacity = opacity;
          if (overlayRef.current) overlayRef.current.style.opacity = opacity;
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <CinematicHero />

      <div ref={sectionRef} style={{ position: "relative" }}>
        <div
          ref={bgRef}
          style={{
            position: "fixed",
            inset: 0,
            backgroundImage: "url(/images/next_hall.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center top",
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

        <AfterMovies />
        <JoinCommunity />
      </div>

      <Footer2 />
    </>
  );
}
