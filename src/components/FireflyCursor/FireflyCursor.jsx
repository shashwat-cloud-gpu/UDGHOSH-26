import React, { useEffect, useRef, useState } from "react";
import "./FireflyCursor.css";

export default function FireflyCursor() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [sparkles, setSparkles] = useState([]);

  const coreRef = useRef(null);
  const auraRef = useRef(null);

  const mousePos = useRef({ x: -9999, y: -9999 });
  const auraPos = useRef({ x: -9999, y: -9999 });
  const lastSparklePos = useRef({ x: -9999, y: -9999 });
  const animFrameId = useRef(null);
  const hasMovedRef = useRef(false);

  useEffect(() => {
    // Only enable on fine pointer devices (desktop/mouse)
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    let sparkleCounter = 0;

    const addSparkle = (x, y, count = 1) => {
      if (x < 0 || y < 0) return;
      const newSparkles = [];
      for (let i = 0; i < count; i++) {
        const size = Math.random() * 3.5 + 2;
        const driftAngle = Math.random() * Math.PI * 2;
        const driftDistance = Math.random() * 20 + 6;
        const driftX = Math.cos(driftAngle) * driftDistance;
        const driftY = Math.sin(driftAngle) * driftDistance;

        newSparkles.push({
          id: `${Date.now()}-${sparkleCounter++}-${Math.random()}`,
          x: x + (Math.random() * 6 - 3),
          y: y + (Math.random() * 6 - 3),
          size,
          driftX: `${driftX}px`,
          driftY: `${driftY}px`,
        });
      }

      setSparkles((prev) => {
        const combined = [...prev, ...newSparkles];
        return combined.slice(-18);
      });
    };

    const handleMouseMove = (e) => {
      if (e.clientX <= 0 && e.clientY <= 0) return;

      mousePos.current = { x: e.clientX, y: e.clientY };

      if (!hasMovedRef.current) {
        hasMovedRef.current = true;
        auraPos.current = { x: e.clientX, y: e.clientY };
        if (coreRef.current) {
          coreRef.current.style.top = "0px";
          coreRef.current.style.left = "0px";
        }
        if (auraRef.current) {
          auraRef.current.style.top = "0px";
          auraRef.current.style.left = "0px";
        }
      }

      if (!visible) setVisible(true);

      // Direct positioning for instant responsive dot
      if (coreRef.current) {
        coreRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }

      // Check distance moved since last sparkle
      const dx = e.clientX - lastSparklePos.current.x;
      const dy = e.clientY - lastSparklePos.current.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 18) {
        addSparkle(e.clientX, e.clientY, 1);
        lastSparklePos.current = { x: e.clientX, y: e.clientY };
      }

      // Detect interactive elements (links, buttons, inputs, clickable items)
      const target = e.target;
      if (target) {
        const isInteractive = Boolean(
          target.closest('a, button, input, textarea, select, [role="button"], [data-cursor-hover], .clickable, .slick-arrow, .swiper-button-next, .swiper-button-prev')
        );
        setHovered(isInteractive);
      }
    };

    const handleMouseDown = (e) => {
      if (e.clientX <= 0 && e.clientY <= 0) return;
      setClicking(true);
      addSparkle(e.clientX, e.clientY, 3);
    };

    const handleMouseUp = () => {
      setClicking(false);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    const handleMouseEnter = (e) => {
      if (e.clientX > 0 && e.clientY > 0) {
        setVisible(true);
      }
    };

    // Smooth physics loop for organic floating aura
    const render = () => {
      if (hasMovedRef.current && mousePos.current.x > 0) {
        const ease = 0.18;
        auraPos.current.x += (mousePos.current.x - auraPos.current.x) * ease;
        auraPos.current.y += (mousePos.current.y - auraPos.current.y) * ease;

        if (auraRef.current) {
          auraRef.current.style.transform = `translate3d(${auraPos.current.x}px, ${auraPos.current.y}px, 0) translate(-50%, -50%)`;
        }
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    // Sparkle cleanup interval
    const sparkleInterval = setInterval(() => {
      setSparkles((prev) => {
        if (prev.length === 0) return prev;
        return prev.slice(1);
      });
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
  }, [visible]);

  return (
    <div className={`firefly-cursor-container ${visible ? "active" : ""}`}>
      {/* Lagging Trailing Bio-Aura */}
      <div
        ref={auraRef}
        className={`firefly-aura ${hovered ? "hovered" : ""}`}
      />

      {/* Sparkles / Glowing Ember Dust */}
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="firefly-sparkle"
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

      {/* Main Firefly Glowing Core Dot */}
      <div
        ref={coreRef}
        className={`firefly-core ${hovered ? "hovered" : ""} ${clicking ? "clicking" : ""}`}
      />
    </div>
  );
}
