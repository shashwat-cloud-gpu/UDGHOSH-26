import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import GateAtmosphere from "./GateAtmosphere";
import { GATES, TORCHES } from "./SectionGate";

const HALL_IMG =
  "https://res.cloudinary.com/u5qztegz/image/upload/w_3840,c_scale,q_auto:best,f_auto/v1790203290/udghosh-23/images/hall.jpg";

const GLYPHS = ["✦", "☾", "☉", "⚷", "✧"];

function trapezoid(t) {
  if (t < 0.25) return t / 0.25;
  if (t < 0.85) return 1;
  return 1 - (t - 0.85) / 0.15;
}

const PRIMARY_IDX = GATES.findIndex((g) => g.isPrimary);

export default function MobileHallGate({ dwellProgress = 0 }) {
  const navigate = useNavigate();
  const imgRef = useRef(null);
  const [imgWidth, setImgWidth] = useState(0);
  const [activeIdx, setActiveIdx] = useState(PRIMARY_IDX < 0 ? 0 : PRIMARY_IDX);
  const [entering, setEntering] = useState(null);

  const opacity = trapezoid(dwellProgress);

  // Measure the rendered image width (height: 100vh, width: auto).
  // This tells us where each gate falls in pixels.
  useEffect(() => {
    function measure() {
      if (imgRef.current) {
        setImgWidth(imgRef.current.getBoundingClientRect().width);
      }
    }
    const img = imgRef.current;
    if (img?.complete) measure();
    img?.addEventListener("load", measure);
    window.addEventListener("resize", measure);
    return () => {
      img?.removeEventListener("load", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Compute translateX so the active gate's centre aligns with the
  // viewport centre — same visual composition as desktop.
  function getTranslateX() {
    if (!imgWidth) return -(imgWidth / 2 - window.innerWidth / 2);
    const gate = GATES[activeIdx];
    const gateCenterPct =
      parseFloat(gate.left) + parseFloat(gate.width) / 2;
    const gateCenterPx = (gateCenterPct / 100) * imgWidth;
    const raw = window.innerWidth / 2 - gateCenterPx;
    // Clamp: never show blank space on either side
    const minX = window.innerWidth - imgWidth;
    return Math.max(minX, Math.min(0, raw));
  }

  const translateX = getTranslateX();
  const activeGate = GATES[activeIdx];

  const handleEnter = (gate) => {
    if (entering) return;
    setEntering(gate);
    setTimeout(() => {
      if (gate.external) {
        window.open(gate.url, "_blank", "noopener,noreferrer");
        setTimeout(() => setEntering(null), 400);
      } else {
        navigate(gate.url);
      }
    }, 550);
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        pointerEvents: opacity > 0.15 && !entering ? "auto" : "none",
        fontFamily: "'Cinzel', serif",
        overflow: "hidden",
      }}
    >
      {/* ── Hall image + overlays ── pans left/right via translateX  */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          transform: `translateX(${translateX}px)`,
          // Smooth slide to the selected gate
          transition: "transform 0.55s cubic-bezier(0.25, 1, 0.5, 1)",
          willChange: "transform",
        }}
      >
        <img
          ref={imgRef}
          src={HALL_IMG}
          alt="Udghosh Hall"
          draggable={false}
          style={{
            height: "100vh",
            width: "auto",
            display: "block",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />

        <GateAtmosphere opacity={0.7} />

        {/* Torch glows */}
        {TORCHES.map((t, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: t.left,
              top: t.top,
              width: "60px",
              height: "60px",
              transform: "translate(-50%,-50%)",
              borderRadius: "50%",
              background: "rgba(217,119,6,0.30)",
              filter: "blur(20px)",
              pointerEvents: "none",
              animation: "torchBreathing 4s infinite ease-in-out",
              animationDelay: `${i * 0.7}s`,
            }}
          />
        ))}

        {/* Invisible tap zones — tapping a gate highlights it
            (sets it as active) without instantly entering it,
            giving the user a chance to read the label first.
            Double-tap or pressing Enter below will navigate. */}
        {GATES.map((gate, idx) => (
          <button
            key={gate.id}
            aria-label={`Select ${gate.label}`}
            onClick={() => setActiveIdx(idx)}
            style={{
              position: "absolute",
              left: gate.left,
              top: gate.top,
              width: gate.width,
              height: gate.height,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              outline: "none",
            }}
          />
        ))}
      </div>

      {/* ── Bottom vignette ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.78) 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* ── Left / Right navigation arrows ── */}
      <button
        onClick={() => setActiveIdx((i) => Math.max(0, i - 1))}
        disabled={activeIdx === 0}
        aria-label="Previous gate"
        style={{
          position: "absolute",
          left: "4vw",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 4,
          background: "rgba(8,20,33,0.55)",
          border: "1px solid rgba(56,189,248,0.35)",
          backdropFilter: "blur(6px)",
          color: "#38BDF8",
          fontSize: "22px",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: activeIdx === 0 ? 0.2 : 0.9,
          cursor: activeIdx === 0 ? "default" : "pointer",
          transition: "opacity 0.3s",
          pointerEvents: entering ? "none" : "auto",
        }}
      >
        ‹
      </button>

      <button
        onClick={() => setActiveIdx((i) => Math.min(GATES.length - 1, i + 1))}
        disabled={activeIdx === GATES.length - 1}
        aria-label="Next gate"
        style={{
          position: "absolute",
          right: "4vw",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 4,
          background: "rgba(8,20,33,0.55)",
          border: "1px solid rgba(56,189,248,0.35)",
          backdropFilter: "blur(6px)",
          color: "#38BDF8",
          fontSize: "22px",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: activeIdx === GATES.length - 1 ? 0.2 : 0.9,
          cursor: activeIdx === GATES.length - 1 ? "default" : "pointer",
          transition: "opacity 0.3s",
          pointerEvents: entering ? "none" : "auto",
        }}
      >
        ›
      </button>

      {/* ── Gate indicator dots ── */}
      <div
        style={{
          position: "absolute",
          top: "14%",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "6px",
          zIndex: 4,
          pointerEvents: "none",
        }}
      >
        {GATES.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === activeIdx ? "18px" : "6px",
              height: "6px",
              borderRadius: "3px",
              background: i === activeIdx ? "#38BDF8" : "rgba(255,255,255,0.3)",
              transition: "all 0.35s ease",
            }}
          />
        ))}
      </div>

      {/* ── Active gate label ── */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "12%",
          transform: "translateX(-50%)",
          textAlign: "center",
          pointerEvents: "none",
          opacity: entering ? 0 : 1,
          transition: "opacity 0.3s ease",
          width: "88%",
          zIndex: 3,
        }}
      >
        <div
          style={{
            fontFamily: "'Cinzel', serif",
            fontWeight: 700,
            fontSize: "9px",
            letterSpacing: "0.28em",
            color: "#93C5FD",
            textTransform: "uppercase",
            textShadow: "0 1px 3px rgba(0,0,0,1)",
          }}
        >
          {activeGate.latin}
        </div>
        <div
          style={{
            fontFamily: "'Cinzel', serif",
            fontWeight: 700,
            fontSize: "clamp(1rem,4.5vw,1.3rem)",
            letterSpacing: "0.16em",
            color: "#F8FAFC",
            textTransform: "uppercase",
            textShadow: "0 2px 8px rgba(0,0,0,1)",
            marginTop: "4px",
            transition: "all 0.3s ease",
          }}
        >
          {activeGate.label}
        </div>
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "0.8rem",
            color: "#CBD5E1",
            marginTop: "4px",
            textShadow: "0 1px 4px rgba(0,0,0,1)",
          }}
        >
          {activeGate.sub}
        </div>
      </div>

      {/* ── Enter button ── */}
      <button
        onClick={() => handleEnter(activeGate)}
        style={{
          position: "absolute",
          left: "50%",
          bottom: "3.5%",
          transform: "translateX(-50%)",
          padding: "9px 28px",
          borderRadius: "999px",
          border: "1px solid rgba(56,189,248,0.5)",
          background: "rgba(8,20,33,0.72)",
          backdropFilter: "blur(6px)",
          color: "#38BDF8",
          fontFamily: "'Cinzel', serif",
          fontSize: "10px",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          opacity: entering ? 0 : 1,
          transition: "opacity 0.3s ease",
          zIndex: 4,
          cursor: "pointer",
        }}
      >
        Enter Gate {activeGate.roman}{" "}
        <span style={{ fontSize: "0.6em", color: "#93C5FD" }}>
          {GLYPHS[activeIdx % GLYPHS.length]}
        </span>
      </button>

      {/* ── Dark flash curtain on enter ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "#090807",
          zIndex: 9999,
          pointerEvents: "none",
          opacity: entering ? 1 : 0,
          transition: "opacity 0.55s ease",
        }}
      />

      <style>{`
        @keyframes torchBreathing {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
