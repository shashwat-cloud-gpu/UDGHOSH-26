import React, { useEffect, useRef } from "react";

export default function GateAtmosphere({ opacity = 1 }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let dpr = Math.max(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    const handleResize = () => {
      if (!canvas) return;
      dpr = Math.max(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    // ── Rain Drops Engine ──
    const rainCount = 130;
    const rainDrops = [];

    function createRainDrop() {
      const depth = Math.random() * 0.75 + 0.25; // 0.25 (distant) to 1.0 (foreground)
      return {
        x: Math.random() * (width + 200) - 100,
        y: Math.random() * height - 20,
        length: (Math.random() * 18 + 12) * depth,
        speed: (Math.random() * 9 + 14) * depth,
        wind: (Math.random() * 1.5 + 1.2) * depth,
        thickness: (Math.random() * 0.8 + 0.6) * depth,
        alpha: (Math.random() * 0.25 + 0.2) * depth,
        depth,
      };
    }

    for (let i = 0; i < rainCount; i++) {
      rainDrops.push(createRainDrop());
    }

    // ── Gothic Hall Bats Engine ──
    const maxBats = 6;
    const bats = [];

    function createBat(initialSpread = false) {
      const fromLeft = Math.random() > 0.5;
      const depth = Math.random() * 0.6 + 0.4;
      const speed = (Math.random() * 2.2 + 1.4) * (fromLeft ? 1 : -1) * depth;

      const startX = initialSpread
        ? Math.random() * width
        : (fromLeft ? -60 : width + 60);
      const startY = Math.random() * (height * 0.58) + 20;

      return {
        x: startX,
        y: startY,
        vx: speed,
        vy: (Math.random() - 0.5) * 0.8 * depth,
        baseY: startY,
        depth,
        size: (Math.random() * 7 + 11) * depth,
        wingAngle: 0,
        wingSpeed: Math.random() * 0.10 + 0.18,
        isGliding: false,
        glideTimer: Math.random() * 80 + 40,
        swayPhase: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.25 + 0.72,
      };
    }

    for (let i = 0; i < maxBats; i++) {
      bats.push(createBat(true));
    }

    // ── Atmospheric Lightning Engine ──
    let lightningState = {
      active: false,
      flashIntensity: 0,
      bolt: null,
      branches: [],
      originX: width * 0.5,
      originY: 0,
    };

    let nextLightningTime = Date.now() + (Math.random() * 5000 + 3500);

    function generateLightningBolt(startX, startY) {
      const mainBolt = [{ x: startX, y: startY }];
      const branches = [];

      let currX = startX;
      let currY = startY;
      const targetY = height * (Math.random() * 0.45 + 0.3);

      while (currY < targetY) {
        const stepY = Math.random() * 22 + 12;
        const stepX = (Math.random() - 0.5) * 36 + (width * 0.5 - currX) * 0.05;
        currX += stepX;
        currY += stepY;
        mainBolt.push({ x: currX, y: currY });

        if (Math.random() < 0.3 && branches.length < 3) {
          const branch = [{ x: currX, y: currY }];
          let bX = currX;
          let bY = currY;
          const branchSteps = Math.floor(Math.random() * 4 + 3);
          const dir = Math.random() > 0.5 ? 1 : -1;

          for (let b = 0; b < branchSteps; b++) {
            bX += (Math.random() * 20 + 8) * dir;
            bY += Math.random() * 16 + 8;
            branch.push({ x: bX, y: bY });
          }
          branches.push(branch);
        }
      }

      return { mainBolt, branches };
    }

    function triggerLightning() {
      const originX = Math.random() * (width * 0.65) + width * 0.18;
      const originY = Math.random() * 25;
      const { mainBolt, branches } = generateLightningBolt(originX, originY);

      lightningState.originX = originX;
      lightningState.originY = originY;
      lightningState.bolt = mainBolt;
      lightningState.branches = branches;
      lightningState.active = true;

      // Realistic horror lightning flicker sequence
      lightningState.flashIntensity = 0.5;

      setTimeout(() => {
        lightningState.flashIntensity = 0.18;
      }, 50);

      setTimeout(() => {
        lightningState.flashIntensity = 0.9; // Main flash
      }, 100);

      setTimeout(() => {
        lightningState.flashIntensity = 0.4;
        lightningState.bolt = null;
        lightningState.branches = [];
      }, 230);

      setTimeout(() => {
        lightningState.flashIntensity = 0;
        lightningState.active = false;
      }, 450);

      nextLightningTime = Date.now() + (Math.random() * 8000 + 6000);
    }

    // ── Render Loop ──
    function render() {
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const now = Date.now();

      if (now > nextLightningTime && !lightningState.active) {
        triggerLightning();
      }

      const fi = lightningState.flashIntensity;

      // 1. Draw Lightning Atmosphere & Hall Illumination
      if (fi > 0) {
        // Sky & Cathedral arch illumination
        const skyGlow = ctx.createRadialGradient(
          lightningState.originX,
          lightningState.originY,
          10,
          lightningState.originX,
          lightningState.originY,
          width * 0.9
        );
        skyGlow.addColorStop(0, `rgba(230, 242, 255, ${fi * 0.42})`);
        skyGlow.addColorStop(0.35, `rgba(175, 210, 255, ${fi * 0.25})`);
        skyGlow.addColorStop(0.7, `rgba(130, 185, 250, ${fi * 0.10})`);
        skyGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = skyGlow;
        ctx.fillRect(0, 0, width, height);

        // Ambient flash over stone gates
        ctx.fillStyle = `rgba(205, 228, 255, ${fi * 0.16})`;
        ctx.fillRect(0, 0, width, height);

        // Draw lightning bolt
        if (lightningState.bolt && lightningState.bolt.length > 1) {
          ctx.save();

          // Outer blue glow
          ctx.strokeStyle = `rgba(147, 197, 253, ${fi * 0.95})`;
          ctx.lineWidth = 4.5;
          ctx.shadowColor = "rgba(186, 230, 253, 0.95)";
          ctx.shadowBlur = 16;
          ctx.beginPath();
          lightningState.bolt.forEach((pt, idx) => {
            if (idx === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          });
          ctx.stroke();

          // Core bright white bolt
          ctx.strokeStyle = `rgba(255, 255, 255, ${fi})`;
          ctx.lineWidth = 1.9;
          ctx.beginPath();
          lightningState.bolt.forEach((pt, idx) => {
            if (idx === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          });
          ctx.stroke();

          // Branches
          lightningState.branches.forEach((br) => {
            if (br.length > 1) {
              ctx.strokeStyle = `rgba(186, 220, 255, ${fi * 0.8})`;
              ctx.lineWidth = 1.3;
              ctx.beginPath();
              br.forEach((pt, idx) => {
                if (idx === 0) ctx.moveTo(pt.x, pt.y);
                else ctx.lineTo(pt.x, pt.y);
              });
              ctx.stroke();
            }
          });

          ctx.restore();
        }
      }

      // 2. Draw Rain Drops
      ctx.save();
      rainDrops.forEach((drop) => {
        drop.x += drop.wind;
        drop.y += drop.speed;

        if (drop.y > height + 20) {
          drop.y = -25;
          drop.x = Math.random() * (width + 200) - 100;
        }

        // When lightning strikes, rain streaks illuminate brilliantly!
        const rainAlpha = fi > 0.1 
          ? Math.min(1, drop.alpha * 2.6 + fi * 0.5) 
          : drop.alpha;
        
        ctx.strokeStyle = fi > 0.1 
          ? `rgba(220, 240, 255, ${rainAlpha})` 
          : `rgba(160, 195, 230, ${rainAlpha})`;

        ctx.lineWidth = drop.thickness;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + drop.wind * 2.2, drop.y + drop.length);
        ctx.stroke();
      });
      ctx.restore();

      // 3. Draw Bats
      bats.forEach((bat, index) => {
        bat.x += bat.vx;
        bat.swayPhase += 0.045;
        bat.y = bat.baseY + Math.sin(bat.swayPhase) * (22 * bat.depth);

        bat.glideTimer -= 1;
        if (bat.glideTimer <= 0) {
          bat.isGliding = !bat.isGliding;
          bat.glideTimer = bat.isGliding
            ? Math.random() * 45 + 30
            : Math.random() * 90 + 60;
        }

        if (!bat.isGliding) {
          bat.wingAngle += bat.wingSpeed;
        }

        const isOffLeft = bat.vx < 0 && bat.x < -70;
        const isOffRight = bat.vx > 0 && bat.x > width + 70;
        if (isOffLeft || isOffRight) {
          bats[index] = createBat(false);
          return;
        }

        ctx.save();
        ctx.translate(bat.x, bat.y);

        const facing = bat.vx > 0 ? 1 : -1;
        ctx.scale(facing, 1);

        const flap = bat.isGliding ? 0.2 : Math.sin(bat.wingAngle);
        const s = bat.size;

        const isIlluminated = fi > 0.2;
        ctx.fillStyle = isIlluminated
          ? `rgba(32, 36, 52, ${bat.opacity})`
          : `rgba(8, 10, 15, ${bat.opacity})`;

        // Bat Body
        ctx.beginPath();
        ctx.ellipse(0, 0, s * 0.18, s * 0.38, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head + Ears
        ctx.beginPath();
        ctx.arc(s * 0.08, -s * 0.32, s * 0.14, 0, Math.PI * 2);
        ctx.moveTo(-s * 0.05, -s * 0.38);
        ctx.lineTo(-s * 0.12, -s * 0.58);
        ctx.lineTo(0, -s * 0.44);
        ctx.moveTo(s * 0.15, -s * 0.38);
        ctx.lineTo(s * 0.25, -s * 0.58);
        ctx.lineTo(s * 0.18, -s * 0.44);
        ctx.fill();

        // Left Wing
        const tipY = -s * 0.35 + flap * (s * 0.65);
        const midY = -s * 0.10 + flap * (s * 0.35);

        ctx.beginPath();
        ctx.moveTo(-s * 0.1, -s * 0.1);
        ctx.quadraticCurveTo(-s * 0.6, midY - s * 0.2, -s * 1.35, tipY);
        ctx.quadraticCurveTo(-s * 0.95, tipY + s * 0.45, -s * 0.65, midY + s * 0.3);
        ctx.quadraticCurveTo(-s * 0.4, midY + s * 0.35, -s * 0.05, s * 0.2);
        ctx.closePath();
        ctx.fill();

        // Right Wing
        ctx.beginPath();
        ctx.moveTo(s * 0.1, -s * 0.1);
        ctx.quadraticCurveTo(s * 0.6, midY - s * 0.2, s * 1.35, tipY);
        ctx.quadraticCurveTo(s * 0.95, tipY + s * 0.45, s * 0.65, midY + s * 0.3);
        ctx.quadraticCurveTo(s * 0.4, midY + s * 0.35, s * 0.05, s * 0.2);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      });

      ctx.restore();
      animRef.current = requestAnimationFrame(render);
    }

    animRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 2,
        opacity,
        transition: "opacity 0.4s ease",
      }}
    />
  );
}
