import { useRef } from "react";
import CountUp from "react-countup";

const STATS = [
  { value: 100,  suffix: "K+", label: "FOOTFALLS" },
  { value: 450,  suffix: "+",  label: "COLLEGES" },
  { value: 10,   suffix: "M+", label: "EYEBALLS" },
  { value: 2500, suffix: "+",  label: "PARTICIPANTS" },
  { value: 3,    suffix: "",   label: "DAYS" },
  { value: 75,   suffix: "+",  label: "EVENTS" },
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
  // Only start CountUp once the section is meaningfully visible
  const counterOn = dwellProgress > 0.1;

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      opacity,
      pointerEvents: opacity > 0.1 ? "auto" : "none",
    }}>
      {/* Dark overlay so text stays legible over the static gate image */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom,rgba(0,0,0,.25) 0%,rgba(0,0,0,.50) 100%)",
      }} />

      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: "860px", width: "100%",
        padding: "0 2rem", textAlign: "center", color: "#fff",
      }}>
        <p style={{
          letterSpacing: ".4em", textTransform: "uppercase",
          fontSize: ".7rem", color: "rgba(255,255,255,.5)",
          marginBottom: ".75rem", fontFamily: "Poppins,sans-serif",
        }}>IIT Kanpur presents</p>

        <h2 style={{
          fontFamily: "Cinzel,serif",
          fontSize: "clamp(1.8rem,5vw,3.5rem)",
          fontWeight: 700, letterSpacing: ".1em", marginBottom: "1rem",
          textShadow: "0 2px 20px rgba(0,0,0,.8)",
        }}>ABOUT US</h2>

        <div style={{
          width: "50px", height: "2px",
          background: "rgba(255,255,255,.4)",
          margin: "0 auto 1.25rem", borderRadius: "2px",
        }} />

        <p style={{
          fontFamily: "Poppins,sans-serif",
          fontSize: "clamp(.85rem,1.8vw,1.05rem)", lineHeight: 1.8,
          color: "rgba(255,255,255,.85)",
          maxWidth: "640px", margin: "0 auto 2rem",
        }}>
          IIT KANPUR presents the 22nd edition of UDGHOSH this year. Udghosh,
          being the greatest college sports festival of India, organises
          enthralling competitions with 400+ colleges participating along with
          comedy night, EDM night, Bollywood night, and exhibitions.
        </p>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3,1fr)",
          gap: "1rem .75rem", maxWidth: "660px", margin: "0 auto",
        }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,.06)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,.12)",
              borderRadius: "10px", padding: "1rem .5rem",
            }}>
              <div style={{
                fontFamily: "Cinzel,serif",
                fontSize: "clamp(1.3rem,3.5vw,2rem)",
                fontWeight: 700, color: "#fff",
                lineHeight: 1, marginBottom: ".3rem",
              }}>
                {counterOn
                  ? <CountUp start={0} end={s.value} duration={2.5} />
                  : "0"}
                {s.suffix}
              </div>
              <div style={{
                fontFamily: "Poppins,sans-serif", fontSize: ".65rem",
                letterSpacing: ".2em", color: "rgba(255,255,255,.5)",
                textTransform: "uppercase",
              }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
