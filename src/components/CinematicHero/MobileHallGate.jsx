import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import GateAtmosphere from "./GateAtmosphere";
import { GATES, TORCHES } from "./SectionGate";

// Same hall art used on desktop — reused here instead of a separate mobile
// asset so gate positions/percentages line up exactly with GATES below.
const HALL_IMG =
  "https://res.cloudinary.com/u5qztegz/image/upload/w_3840,c_scale,q_auto:best,f_auto/v1790203290/udghosh-23/images/hall.jpg";

function trapezoid(t) {
  if (t <= 0) return 0;
  if (t < 0.85) return 1;
  return 1 - (t - 0.85) / 0.15;
}

export default function MobileHallGate({ dwellProgress = 0 }) {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const imgRef = useRef(null);
  const rafRef = useRef(null);

  const baseOpacity = trapezoid(dwellProgress);

  const [imgWidth, setImgWidth] = useState(0);
  const [activeId, setActiveId] = useState(
    (GATES.find((g) => g.isPrimary) || GATES[0]).id
  );
  const [entering, setEntering] = useState(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isCentered, setIsCentered] = useState(false);

  // Measure the rendered width of the hall image. Height is pinned to the
  // real visible viewport height (see .hallStage, using dvh) and width is
  // "auto", so the image is naturally wider than the screen — that
  // overflow is what the user pans through.
  useEffect(() => {
    function measure() {
      if (imgRef.current) {
        setImgWidth(imgRef.current.getBoundingClientRect().width);
      }
    }
    if (imgRef.current?.complete) measure();
    const img = imgRef.current;
    img?.addEventListener("load", measure);
    window.addEventListener("resize", measure);
    return () => {
      img?.removeEventListener("load", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  // On first measure, center the view on the primary gate (Competitions)
  // so mobile users land on the most important gate first, same as how
  // it's the biggest/centered arch on desktop.
  const didCenter = useRef(false);
  useEffect(() => {
    if (!scrollRef.current || !imgWidth || didCenter.current) return;
    didCenter.current = true;
    const primary = GATES.find((g) => g.isPrimary) || GATES[0];
    const centerPct =
      (parseFloat(primary.left) + parseFloat(primary.width) / 2) / 100;
    const target =
      centerPct * imgWidth - scrollRef.current.clientWidth / 2;
    scrollRef.current.scrollLeft = Math.max(0, target);
    setIsCentered(true);
  }, [imgWidth]);

  // Keep opacity 0 until the initial centering finishes to avoid a leftmost flash
  const opacity = (baseOpacity > 0 && !isCentered) ? 0 : baseOpacity;

  const updateActiveGate = useCallback(() => {
    if (!scrollRef.current || !imgWidth) return;
    const el = scrollRef.current;
    const viewCenterPx = el.scrollLeft + el.clientWidth / 2;
    let closest = GATES[0];
    let closestDist = Infinity;
    GATES.forEach((g) => {
      const centerPx =
        ((parseFloat(g.left) + parseFloat(g.width) / 2) / 100) * imgWidth;
      const dist = Math.abs(centerPx - viewCenterPx);
      if (dist < closestDist) {
        closestDist = dist;
        closest = g;
      }
    });
    setActiveId(closest.id);
  }, [imgWidth]);

  const handleScroll = () => {
    if (!hasInteracted) setHasInteracted(true);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(updateActiveGate);
  };

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

  const activeGate = GATES.find((g) => g.id === activeId) || GATES[0];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        pointerEvents: opacity >= 1 && !entering ? "auto" : "none",
        fontFamily: "'Cinzel', serif",
        overflow: "hidden",
      }}
    >
      {/* Horizontal pan container — this IS the interaction: drag/swipe
          left-right through the same wide hall image used on desktop. */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          position: "absolute",
          inset: 0,
          overflowX: "auto",
          overflowY: "hidden",
          WebkitOverflowScrolling: "touch",
          scrollSnapType: "x proximity",
          display: "flex",
          scrollbarWidth: "none",
        }}
      >
        <div className="hallStage" style={{ position: "relative", flexShrink: 0 }}>
          <img
            ref={imgRef}
            src={HALL_IMG}
            alt="Udghosh Hall"
            draggable={false}
            style={{
              height: "100%",
              width: "auto",
              display: "block",
              userSelect: "none",
              pointerEvents: "none",
            }}
          />

          <GateAtmosphere opacity={0.7} />

          {/* Torch ambient glows, reused from the desktop layout */}
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

          {/* Gate tap zones — also act as scroll-snap points so a swipe
              settles on the nearest gate instead of stopping mid-arch. */}
          {GATES.map((gate) => (
            <button
              key={gate.id}
              aria-label={`Enter ${gate.label}`}
              onClick={() => handleEnter(gate)}
              style={{
                position: "absolute",
                left: gate.left,
                top: gate.top,
                width: gate.width,
                height: gate.height,
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
                scrollSnapAlign: "center",
                borderRadius: "6px",
                boxShadow:
                  activeId === gate.id
                    ? "0 0 0 2px rgba(56,189,248,0.55)"
                    : "none",
                transition: "box-shadow 0.35s ease",
              }}
            />
          ))}
        </div>
      </div>

      {/* Label card for whichever gate is currently centered */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "10%",
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
            marginTop: "3px",
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

      {/* Always targets whichever gate is centered — avoids needing a
          precise tap on a small archway on a phone screen. */}
      <button
        onClick={() => handleEnter(activeGate)}
        style={{
          position: "absolute",
          left: "50%",
          bottom: "3%",
          transform: "translateX(-50%)",
          padding: "9px 24px",
          borderRadius: "999px",
          border: "1px solid rgba(56,189,248,0.5)",
          background: "rgba(8,20,33,0.7)",
          backdropFilter: "blur(6px)",
          color: "#38BDF8",
          fontFamily: "'Cinzel', serif",
          fontSize: "10px",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          opacity: entering ? 0 : 1,
          transition: "opacity 0.3s ease",
          zIndex: 3,
        }}
      >
        Enter Gate {activeGate.roman}
      </button>

      {/* Swipe hint — fades out permanently after the first interaction */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "48%",
          right: "4%",
          transform: "translateY(-50%)",
          opacity: entering || hasInteracted ? 0 : 0.6,
          transition: "opacity 0.4s ease",
          color: "#93C5FD",
          fontSize: "22px",
          pointerEvents: "none",
          animation: "hallSwipeHint 1.8s ease-in-out infinite",
          zIndex: 3,
        }}
      >
        ›
      </div>

      {/* Bottom vignette to match the desktop gate scene */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.75) 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Flash transition curtain when entering a gate */}
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
        /* Mobile browsers (esp. iOS Safari) report 100vh as taller than
           the actually-visible area because it includes the space behind
           the address bar — using 100vh here made the hall image render
           larger than the screen, which looked "zoomed in" and cropped
           the top/bottom of the arches. dvh tracks the real visible
           viewport, so the full hall height fits on screen. The plain
           vh rule is kept first as a fallback for older browsers that
           don't support dvh; the dvh rule after it overrides when
           supported. */
        .hallStage {
          height: 100vh;
          height: 100dvh;
        }
        @keyframes hallSwipeHint {
          0%, 100% { transform: translateY(-50%) translateX(0); opacity: 0.5; }
          50% { transform: translateY(-50%) translateX(8px); opacity: 0.9; }
        }
        @keyframes torchBreathing {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
