import { useState, useEffect } from "react";
import CinematicPanel from "./CinematicPanel";
import SectionAbout from "./SectionAbout";
import SectionGate from "./SectionGate";
import MobileDeskGate from "./MobileDeskGate";
import Navbar2 from "../navbar/Navbar2";
import CastleAtmosphere from "./CastleAtmosphere";

export default function CinematicHero() {
  const [navbarVisible, setNavbarVisible] = useState(false);
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
    <div style={{ position: "relative", backgroundColor: "#000" }}>

      {/* Navbar hidden until SectionGate dwell begins */}
      <Navbar2 isVisible={navbarVisible} />

      <div style={{ position: "relative" }}>
        <CinematicPanel
          framesPath="/frames/transition1/frame_"
          frameCount={192}
          frameExt="jpg"
          scrubVh="550vh"
          dwellVh="320vh"
          placeholderSrc={isMobile ? "/images/landing_page_mobile.webp" : "/images/landing_page.png"}
          staticBgSrc="/images/gate.jpg"
          outroBgSrc="/images/gate.jpg"
          outroStart={0.85}
          extendPinVh="800vh"
        >
          {(dwellProgress) => (
            <>
              <CastleAtmosphere opacity={1} />
              <SectionAbout dwellProgress={dwellProgress} />
            </>
          )}
        </CinematicPanel>

        {/* Floating scroll cue (fixed so it overlays the pinned panel) */}
        <div aria-hidden="true" style={{
          position: "fixed", bottom: "2.5rem", left: 0, right: 0,
          display: "flex", justifyContent: "center",
          zIndex: 5, pointerEvents: "none",
          animation: "cineScrollBounce 1.9s ease-in-out infinite",
        }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".5rem" }}>
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
        <div style={{ position: "relative", zIndex: 2 }}>
          <CinematicPanel
            key="mobile-gate-panel"
            framesPath="/frames/transition2/frame_"
            frameCount={75}
            frameExt="jpg"
            scrubVh="280vh"
            dwellVh="300vh"
            placeholderSrc="/images/gate.jpg"
            staticBgSrc="/images/mobile_desk.webp"
            outroBgSrc="/images/mobile_desk.webp"
            outroStart={0.95}
            hideBeforePin={true}
            onEnterDwell={() => setNavbarVisible(true)}
          >
            {(dwellProgress) => <MobileDeskGate dwellProgress={dwellProgress} />}
          </CinematicPanel>
        </div>
      ) : (
        <div style={{ position: "relative", zIndex: 2 }}>
          <CinematicPanel
            key="desktop-gate-panel"
            framesPath="/frames/transition2/frame_"
            frameCount={192}
            frameExt="jpg"
            scrubVh="500vh"
            dwellVh="300vh"
            placeholderSrc="/images/gate.jpg"
            staticBgSrc="/images/hall.jpg"
            outroBgSrc="/images/next_hall.jpg"
            outroStart={0.85}
            hideBeforePin={true}
            onEnterDwell={() => setNavbarVisible(true)}
          >
            {(dwellProgress) => <SectionGate dwellProgress={dwellProgress} />}
          </CinematicPanel>
        </div>
      )}

    </div>
  );
}
