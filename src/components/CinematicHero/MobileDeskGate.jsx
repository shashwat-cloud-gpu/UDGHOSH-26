import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// 7 Drawers corresponding to the 7 vertical drawers on the right column of the rolltop desk
const DRAWERS = [
  {
    id: "competitions",
    url: "https://events.udghosh.org.in/",
    external: true,
    image: "/images/desk_drawers/competitions.webp",
    top: "20.1%",
    height: "9.7%",
    focalX: 63.4,
    focalY: 25.0,
  },
  {
    id: "websites",
    url: "https://unosq.udghosh.org.in/",
    external: true,
    image: "/images/desk_drawers/websites.webp",
    top: "30.1%",
    height: "10.2%",
    focalX: 63.4,
    focalY: 35.2,
  },
  {
    id: "gallery",
    url: "/gallery",
    external: false,
    image: "/images/desk_drawers/gallery.webp",
    top: "40.5%",
    height: "10.2%",
    focalX: 63.4,
    focalY: 45.6,
  },
  {
    id: "team",
    url: "/teams",
    external: false,
    image: "/images/desk_drawers/team.webp",
    top: "51.1%",
    height: "9.1%",
    focalX: 63.4,
    focalY: 55.6,
  },
  {
    id: "proshows",
    url: "/past-events",
    external: false,
    image: "/images/desk_drawers/proshows.webp",
    top: "60.5%",
    height: "9.1%",
    focalX: 63.4,
    focalY: 65.0,
  },
  {
    id: "merchandise",
    url: "/merch",
    external: false,
    image: "/images/desk_drawers/merchandise.webp",
    top: "69.8%",
    height: "9.3%",
    focalX: 63.4,
    focalY: 74.5,
  },
  {
    id: "esports",
    url: "https://esports.udghosh.org.in/",
    external: true,
    image: "/images/desk_drawers/esports.webp",
    top: "79.4%",
    height: "10.6%",
    focalX: 63.4,
    focalY: 84.7,
  },
];

// Common column geometry for the drawer stack
const DRAWER_LEFT = "46.9%";
const DRAWER_WIDTH = "32.9%";

function trapezoid(t) {
  if (t < 0.04) return t / 0.04;
  if (t < 0.90) return 1;
  return 1 - (t - 0.90) / 0.10;
}

export default function MobileDeskGate({ dwellProgress = 0 }) {
  const [selectedDrawer, setSelectedDrawer] = useState(null);
  const [animPhase, setAnimPhase] = useState("idle"); // "idle" | "opening" | "zooming" | "void"
  const [hoveredDrawer, setHoveredDrawer] = useState(null);
  const [touchedDrawer, setTouchedDrawer] = useState(null);
  const navigate = useNavigate();
  const timeoutsRef = useRef([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  useEffect(() => {
    return () => clearAllTimeouts();
  }, []);

  const handleDrawerTap = (drawer) => {
    if (selectedDrawer) return; // Prevent double tap during sequence
    setSelectedDrawer(drawer);
    clearAllTimeouts();

    // Phase 1: Close-up camera state triggered, drawer slides open in 3D perspective
    setAnimPhase("opening");

    // Phase 2: Simultaneous smooth, rapid continuous zoom directly into the void
    const tZoom = setTimeout(() => {
      setAnimPhase("zooming");
    }, 280);
    timeoutsRef.current.push(tZoom);

    // Phase 3: Plunge fully into the void mask
    const tVoid = setTimeout(() => {
      setAnimPhase("void");
    }, 700);
    timeoutsRef.current.push(tVoid);

    // Phase 4: Screen transitions to the destination URL
    const tNav = setTimeout(() => {
      if (drawer.external) {
        window.open(drawer.url, "_blank", "noopener,noreferrer");
        // Reset animation state gently if returning to page
        const tReset = setTimeout(() => {
          setAnimPhase("idle");
          setSelectedDrawer(null);
        }, 600);
        timeoutsRef.current.push(tReset);
      } else {
        navigate(drawer.url);
      }
    }, 950);
    timeoutsRef.current.push(tNav);
  };

  const opacity = trapezoid(dwellProgress);
  const isOpening = animPhase === "opening" || animPhase === "zooming" || animPhase === "void";
  const isZooming = animPhase === "zooming" || animPhase === "void";
  const isVoid = animPhase === "void";

  // Dynamic zoom origin focused on the tapped drawer's center
  const originX = selectedDrawer ? `${selectedDrawer.focalX}%` : "63.4%";
  const originY = selectedDrawer ? `${selectedDrawer.focalY}%` : "50%";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        pointerEvents: opacity > 0.15 && !isVoid ? "auto" : "none",
        backgroundColor: "#050302",
        overflow: "hidden",
        fontFamily: "'Cinzel', serif",
        zIndex: 10,
        userSelect: "none",
        WebkitUserSelect: "none",
        touchAction: selectedDrawer ? "none" : "pan-y",
      }}
    >
      {/* 3D Perspective Viewport for the Camera Move */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          perspective: "1200px",
          perspectiveOrigin: `${originX} ${originY}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Camera Rig (Transforms into the drawer void) */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) ${
              isZooming
                ? `scale(13.8) translateZ(460px)`
                : isOpening
                ? `scale(1.22) translateZ(60px)`
                : "scale(1) translateZ(0px)"
            }`,
            transformOrigin: `${originX} ${originY}`,
            width: "max(100vw, calc(100vh * 571 / 1024))",
            height: "max(100vh, calc(100vw * 1024 / 571))",
            transition: isZooming
              ? "transform 0.78s cubic-bezier(0.25, 1, 0.35, 1)"
              : isOpening
              ? "transform 0.35s cubic-bezier(0.2, 0.8, 0.4, 1)"
              : "transform 0.5s ease-out",
            willChange: "transform",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Base Desk Image with Vignette / Blur on tap */}
          <img
            src="/images/mobile_desk.webp"
            alt="Antique Rolltop Desk"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "fill",
              filter: isOpening
                ? "blur(12px) brightness(0.22) contrast(1.15)"
                : "blur(0px) brightness(0.95)",
              transition: "filter 0.45s cubic-bezier(0.2, 0.8, 0.3, 1)",
              pointerEvents: "none",
            }}
          />

          {/* Vignette Overlay focused on the selected drawer */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: selectedDrawer
                ? `radial-gradient(circle at ${selectedDrawer.focalX}% ${selectedDrawer.focalY}%, rgba(0,0,0,0.05) 15%, rgba(0,0,0,0.85) 60%, #000000 100%)`
                : "transparent",
              opacity: isOpening ? 1 : 0,
              transition: "opacity 0.45s ease",
              pointerEvents: "none",
            }}
          />

          {/* 7 Drawers Stack */}
          {DRAWERS.map((drawer) => {
            const isSelected = selectedDrawer?.id === drawer.id;
            const isOther = selectedDrawer && !isSelected;
            const isHovered = (hoveredDrawer === drawer.id || touchedDrawer === drawer.id) && !selectedDrawer;

            return (
              <div
                key={drawer.id}
                style={{
                  position: "absolute",
                  left: DRAWER_LEFT,
                  top: drawer.top,
                  width: DRAWER_WIDTH,
                  height: drawer.height,
                  opacity: isOther ? 0.15 : 1,
                  transition: "opacity 0.35s ease",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* 1. The Void Cavity (Behind the drawer face) */}
                <div
                  style={{
                    position: "absolute",
                    inset: "2% 3%",
                    borderRadius: "4px",
                    background: "radial-gradient(ellipse at center, #020617 0%, #000000 80%)",
                    boxShadow: "inset 0 0 25px #000000, inset 0 8px 16px rgba(0,0,0,0.95)",
                    overflow: "hidden",
                    zIndex: 1,
                  }}
                >
                  {/* Clean mystical portal mask inside the void */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `radial-gradient(circle at 50% 50%, rgba(56,189,248,${
                        isSelected && isOpening ? "0.85" : "0"
                      }) 0%, rgba(14,165,233,${
                        isSelected && isOpening ? "0.4" : "0"
                      }) 40%, rgba(0,0,0,0.95) 75%)`,
                      transition: "background 0.4s ease",
                    }}
                  />
                </div>

                {/* 2. Interactive Button & Drawer Front Face */}
                <button
                  type="button"
                  aria-label={`Open drawer`}
                  onClick={() => handleDrawerTap(drawer)}
                  onMouseEnter={() => setHoveredDrawer(drawer.id)}
                  onMouseLeave={() => setHoveredDrawer(null)}
                  onTouchStart={() => setTouchedDrawer(drawer.id)}
                  onTouchEnd={() => setTouchedDrawer(null)}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    padding: 0,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    outline: "none",
                    zIndex: 2,
                    transformStyle: "preserve-3d",
                    // 3D slide forward and downward animation revealing void
                    transform:
                      isSelected && isOpening
                        ? "translate3d(-6px, 42px, 190px) rotateX(16deg) scale(1.16)"
                        : touchedDrawer === drawer.id
                        ? "scale(0.98)"
                        : "translate3d(0, 0, 0)",
                    transition:
                      isSelected && isOpening
                        ? "transform 0.52s cubic-bezier(0.16, 1, 0.3, 1), filter 0.52s ease"
                        : "transform 0.25s ease, filter 0.25s ease",
                    filter:
                      isSelected && isOpening
                        ? "drop-shadow(0 25px 20px rgba(0,0,0,0.95)) drop-shadow(0 0 18px rgba(56,189,248,0.6))"
                        : "none",
                  }}
                >
                  {/* High-res cropped drawer face texture */}
                  <img
                    src={drawer.image}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "fill",
                      borderRadius: "2px",
                      display: "block",
                    }}
                  />

                  {/* A very little light emitted when hovered over the drawer */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "2px",
                      background:
                        "radial-gradient(ellipse at 50% 50%, rgba(255, 245, 210, 0.16) 0%, rgba(56, 189, 248, 0.08) 45%, transparent 75%)",
                      boxShadow: "inset 0 0 10px rgba(255, 240, 200, 0.14), 0 0 12px rgba(255, 235, 180, 0.18)",
                      opacity: isHovered ? 1 : 0,
                      transition: "opacity 0.3s ease",
                      pointerEvents: "none",
                    }}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seamless Void Threshold Overlay (Fade through darkness into target page) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 20,
          background: "radial-gradient(circle at center, rgba(56,189,248,0.25) 0%, rgba(3,7,18,0.95) 60%, #000000 100%)",
          opacity: isVoid ? 1 : 0,
          transition: "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
    </div>
  );
}
