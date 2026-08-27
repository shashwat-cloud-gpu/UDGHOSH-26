import React, { useEffect, useRef, useState } from "react";
import "./ThemeCursor.css";

export const CURSOR_TYPES = [
  { id: "patronus", name: "Patronus Flame", icon: "🔷", desc: "Cyan flame & wisp trail" },
  { id: "runeStar", name: "Sorcerer Star", icon: "✦", desc: "4-point star with arcane ring" },
  { id: "torchEmber", name: "Torch Ember", icon: "🔥", desc: "Amber cinders & rising sparks" },
  { id: "astrolabe", name: "Medieval Astrolabe", icon: "🧭", desc: "Ancient stone compass ring" },
  { id: "phantomBat", name: "Phantom Bats", icon: "🦇", desc: "Shadow orb with orbiting bat" },
  { id: "minimalGlow", name: "Minimal Cyan Dot", icon: "✨", desc: "Ultra-clean laser point" },
];

export default function ThemeCursor() {
  const [currentStyle, setCurrentStyle] = useState("patronus");
  const [modalOpen, setModalOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [sparkles, setSparkles] = useState([]);

  const coreRef = useRef(null);
  const ringRef = useRef(null);
  const batRef = useRef(null);

  const mousePos = useRef({ x: -9999, y: -9999 });
  const ringPos = useRef({ x: -9999, y: -9999 });
  const batPos = useRef({ x: -9999, y: -9999, angle: 0 });
  const lastSparklePos = useRef({ x: -9999, y: -9999 });
  const animFrameId = useRef(null);
  const hasMovedRef = useRef(false);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    let sparkleCounter = 0;

    const addSparkle = (x, y, count = 1, type = "patronus") => {
      if (x < 0 || y < 0) return;
      const newSparkles = [];
      for (let i = 0; i < count; i++) {
        const size = type === "torchEmber" ? Math.random() * 3 + 1.5 : Math.random() * 3.5 + 2;
        const driftAngle = Math.random() * Math.PI * 2;
        const driftDist = Math.random() * 18 + 6;
        const driftX = Math.cos(driftAngle) * driftDist;
        const driftY = Math.sin(driftAngle) * driftDist;

        newSparkles.push({
          id: `${Date.now()}-${sparkleCounter++}-${Math.random()}`,
          x: x + (Math.random() * 6 - 3),
          y: y + (Math.random() * 6 - 3),
          size,
          driftX: `${driftX}px`,
          driftY: `${driftY}px`,
          type,
        });
      }

      setSparkles((prev) => {
        const combined = [...prev, ...newSparkles];
        return combined.slice(-16);
      });
    };

    const handleMouseMove = (e) => {
      if (e.clientX <= 0 && e.clientY <= 0) return;
      mousePos.current = { x: e.clientX, y: e.clientY };

      if (!hasMovedRef.current) {
        hasMovedRef.current = true;
        ringPos.current = { x: e.clientX, y: e.clientY };
        batPos.current.x = e.clientX;
        batPos.current.y = e.clientY;
        if (coreRef.current) {
          coreRef.current.style.top = "0px";
          coreRef.current.style.left = "0px";
        }
        if (ringRef.current) {
          ringRef.current.style.top = "0px";
          ringRef.current.style.left = "0px";
        }
        if (batRef.current) {
          batRef.current.style.top = "0px";
          batRef.current.style.left = "0px";
        }
      }

      if (!visible) setVisible(true);

      const transformVal = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      if (coreRef.current) coreRef.current.style.transform = transformVal;

      const dx = e.clientX - lastSparklePos.current.x;
      const dy = e.clientY - lastSparklePos.current.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 18 && (currentStyle === "patronus" || currentStyle === "torchEmber")) {
        addSparkle(e.clientX, e.clientY, 1, currentStyle);
        lastSparklePos.current = { x: e.clientX, y: e.clientY };
      }

      const target = e.target;
      if (target) {
        const isInteractive = Boolean(
          target.closest('a, button, input, textarea, select, [role="button"], [data-cursor-hover], .clickable, .cursor-switcher-btn, .cursor-option-card')
        );
        setHovered(isInteractive);
      }
    };

    const handleMouseDown = (e) => {
      if (e.clientX <= 0 && e.clientY <= 0) return;
      setClicking(true);
      if (currentStyle === "patronus" || currentStyle === "torchEmber") {
        addSparkle(e.clientX, e.clientY, 4, currentStyle);
      }
    };

    const handleMouseUp = () => setClicking(false);
    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = (e) => {
      if (e.clientX > 0 && e.clientY > 0) setVisible(true);
    };

    const render = () => {
      if (hasMovedRef.current && mousePos.current.x > 0) {
        const ease = 0.16;
        ringPos.current.x += (mousePos.current.x - ringPos.current.x) * ease;
        ringPos.current.y += (mousePos.current.y - ringPos.current.y) * ease;

        if (ringRef.current) {
          ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
        }

        // Orbiting micro-bat animation for phantom style
        if (currentStyle === "phantomBat" && batRef.current) {
          batPos.current.angle += 0.06;
          const orbitRadius = hovered ? 22 : 15;
          const bx = mousePos.current.x + Math.cos(batPos.current.angle) * orbitRadius;
          const by = mousePos.current.y + Math.sin(batPos.current.angle) * (orbitRadius * 0.6);
          const flip = Math.cos(batPos.current.angle) > 0 ? 1 : -1;
          batRef.current.style.transform = `translate3d(${bx}px, ${by}px, 0) scale(${flip}, 1) translate(-50%, -50%)`;
        }
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    const sparkleInterval = setInterval(() => {
      setSparkles((prev) => (prev.length === 0 ? prev : prev.slice(1)));
    }, 120);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      clearInterval(sparkleInterval);
    };
  }, [visible, currentStyle, hovered]);

  return (
    <>
      {/* ── Active Cursor Canvas / Layer ── */}
      <div className={`theme-cursor-layer ${visible ? "active" : ""}`}>
        {/* Style 1: Patronus Flame */}
        {currentStyle === "patronus" && (
          <>
            <div ref={ringRef} className="cursor-patronus-aura" />
            {sparkles.map((s) => (
              <div
                key={s.id}
                className="cursor-patronus-sparkle"
                style={{
                  left: `${s.x}px`,
                  top: `${s.y}px`,
                  width: `${s.size}px`,
                  height: `${s.size}px`,
                  "--drift-x": s.driftX,
                  "--drift-y": s.driftY,
                }}
              />
            ))}
            <div
              ref={coreRef}
              className={`cursor-patronus-core ${hovered ? "hovered" : ""} ${clicking ? "clicking" : ""}`}
            />
          </>
        )}

        {/* Style 2: Sorcerer Rune Star */}
        {currentStyle === "runeStar" && (
          <>
            <div ref={ringRef} className={`cursor-star-ring ${hovered ? "hovered" : ""}`} />
            <div ref={coreRef} className="cursor-star-core">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2L12 0Z" />
              </svg>
            </div>
          </>
        )}

        {/* Style 3: Torch Ember */}
        {currentStyle === "torchEmber" && (
          <>
            {sparkles.map((s) => (
              <div
                key={s.id}
                className="cursor-ember-spark"
                style={{
                  left: `${s.x}px`,
                  top: `${s.y}px`,
                  width: `${s.size}px`,
                  height: `${s.size}px`,
                  "--drift-x": s.driftX,
                  "--drift-y": s.driftY,
                }}
              />
            ))}
            <div ref={coreRef} className="cursor-ember-core" />
          </>
        )}

        {/* Style 4: Ancient Astrolabe */}
        {currentStyle === "astrolabe" && (
          <>
            <div ref={ringRef} className={`cursor-astrolabe-ring ${hovered ? "hovered" : ""}`} />
            <div ref={coreRef} className="cursor-astrolabe-dot" />
          </>
        )}

        {/* Style 5: Phantom Shadow & Bats */}
        {currentStyle === "phantomBat" && (
          <>
            <div ref={coreRef} className="cursor-phantom-wisp" />
            <div ref={batRef} className="cursor-micro-bat">
              <svg width="14" height="10" viewBox="0 0 24 16" fill="rgba(30, 41, 59, 0.95)">
                <path d="M12 8 C14 2, 20 0, 24 4 C20 8, 16 10, 14 12 C13 10, 11 10, 10 12 C8 10, 4 8, 0 4 C4 0, 10 2, 12 8 Z" />
              </svg>
            </div>
          </>
        )}

        {/* Style 6: Minimal Cyan Dot */}
        {currentStyle === "minimalGlow" && (
          <>
            <div ref={ringRef} className={`cursor-minimal-ring ${hovered ? "hovered" : ""}`} />
            <div ref={coreRef} className="cursor-minimal-dot" />
          </>
        )}
      </div>

      {/* ── Interactive Cursor Switcher & Visual Previews Dock ── */}
      <button
        className="cursor-switcher-btn"
        onClick={() => setModalOpen(!modalOpen)}
        title="Preview all cursor themes"
      >
        <span style={{ fontSize: "14px" }}>✨</span>
        <span>Cursor Style</span>
      </button>

      {modalOpen && (
        <div className="cursor-preview-modal">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "8px" }}>
            <div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: "14px", fontWeight: 700, color: "#38BDF8" }}>
                SELECT CURSOR THEME
              </div>
              <div style={{ fontSize: "10px", color: "#94A3B8" }}>
                Click any style to test it live instantly
              </div>
            </div>
            <button
              onClick={() => setModalOpen(false)}
              style={{ background: "transparent", border: "none", color: "#94A3B8", fontSize: "16px", cursor: "pointer" }}
            >
              ✕
            </button>
          </div>

          <div className="cursor-preview-grid">
            {CURSOR_TYPES.map((c) => {
              const isActive = currentStyle === c.id;
              return (
                <div
                  key={c.id}
                  className={`cursor-option-card ${isActive ? "active" : ""}`}
                  onClick={() => setCurrentStyle(c.id)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Visual Preview Box */}
                  <div className="cursor-demo-viewport">
                    {c.id === "patronus" && (
                      <div style={{
                        width: "8px", height: "8px", borderRadius: "50%",
                        background: "#BAE6FD",
                        boxShadow: "0 0 10px 4px #38BDF8, 0 0 18px #0284C7",
                        animation: "patronusPulse 1.8s infinite alternate"
                      }} />
                    )}

                    {c.id === "runeStar" && (
                      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "1px dashed rgba(56,189,248,0.7)", position: "absolute", animation: "runeRingSpin 8s linear infinite" }} />
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="#FFF" style={{ filter: "drop-shadow(0 0 6px #38BDF8)" }}>
                          <path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2L12 0Z" />
                        </svg>
                      </div>
                    )}

                    {c.id === "torchEmber" && (
                      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{
                          width: "8px", height: "8px", borderRadius: "50%",
                          background: "#FEF3C7",
                          boxShadow: "0 0 10px 3px #F59E0B, 0 0 18px #DC2626",
                          animation: "emberFlicker 1.5s infinite alternate"
                        }} />
                      </div>
                    )}

                    {c.id === "astrolabe" && (
                      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ width: "22px", height: "22px", borderRadius: "50%", border: "1px solid #94A3B8", position: "absolute" }} />
                        <div style={{ width: "4px", height: "4px", background: "#FFF", borderRadius: "50%", boxShadow: "0 0 4px #FFF" }} />
                      </div>
                    )}

                    {c.id === "phantomBat" && (
                      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#475569", boxShadow: "0 0 8px #94A3B8" }} />
                        <svg width="14" height="10" viewBox="0 0 24 16" fill="#334155" style={{ position: "absolute", right: "-6px", top: "-6px" }}>
                          <path d="M12 8 C14 2, 20 0, 24 4 C20 8, 16 10, 14 12 C13 10, 11 10, 10 12 C8 10, 4 8, 0 4 C4 0, 10 2, 12 8 Z" />
                        </svg>
                      </div>
                    )}

                    {c.id === "minimalGlow" && (
                      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: "1px solid rgba(56,189,248,0.5)", position: "absolute" }} />
                        <div style={{ width: "5px", height: "5px", background: "#38BDF8", borderRadius: "50%", boxShadow: "0 0 8px #38BDF8" }} />
                      </div>
                    )}
                  </div>

                  <div style={{ fontSize: "11px", fontWeight: 600, color: isActive ? "#38BDF8" : "#E2E8F0" }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: "9px", color: "#64748B", marginTop: "2px" }}>
                    {c.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
