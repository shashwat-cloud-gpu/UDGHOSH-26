import { useRef } from "react";
import CountUp from "react-countup";

const STATS = [
  { value: 100,  suffix: "K+", label: "Footfalls" },
  { value: 450,  suffix: "+",  label: "Colleges" },
  { value: 10,   suffix: "M+", label: "Eyeballs" },
  { value: 2500, suffix: "+",  label: "Participants" },
  { value: 3,    suffix: "",   label: "Days" },
  { value: 75,   suffix: "+",  label: "Events" },
];

// dwellProgress: 0-1, driven by CinematicPanel scroll position
// Trapezoid opacity:
//   0.00–0.35 → fade IN  (gives a smooth reveal as you start the dwell)
//   0.35–0.80 → hold at 1 (the section is fully visible here)
//   0.80–1.00 → fade OUT (dissolves back before dwell ends / next panel starts)
function trapezoid(t) {
  if (t < 0.35) return t / 0.35;
  if (t < 0.80) return 1;
  return 1 - (t - 0.80) / 0.20;
}

export default function SectionAbout({ dwellProgress = 0 }) {
  const opacity = trapezoid(dwellProgress);
  const counterOn = dwellProgress > 0.1;

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      opacity,
      pointerEvents: opacity > 0.1 ? "auto" : "none",
    }}>
      {/* Dark overlay for legibility */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom,rgba(0,0,0,.30) 0%,rgba(0,0,0,.60) 100%)",
      }} />

      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: "860px", width: "100%",
        padding: "0 2rem", textAlign: "center",
      }}>

        {/* Eyebrow */}
        <p style={{
          fontFamily: "'Marcellus', 'Cinzel', serif",
          letterSpacing: ".35em",
          textTransform: "uppercase",
          fontSize: ".72rem",
          color: "#fbbf24",
          marginBottom: ".85rem",
          textShadow: "0 1px 3px rgba(0,0,0,.9)",
        }}>IIT Kanpur Presents</p>

        {/* Title */}
        <h2 style={{
          fontFamily: "'Cinzel', serif",
          fontWeight: 800,
          fontSize: "clamp(1.9rem,5vw,3.6rem)",
          letterSpacing: ".1em",
          marginBottom: ".75rem",
          background: "linear-gradient(180deg, #ffffff 0%, #f1f5f9 45%, #cbd5e1 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0 4px 14px rgba(0,0,0,.95))",
        }}>About Us</h2>

        {/* Gold groove divider */}
        <div style={{
          height: "1px",
          width: "220px",
          margin: "0 auto 1.35rem",
          background: "linear-gradient(90deg, transparent 0%, rgba(245,158,11,.4) 20%, rgba(245,158,11,.75) 50%, rgba(245,158,11,.4) 80%, transparent 100%)",
          boxShadow: "0 1px 2px rgba(0,0,0,.8)",
        }} />

        {/* Body text */}
        <p style={{
          fontFamily: "'Cormorant Garamond', 'Marcellus', serif",
          fontSize: "clamp(1rem,2vw,1.15rem)",
          fontWeight: 500,
          lineHeight: 1.85,
          letterSpacing: ".02em",
          color: "#f1f5f9",
          textShadow: "0 1px 4px rgba(0,0,0,.95)",
          maxWidth: "640px",
          margin: "0 auto 2rem",
        }}>
          IIT Kanpur presents the 22nd edition of Udghosh — the greatest college
          sports festival of India, uniting 400+ colleges in enthralling
          competitions, comedy nights, EDM nights, Bollywood nights,
          and breathtaking exhibitions.
        </p>

        {/* Stats grid — stone-tablet cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "1rem .75rem",
          maxWidth: "660px",
          margin: "0 auto",
        }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              background: "linear-gradient(135deg, rgba(20,24,34,.55) 0%, rgba(10,12,18,.80) 100%)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,.12)",
              borderTop: "1px solid rgba(255,255,255,.22)",
              borderBottom: "2px solid rgba(0,0,0,.85)",
              borderRadius: "12px",
              padding: "1rem .5rem",
              boxShadow: "0 12px 32px -8px rgba(0,0,0,.9), inset 0 1px 1px rgba(255,255,255,.18), inset 0 -2px 5px rgba(0,0,0,.8)",
            }}>
              <div style={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 800,
                fontSize: "clamp(1.3rem,3.5vw,2rem)",
                lineHeight: 1,
                marginBottom: ".35rem",
                background: "linear-gradient(180deg, #ffffff 0%, #fde68a 45%, #f59e0b 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 2px 5px rgba(0,0,0,.95))",
              }}>
                {counterOn
                  ? <CountUp start={0} end={s.value} duration={2.5} />
                  : "0"}
                {s.suffix}
              </div>
              <div style={{
                fontFamily: "'Marcellus', serif",
                fontSize: ".68rem",
                letterSpacing: ".18em",
                color: "#fbbf24",
                textTransform: "uppercase",
                textShadow: "0 1px 3px rgba(0,0,0,.9)",
              }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
