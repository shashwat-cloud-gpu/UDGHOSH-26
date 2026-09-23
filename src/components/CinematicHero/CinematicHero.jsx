import { useState, useEffect } from "react";
import CinematicPanel from "./CinematicPanel";
import SectionAbout from "./SectionAbout";
import SectionGate from "./SectionGate";
import MobileDeskGate from "./MobileDeskGate";
import Navbar2 from "../navbar/Navbar2";
import CastleAtmosphere from "./CastleAtmosphere";

export default function CinematicHero() {
  const [navbarVisible, setNavbarVisible] = useState(true);
  // The floating "scroll" cue is position:fixed, so with no visibility
  // logic it stays on screen forever — including over the About Us dwell
  // and beyond, which reads as a second, unrelated scene bleeding through.
  // Tie it to the hero panel's own dwell state instead.
  const [scrollCueVisible, setScrollCueVisible] = useState(true);
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

  return (
    <div style={{ position: "relative" }}>

      {/* Navbar visible from the start */}
      <Navbar2 isVisible={navbarVisible} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <CinematicPanel
          videoSrc="https://res.cloudinary.com/u5qztegz/video/upload/v1790203285/udghosh-23/videos/transition1.mp4"
          scrubVh="275vh"
          dwellVh="32vh"
          placeholderSrc={isMobile ? "https://res.cloudinary.com/u5qztegz/image/upload/q_auto,f_auto/v1790203294/udghosh-23/images/landing_page_mobile.webp" : "https://res.cloudinary.com/u5qztegz/image/upload/q_auto,f_auto/udghosh-23/landing_page.png"}
          staticBgSrc="https://res.cloudinary.com/u5qztegz/image/upload/q_auto,f_auto/v1790203289/udghosh-23/images/gate.jpg"
          outroBgSrc="https://res.cloudinary.com/u5qztegz/image/upload/q_auto,f_auto/v1790203289/udghosh-23/images/gate.jpg"
          outroStart={0.85}
          extendPinVh="80vh"
          onEnterDwell={() => setScrollCueVisible(false)}
          onLeaveDwell={() => setScrollCueVisible(true)}
        >
          {(dwellProgress) => (
            <>
              <CastleAtmosphere opacity={1} />
              <SectionAbout dwellProgress={dwellProgress} />
            </>
          )}
        </CinematicPanel>

        {/* Floating scroll cue (fixed so it overlays the pinned panel).
            Opacity fade lives on this outer div; the bounce animation
            lives on the inner div, so the two don't fight over the same
            CSS property. */}
        <div aria-hidden="true" style={{
          position: "fixed", bottom: "2.5rem", left: 0, right: 0,
          display: "flex", justifyContent: "center",
          zIndex: 5, pointerEvents: "none",
          opacity: scrollCueVisible ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}>
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: ".5rem",
            animation: "cineScrollBounce 1.9s ease-in-out infinite",
          }}>
            <svg width="22" height="34" viewBox="0 0 22 34" fill="none">
              <rect x="1" y="1" width="20" height="32" rx="10"
                stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
              <circle cx="11" cy="9" r="2.5" fill="rgba(255,255,255,0.5)">
                <animateTransform attributeName="transform" type="translate"
                  values="0,0;0,12;0,0" dur="1.9s" repeatCount="indefinite" />
              </circle>
            </svg>
            <span style={{
              fontSize: ".6rem", letterSpacing: ".3em", textTransform: "uppercase",
              color: "rgba(255,255,255,.3)", fontFamily: "Poppins,sans-serif",
            }}>scroll</span>
          </div>
        </div>
      </div>

      {isMobile ? (
        <div style={{ position: "relative", zIndex: 2, marginTop: "-100vh" }}>
          <CinematicPanel
            key="mobile-gate-panel"
            videoSrc="https://res.cloudinary.com/u5qztegz/video/upload/v1790203287/udghosh-23/videos/transition2.mp4"
            scrubVh="140vh"
            dwellVh="300vh"
            placeholderSrc="https://res.cloudinary.com/u5qztegz/image/upload/q_auto,f_auto/v1790203289/udghosh-23/images/gate.jpg"
            staticBgSrc="https://res.cloudinary.com/u5qztegz/image/upload/q_auto,f_auto/v1790203295/udghosh-23/images/mobile_desk.webp"
            outroBgSrc="https://res.cloudinary.com/u5qztegz/image/upload/q_auto,f_auto/v1790203295/udghosh-23/images/mobile_desk.webp"
            outroStart={0.95}
            hideBeforePin={true}
            fadeOutProgressStart={0.827}
            onEnterDwell={() => setNavbarVisible(true)}
          >
            {(dwellProgress) => <MobileDeskGate dwellProgress={dwellProgress} />}
          </CinematicPanel>
        </div>
      ) : (
        <div style={{ position: "relative", zIndex: 2, marginTop: "-100vh" }}>
          <CinematicPanel
            key="desktop-gate-panel"
            videoSrc="https://res.cloudinary.com/u5qztegz/video/upload/v1790203287/udghosh-23/videos/transition2.mp4"
            scrubVh="250vh"
            dwellVh="300vh"
            placeholderSrc="https://res.cloudinary.com/u5qztegz/image/upload/q_auto,f_auto/v1790203289/udghosh-23/images/gate.jpg"
            staticBgSrc="https://res.cloudinary.com/u5qztegz/image/upload/q_auto,f_auto/v1790203290/udghosh-23/images/hall.jpg"
            outroBgSrc="https://res.cloudinary.com/u5qztegz/image/upload/q_auto,f_auto/v1790203291/udghosh-23/images/next_hall.jpg"
            outroStart={0.85}
            hideBeforePin={true}
            fadeOutProgressStart={0.875}
            onEnterDwell={() => setNavbarVisible(true)}
          >
            {(dwellProgress) => <SectionGate dwellProgress={dwellProgress} />}
          </CinematicPanel>
        </div>
      )}

    </div>
  );
}
