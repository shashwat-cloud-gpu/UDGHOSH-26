import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import GateAtmosphere from "./GateAtmosphere";
import MobileDeskGate from "./MobileDeskGate";

const GATES = [
  {
    id: "gallery", roman: "I",
    latin: "PORTA \u00b7 I \u00b7 MEMORIAE",
    label: "THE GALLERY",
    sub: "Carved frames of past editions & visual chronicles",
    url: "/gallery", external: false,
    left: "3%", top: "20.5%", width: "11.7%", height: "62%",
  },
  {
    id: "pronights", roman: "II",
    latin: "PORTA \u00b7 II \u00b7 DRAMATICA",
    label: "PRO NIGHTS",
    sub: "Theatrical stone masks, stage concerts & star nights",
    url: "/past-events", external: false,
    left: "15.8%", top: "29.2%", width: "12%", height: "58.3%",
  },
  {
    id: "social", roman: "III",
    latin: "PORTA \u00b7 III \u00b7 SEGETES",
    label: "SOCIAL INITIATIVES",
    sub: "Cradled sapling & creeping vines of human welfare",
    url: "/social", external: false,
    left: "28.3%", top: "31.3%", width: "12.2%", height: "54.2%",
  },
  {
    id: "competitions", roman: "IV",
    latin: "PORTA \u00b7 IV \u00b7 CERTAMINA MAIORA",
    label: "COMPETITIONS",
    sub: "The throne of victor's wreaths, armored battles & sports olympiad",
    url: "https://events.udghosh.org.in/", external: true,
    left: "38%", top: "13%", width: "24%", height: "69%",
    isPrimary: true,
  },
  {
    id: "esports", roman: "V",
    latin: "PORTA \u00b7 V \u00b7 DIGITALIS",
    label: "ESPORTS COLOSSEUM",
    sub: "Ancient stone gears & runes of competitive gaming",
    url: "https://esports.udghosh.org.in/", external: true,
    left: "60%", top: "31.3%", width: "12.2%", height: "54.2%",
  },
  {
    id: "antique", roman: "VI",
    latin: "PORTA \u00b7 VI \u00b7 VETUSTAS",
    label: "ANTIQUE & LEGACY",
    sub: "Eroded sundials, 25-year annals & heritage relics",
    url: "/antique", external: false,
    left: "73.3%", top: "29.2%", width: "12%", height: "58.3%",
  },
  {
    id: "unosq", roman: "VII",
    latin: "PORTA \u00b7 VII \u00b7 QUAESTIO",
    label: "UNOSQ QUEST",
    sub: "The open tome, quill & owl of cryptic trials",
    url: "https://unosq.udghosh.org.in/", external: true,
    left: "85.8%", top: "20.5%", width: "11.7%", height: "62%",
  },
];

const TORCHES = [
  { left: "1.9%", top: "49.8%" },
  { left: "27.4%", top: "57.0%" },
  { left: "40.1%", top: "57.8%" },
  { left: "59.4%", top: "57.8%" },
  { left: "71.1%", top: "56.5%" },
  { left: "97.2%", top: "49.2%" },
];

const ORBIT_TEXT = "\u2726  UDGHOSH  '23  \u2726  ARCANA ASCENSION  \u2726  IIT  KANPUR  \u2726  ";

function trapezoid(t) {
  if (t < 0.25) return t / 0.25;
  if (t < 0.85) return 1;
  return 1 - (t - 0.85) / 0.15;
}

function DesktopCastleGate({ dwellProgress = 0 }) {
  const [hovered, setHovered] = useState(null);
  const [enteringGate, setEnteringGate] = useState(null);
  const [zoomActive, setZoomActive] = useState(false);
  const opacity = trapezoid(dwellProgress);
  const navigate = useNavigate();

  const orbitCanvasRef = useRef(null);
  const fireCanvasRef = useRef(null);
  const orbitRafRef = useRef(null);
  const fireRafRef = useRef(null);

  // Orbit text ring with High-DPI pixel density
  useEffect(() => {
    const canvas = orbitCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.max(window.devicePixelRatio || 1, 2);
    const cssW = 460;
    const cssH = 160;
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;

    const W = cssW, H = cssH;
    const cx = W / 2, cy = H / 2;
    const radiusX = 195, radiusY = 34;
    const chars = ORBIT_TEXT.split("");
    const total = chars.length;
    let angle = 0;

    function render() {
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      angle += 0.0024;
      chars.forEach((ch, i) => {
        const a = angle + (i / total) * Math.PI * 2;
        const sinA = Math.sin(a), cosA = Math.cos(a);
        const x = cx + sinA * radiusX;
        const y = cy + cosA * radiusY;
        const depth = (cosA + 1) / 2;
        const scale = 0.9 + depth * 0.35;
        const alpha = 0.35 + depth * 0.65;
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.globalAlpha = alpha;
        ctx.font = "700 15px 'Cinzel', serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        if (cosA > 0.1) {
          ctx.fillStyle = "#FFFFFF";
          ctx.shadowColor = "rgba(56,189,248,1)";
          ctx.shadowBlur = 12;
        } else {
          ctx.fillStyle = "#BAE6FD";
          ctx.shadowColor = "rgba(56,189,248,0.5)";
          ctx.shadowBlur = 6;
        }
        ctx.fillText(ch, 0, 0);
        ctx.restore();
      });
      ctx.restore();
      orbitRafRef.current = requestAnimationFrame(render);
    }
    render();
    return () => cancelAnimationFrame(orbitRafRef.current);
  }, []);

  // Patronus fire particles with High-DPI scaling
  useEffect(() => {
    const canvas = fireCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.max(window.devicePixelRatio || 1, 2);
    const cssW = 220, cssH = 240;
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;

    const W = cssW, H = cssH;

    function mkEmber() {
      return {
        x: W / 2 + (Math.random() - 0.5) * 50,
        y: H - 25,
        vx: (Math.random() - 0.5) * 0.7,
        vy: -Math.random() * 0.85 - 0.4,
        size: Math.random() * 3.5 + 1.2,
        life: 1.0,
        decay: Math.random() * 0.010 + 0.005,
        wobble: Math.random() * Math.PI * 2,
        color: Math.random() > 0.4 ? "#38BDF8" : (Math.random() > 0.5 ? "#7DD3FC" : "#E0F2FE"),
      };
    }
    const embers = [];
    for (let i = 0; i < 35; i++) embers.push(mkEmber());

    function render() {
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      embers.forEach((p, idx) => {
        p.wobble += 0.04;
        p.x += p.vx + Math.sin(p.wobble) * 0.25;
        p.y += p.vy;
        p.life -= p.decay;
        p.size *= 0.992;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life * 0.85);
        ctx.shadowColor = "#38BDF8";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.size), 0, Math.PI * 2);
        ctx.fill();
        if (p.life <= 0 || p.y < 0) embers[idx] = mkEmber();
      });
      ctx.restore();
      fireRafRef.current = requestAnimationFrame(render);
    }
    render();
    return () => cancelAnimationFrame(fireRafRef.current);
  }, []);

  // eslint-disable-next-line no-unused-vars
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    // Only track if not entering a gate
    if (enteringGate) return;
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = ((clientX - left) / width) * 100;
    const y = ((clientY - top) / height) * 100;
    setCursorPos({ x, y });
  };

  const handleClick = (gate) => {
    if (enteringGate) return;

    // Calculate focal center for camera zoom into the archway
    const parsePct = (str) => parseFloat(str) || 0;
    const originX = parsePct(gate.left) + parsePct(gate.width) / 2;
    const originY = parsePct(gate.top) + parsePct(gate.height) * 0.52;

    setEnteringGate({ ...gate, originX, originY });

    requestAnimationFrame(() => {
      setZoomActive(true);
    });

    setTimeout(() => {
      if (gate.external) {
        window.open(gate.url, "_blank", "noopener,noreferrer");
        setTimeout(() => {
          setZoomActive(false);
          setEnteringGate(null);
        }, 500);
      } else {
        navigate(gate.url);
      }
    }, 720);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        position: "absolute", inset: 0,
        opacity,
        pointerEvents: opacity > 0.15 && !enteringGate ? "auto" : "none",
        fontFamily: "'Cinzel', serif",
        overflow: "hidden",
      }}>

      {/* Dark portal transition curtain when zooming into gate archway */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "#090807",
          zIndex: 9999,
          pointerEvents: "none",
          opacity: zoomActive ? 1 : 0,
          transition: zoomActive ? "opacity 0.72s cubic-bezier(0.65, 0, 0.35, 1)" : "none",
        }}
      />

      <div style={{
        position: "absolute", inset: 0,
        transformOrigin: enteringGate ? `${enteringGate.originX}% ${enteringGate.originY}%` : "50% 50%",
        transform: zoomActive ? "scale(5.2)" : "scale(1)",
        filter: zoomActive ? "blur(0.5px)" : "none",
        transition: zoomActive ? "transform 0.8s cubic-bezier(0.22, 1, 0.36, 1), filter 0.8s ease" : "none",
        willChange: "transform",
      }}>

        {/* Backdrop for seamless sync when zooming */}
        {enteringGate && (
          <img
            src="https://res.cloudinary.com/u5qztegz/image/upload/q_auto,f_auto/v1790203290/udghosh-23/images/hall.jpg"
            alt=""
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover", zIndex: 0,
            }}
          />
        )}

        {/* Atmospheric rain, horror bats & lightning */}
        <GateAtmosphere opacity={1} />

        {/* Torch ambient glows */}
        {TORCHES.map((t, i) => (
          <div key={i} style={{
            position: "absolute",
            left: t.left, top: t.top,
            width: "80px", height: "80px",
            transform: "translate(-50%,-50%)",
            borderRadius: "50%",
            background: "rgba(217,119,6,0.30)",
            filter: "blur(28px)",
            pointerEvents: "none",
            animation: "torchBreathing 4s infinite ease-in-out",
            animationDelay: `${i * 0.7}s`,
          }} />
        ))}

        {/* 7 Gate hotspots */}
        {GATES.map((gate) => {
          const isHov = hovered === gate.id;
          const isTarget = enteringGate?.id === gate.id;
          return (
            <button
              key={gate.id}
              aria-label={`Enter ${gate.label}`}
              onClick={() => handleClick(gate)}
              onMouseEnter={() => setHovered(gate.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                position: "absolute",
                left: gate.left, top: gate.top,
                width: gate.width, height: gate.height,
                zIndex: 2,
                background: "transparent",
                border: "none",
                cursor: "pointer", outline: "none",
                display: "flex", flexDirection: "column",
                alignItems: "center",
                padding: 0,
                overflow: "visible",
                opacity: enteringGate ? (isTarget ? 1 : 0) : 1,
                transition: "opacity 0.25s ease",
              }}
            >
              {/* Stone-engraved text labels */}
              <div style={{
                width: "100%",
                textAlign: "center",
                padding: gate.isPrimary ? "20% 24px 0" : "22% 4px 0",
                transition: "all 0.4s ease",
                pointerEvents: "none",
                opacity: enteringGate ? 0 : 1,
              }}>
                {/* Latin motto */}
                <div style={{
                  fontFamily: "'Cinzel', serif",
                  fontWeight: 700,
                  fontSize: gate.isPrimary ? "11.5px" : "10px",
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: isHov ? "#38BDF8" : "#93C5FD",
                  textShadow: isHov
                    ? "0 0 10px rgba(56,189,248,0.9)"
                    : "0 1px 3px rgba(0,0,0,1), 0 0 8px rgba(0,0,0,0.8)",
                  transition: "all 0.4s ease",
                  whiteSpace: "nowrap",
                }}>
                  {gate.latin}
                </div>

                {/* Gate title */}
                <div style={{
                  fontFamily: "'Cinzel', serif",
                  fontWeight: 700,
                  fontSize: gate.isPrimary
                    ? "clamp(0.85rem,1.5vw,1.25rem)"
                    : "clamp(0.7rem,1.15vw,0.95rem)",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  marginTop: "4px",
                  color: isHov ? "#FFFFFF" : (gate.isPrimary ? "#F8FAFC" : "#E2E8F0"),
                  textShadow: isHov
                    ? "0 0 16px rgba(186,230,253,0.8), 0 2px 6px rgba(0,0,0,1)"
                    : "0 2px 6px rgba(0,0,0,1), 0 0 12px rgba(0,0,0,0.9)",
                  transition: "all 0.4s ease",
                }}>
                  {gate.label}
                </div>

                {/* Italic description */}
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  fontWeight: 600,
                  fontSize: gate.isPrimary
                    ? "clamp(0.68rem,1.05vw,0.88rem)"
                    : "clamp(0.58rem,0.9vw,0.76rem)",
                  letterSpacing: "0.06em",
                  marginTop: "4px",
                  lineHeight: 1.35,
                  color: isHov ? "#BAE6FD" : "#CBD5E1",
                  textShadow: "0 1px 4px rgba(0,0,0,1)",
                  transition: "all 0.4s ease",
                }}>
                  {gate.sub}
                </div>
              </div>

              {/* Natural door-center spotlight glow */}
              <div style={{
                position: "absolute",
                left: "50%", top: "55%",
                transform: "translate(-50%, -50%)",
                width: isTarget && zoomActive ? "160%" : (gate.isPrimary ? "70%" : "80%"),
                aspectRatio: "1",
                borderRadius: "50%",
                background: (isHov || isTarget)
                  ? (gate.isPrimary
                    ? "radial-gradient(circle, rgba(56,189,248,0.30) 0%, rgba(56,189,248,0.08) 45%, transparent 70%)"
                    : "radial-gradient(circle, rgba(56,189,248,0.25) 0%, rgba(56,189,248,0.06) 45%, transparent 70%)")
                  : "transparent",
                filter: (isHov || isTarget) ? "blur(8px)" : "none",
                transition: "all 0.5s ease",
                pointerEvents: "none",
                zIndex: 0,
              }} />
            </button>
          );
        })}

        {/* Center: Logo + orbit ring + fire */}
        <div style={{
          position: "absolute",
          left: "49.8%", top: "68.2%",
          transform: "translate(-50%, -50%)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          pointerEvents: "auto", zIndex: 3,
          opacity: enteringGate ? 0 : 1,
          transition: "opacity 0.25s ease",
        }}>
          <canvas ref={orbitCanvasRef} width={440} height={160}
            style={{ position: "absolute", top: "4px", pointerEvents: "none", zIndex: 4 }}
          />
          <canvas ref={fireCanvasRef} width={220} height={240}
            style={{ position: "absolute", top: "-64px", pointerEvents: "none", zIndex: 3 }}
          />
          <div
            style={{
              position: "relative",
              width: "clamp(80px,7vw,112px)",
              height: "clamp(112px,9.8vw,160px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 2,
              filter: "drop-shadow(0 0 15px rgba(56,189,248,0.7))",
              animation: "patronusFlameGlow 7s infinite ease-in-out",
            }}>
            <img src="https://res.cloudinary.com/u5qztegz/image/upload/q_auto,f_auto/v1790203296/udghosh-23/images/logo.png" alt="Udghosh"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
          <div style={{
            marginTop: "8px", padding: "2px 14px",
            borderRadius: "4px",
            background: "rgba(0,0,0,0.6)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(4px)",
            zIndex: 2, position: "relative",
          }}>
            <span style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "10px",
              letterSpacing: "0.3em",
              color: "#CBD5E1",
              textTransform: "uppercase",
            }}>IGNIS PATRONUS</span>
          </div>
        </div>

        {/* Bottom vignette */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.75) 100%)",
          pointerEvents: "none", zIndex: 1,
          opacity: enteringGate ? 0 : 1,
          transition: "opacity 0.25s ease",
        }} />
      </div>

      {/* Cinematic Portal Threshold Fade-Through Darkness Overlay */}
      <div style={{
        position: "absolute", inset: 0,
        pointerEvents: "none", zIndex: 10,
        background: "radial-gradient(circle at center, rgba(56,189,248,0.2) 0%, rgba(0,0,0,0.92) 75%, #000000 100%)",
        opacity: zoomActive ? 1 : 0,
        transition: "opacity 0.75s cubic-bezier(0.4, 0, 0.2, 1)",
      }} />

      <style>
        {`
          @keyframes windBurst {
            0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
            100% { transform: translate(-50%, -50%) scale(150); opacity: 0; }
          }
        `}
      </style>

      {/* Wind Shockwave Effect on Enter */}
      {enteringGate && (
        <div style={{
          position: "absolute",
          left: `${enteringGate.originX}%`,
          top: `${enteringGate.originY}%`,
          width: "50px", height: "50px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)",
          animation: "windBurst 0.75s ease-out forwards",
          pointerEvents: "none", zIndex: 11
        }} />
      )}

    </div>
  );
}

export default function SectionGate(props) {
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

  if (isMobile) {
    return <MobileDeskGate {...props} />;
  }
  return <DesktopCastleGate {...props} />;
}
