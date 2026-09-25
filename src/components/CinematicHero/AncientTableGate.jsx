import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DRAWERS = [
  {
    id: "gallery",
    roman: "I",
    latin: "PORTA I · MEMORIAE",
    label: "GALLERY",
    sub: "Visual Chronicles",
    url: "/gallery",
    external: false,
    image: "https://res.cloudinary.com/u5qztegz/image/upload/w_3840,c_scale,q_auto:best,f_auto/v1790203311/udghosh-23/images/drawers/drawer_gallery.webp",
    left: "19.8%",
    top: "40.4%",
    width: "17.4%",
    height: "9.6%",
    tagWidth: "76%",
    tagTop: "14%",
    glowColor: "#38bdf8",
    focalX: 28.5,
    focalY: 45.2,
  },
  {
    id: "competitions",
    roman: "IV",
    latin: "PORTA IV · CERTAMINA",
    label: "COMPETITIONS",
    sub: "Arena of Champions",
    url: "https://events.udghosh.org.in/",
    external: true,
    image: "https://res.cloudinary.com/u5qztegz/image/upload/w_3840,c_scale,q_auto:best,f_auto/v1790203309/udghosh-23/images/drawers/drawer_competitions.webp",
    left: "38.5%",
    top: "40.4%",
    width: "19.3%",
    height: "9.6%",
    tagWidth: "82%",
    tagTop: "14%",
    isPrimary: true,
    glowColor: "#f59e0b",
    focalX: 48.1,
    focalY: 45.2,
  },
  {
    id: "pronights",
    roman: "II",
    latin: "PORTA II · DRAMATICA",
    label: "PRO NIGHTS",
    sub: "Concerts & Stars",
    url: "/past-events",
    external: false,
    image: "https://res.cloudinary.com/u5qztegz/image/upload/w_3840,c_scale,q_auto:best,f_auto/v1790203312/udghosh-23/images/drawers/drawer_pronights.webp",
    left: "59.1%",
    top: "40.4%",
    width: "25.3%",
    height: "9.6%",
    tagWidth: "70%",
    tagTop: "14%",
    glowColor: "#f43f5e",
    focalX: 71.7,
    focalY: 45.2,
  },
  {
    id: "social",
    roman: "III",
    latin: "PORTA III · SEGETES",
    label: "SOCIAL",
    sub: "Initiatives",
    url: "/social",
    external: false,
    image: "https://res.cloudinary.com/u5qztegz/image/upload/w_3840,c_scale,q_auto:best,f_auto/v1790203314/udghosh-23/images/drawers/drawer_social.webp",
    left: "19.8%",
    top: "50.7%",
    width: "12.5%",
    height: "11.9%",
    tagWidth: "82%",
    tagTop: "14%",
    glowColor: "#10b981",
    focalX: 26.0,
    focalY: 56.6,
  },
  {
    id: "esports",
    roman: "V",
    latin: "PORTA V · DIGITALIS",
    label: "ESPORTS",
    sub: "Gaming",
    url: "https://esports.udghosh.org.in/",
    external: true,
    image: "https://res.cloudinary.com/u5qztegz/image/upload/w_3840,c_scale,q_auto:best,f_auto/v1790203310/udghosh-23/images/drawers/drawer_esports.webp",
    left: "33.1%",
    top: "50.7%",
    width: "14.8%",
    height: "11.9%",
    tagWidth: "82%",
    tagTop: "14%",
    glowColor: "#a855f7",
    focalX: 40.5,
    focalY: 56.6,
  },
  {
    id: "antique",
    roman: "VI",
    latin: "PORTA VI · VETUSTAS",
    label: "ANTIQUE",
    sub: "Heritage",
    url: "/antique",
    external: false,
    image: "https://res.cloudinary.com/u5qztegz/image/upload/w_3840,c_scale,q_auto:best,f_auto/v1790203308/udghosh-23/images/drawers/drawer_antique.webp",
    left: "49.0%",
    top: "50.7%",
    width: "16.4%",
    height: "11.9%",
    tagWidth: "82%",
    tagTop: "14%",
    glowColor: "#eab308",
    focalX: 57.2,
    focalY: 56.6,
  },
  {
    id: "unosq",
    roman: "VII",
    latin: "PORTA VII · QUAESTIO",
    label: "UNOSQ",
    sub: "Trials",
    url: "https://unosq.udghosh.org.in/",
    external: true,
    image: "https://res.cloudinary.com/u5qztegz/image/upload/w_3840,c_scale,q_auto:best,f_auto/v1790203315/udghosh-23/images/drawers/drawer_unosq.webp",
    left: "66.4%",
    top: "50.7%",
    width: "18.0%",
    height: "11.9%",
    tagWidth: "80%",
    tagTop: "14%",
    glowColor: "#06b6d4",
    focalX: 75.4,
    focalY: 56.6,
  },
];

export default function AncientTableGate({ dwellProgress = 1 }) {
  const [activeDrawer, setActiveDrawer] = useState(null);
  const [animStage, setAnimStage] = useState("idle"); // "idle" | "opening" | "curving" | "entered"
  const [focal, setFocal] = useState({ x: 50, y: 50 });
  const navigate = useNavigate();

  const handleOpenDrawer = (drawer) => {
    if (activeDrawer) return;

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(40);
    }

    setFocal({ x: drawer.focalX, y: drawer.focalY });
    setActiveDrawer(drawer);
    setAnimStage("opening");

    // Phase 2: Camera curves over top and plunges inside the drawer
    setTimeout(() => {
      setAnimStage("curving");
    }, 380);

    // Phase 3: Envelop in void and navigate
    setTimeout(() => {
      setAnimStage("entered");
      if (drawer.external) {
        window.open(drawer.url, "_blank", "noopener,noreferrer");
        setTimeout(() => {
          setActiveDrawer(null);
          setAnimStage("idle");
        }, 500);
      } else {
        navigate(drawer.url);
      }
    }, 1150);
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-black text-white flex flex-col justify-between select-none"
      style={{
        perspective: "1200px",
        perspectiveOrigin: "50% 45%",
      }}
    >
      <style>{`
        @keyframes candleEmberFlicker {
          0%, 100% { opacity: 0.9; filter: drop-shadow(0 0 12px rgba(245, 158, 11, 0.5)); }
          50% { opacity: 1; filter: drop-shadow(0 0 24px rgba(245, 158, 11, 0.85)); }
        }
        @keyframes voidRunePulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.15); opacity: 1; filter: drop-shadow(0 0 12px currentColor); }
        }
      `}</style>

      {/* Top Realm Information HUD */}
      <div className="relative z-30 text-center pt-12 pb-2 pointer-events-none px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-amber-500/40 shadow-lg">
          <span
            className="w-2 h-2 rounded-full bg-amber-400"
            style={{ animation: "candleEmberFlicker 2.5s infinite ease-in-out" }}
          />
          <span className="text-[10px] tracking-[0.25em] font-['Cinzel'] font-bold text-amber-200 uppercase">
            THE ALCHEMIST'S BUREAU
          </span>
        </div>
        <h2
          className="text-lg sm:text-xl font-['Cinzel'] font-extrabold tracking-widest text-white mt-1.5"
          style={{ textShadow: "0 2px 15px rgba(0,0,0,0.9)" }}
        >
          SELECT A SECRET DRAWER
        </h2>
        <p className="text-[10px] text-slate-400 font-['Cinzel'] tracking-widest mt-0.5">
          {activeDrawer ? `OPENING ${activeDrawer.latin}...` : "TOUCH TO UNLOCK THE REALM WITHIN"}
        </p>
      </div>

      {/* 3D Scene Viewport (Camera Curves from Top into the Drawer) */}
      <div
        className="relative w-full flex-1 flex items-center justify-center overflow-hidden"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="relative w-full h-full max-w-[480px] max-h-[860px] flex items-center justify-center transition-transform"
          style={{
            transformStyle: "preserve-3d",
            transformOrigin: `${focal.x}% ${focal.y}%`,
            transform:
              animStage === "curving" || animStage === "entered"
                ? `rotateX(66deg) translateZ(480px) translateY(-140px) scale(3.8)`
                : "rotateX(6deg) translateZ(0)",
            transitionDuration: animStage === "curving" ? "0.75s" : "0.3s",
            transitionTimingFunction: "cubic-bezier(0.25, 0.9, 0.25, 1)",
          }}
        >
          {/* Photorealistic Dark Gothic Wooden Desk Background */}
          <div
            className="relative w-full h-full bg-contain bg-center bg-no-repeat pointer-events-none"
            style={{
              backgroundImage: "url(https://res.cloudinary.com/u5qztegz/image/upload/w_3840,c_scale,q_auto:best,f_auto/v1790203299/udghosh-23/images/ancient_table.webp)",
              filter: animStage === "curving" ? "brightness(0.9)" : "brightness(1)",
            }}
          >
            {/* The 7 Photorealistic Interactive Drawers */}
            {DRAWERS.map((drawer) => {
              const isSelected = activeDrawer?.id === drawer.id;
              const isOpening = isSelected && (animStage === "opening" || animStage === "curving" || animStage === "entered");

              return (
                <div
                  key={drawer.id}
                  onClick={() => handleOpenDrawer(drawer)}
                  className="absolute cursor-pointer pointer-events-auto"
                  style={{
                    left: drawer.left,
                    top: drawer.top,
                    width: drawer.width,
                    height: drawer.height,
                    transformStyle: "preserve-3d",
                  }}
                  aria-label={`Open drawer ${drawer.label}`}
                >
                  {/* Empty Hollow Cavity Behind Drawer (Revealed as drawer pulls out) */}
                  <div
                    className="absolute inset-0 rounded-sm bg-black overflow-hidden flex items-center justify-center"
                    style={{
                      boxShadow: "inset 0 3px 12px rgba(0,0,0,0.98)",
                      border: "1px solid rgba(0,0,0,0.9)",
                    }}
                  >
                    {/* Glowing Realm Light inside the Socket */}
                    <div
                      className="w-full h-full flex flex-col items-center justify-center p-1"
                      style={{
                        background: isOpening
                          ? `radial-gradient(ellipse at center, ${drawer.glowColor}99 0%, rgba(0,0,0,0.95) 75%)`
                          : "transparent",
                      }}
                    >
                      {isOpening && (
                        <span
                          className="text-xs font-bold font-['Cinzel'] tracking-widest uppercase"
                          style={{
                            color: "#ffffff",
                            textShadow: `0 0 10px ${drawer.glowColor}`,
                            animation: "voidRunePulse 1s infinite ease-in-out",
                          }}
                        >
                          ENTERING
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Physical 3D Wood Drawer Face Pulling Out */}
                  <div
                    className="absolute inset-0 bg-cover bg-center rounded-sm transition-all"
                    style={{
                      backgroundImage: `url(${drawer.image})`,
                      transform: isOpening
                        ? "translateZ(105px) translateY(32px)"
                        : "translateZ(0) translateY(0)",
                      boxShadow: isOpening
                        ? `0 24px 45px rgba(0,0,0,0.95), 0 0 25px ${drawer.glowColor}80`
                        : "none",
                      transitionDuration: isOpening ? "0.42s" : "0.25s",
                      transitionTimingFunction: "cubic-bezier(0.2, 0.9, 0.3, 1.2)",
                    }}
                  >
                    {/* Authentic Aged Parchment Label Tag Placed on Drawer Face */}
                    <div
                      className="absolute left-1/2 -translate-x-1/2 px-1 py-0.5 rounded-[2px] flex items-center justify-center text-center shadow-md transition-all"
                      style={{
                        top: drawer.tagTop,
                        width: drawer.tagWidth,
                        background: "linear-gradient(135deg, #f3e5c8 0%, #dfcca6 50%, #cbb184 100%)",
                        border: "1px solid #7c5830",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.7)",
                      }}
                    >
                      <span
                        className="font-['Cinzel'] font-extrabold uppercase truncate"
                        style={{
                          fontSize: "clamp(6.5px, 1.8vw, 8px)",
                          letterSpacing: "0.08em",
                          color: "#2a1505",
                          lineHeight: 1.1,
                          textShadow: "0 0.5px 0 rgba(255,255,255,0.5)",
                        }}
                      >
                        {drawer.label}
                      </span>
                    </div>

                    {/* Subtle Golden Glow on Hover/Active */}
                    <div
                      className="absolute inset-0 rounded-sm pointer-events-none transition-opacity duration-300"
                      style={{
                        border: isSelected ? `1.5px solid ${drawer.glowColor}` : "1px solid transparent",
                        boxShadow: isSelected ? `inset 0 0 12px ${drawer.glowColor}60` : "none",
                        opacity: isSelected ? 1 : 0,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Interactive Guidance Pill */}
      <div className="relative z-30 pb-6 text-center pointer-events-none">
        <span className="px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-['Cinzel'] tracking-widest text-slate-300 uppercase shadow-xl">
          TAP A DRAWER TO PULL &amp; DIVE IN
        </span>
      </div>

      {/* Cinematic Threshold Abyss Dissolve */}
      <div
        className="fixed inset-0 pointer-events-none z-50 bg-black transition-opacity duration-400"
        style={{
          opacity: animStage === "entered" ? 1 : 0,
        }}
      />
    </div>
  );
}
