import React, { useEffect, useRef } from "react";

export default function CastleAtmosphere({ opacity = 1 }) {
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

    // ── Castle Bats State ──
    const maxBats = 5;
    const bats = [];

    function createBat(initialSpread = false) {
      const fromLeft = Math.random() > 0.5;
      const depth = Math.random() * 0.6 + 0.4;
      const speed = (Math.random() * 1.8 + 1.2) * (fromLeft ? 1 : -1) * depth;
      
      const startX = initialSpread 
        ? Math.random() * width 
        : (fromLeft ? -50 : width + 50);
      const startY = Math.random() * (height * 0.52) + 30;

      return {
        x: startX,
        y: startY,
        vx: speed,
        vy: (Math.random() - 0.5) * 0.6 * depth,
        baseY: startY,
        depth,
        size: (Math.random() * 6 + 10) * depth,
        wingAngle: 0,
        wingSpeed: Math.random() * 0.08 + 0.16,
        isGliding: false,
        glideTimer: Math.random() * 100 + 50,
        swayPhase: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.25 + 0.7,
      };
    }

    for (let i = 0; i < maxBats; i++) {
      bats.push(createBat(true));
    }

    // ── Lightning State ──
    let lightningState = {
      active: false,
      flashIntensity: 0,
      bolt: null,
      branches: [],
      originX: width * 0.5,
      originY: 0,
    };

    let nextLightningTime = Date.now() + (Math.random() * 6000 + 4000);

    function generateLightningBolt(startX, startY) {
      const mainBolt = [{ x: startX, y: startY }];
      const branches = [];

      let currX = startX;
      let currY = startY;
      const targetY = height * (Math.random() * 0.35 + 0.35);

      while (currY < targetY) {
        const stepY = Math.random() * 20 + 12;
        const stepX = (Math.random() - 0.5) * 32 + (width * 0.5 - currX) * 0.04;
        currX += stepX;
        currY += stepY;
        mainBolt.push({ x: currX, y: currY });

        if (Math.random() < 0.28 && branches.length < 3) {
          const branch = [{ x: currX, y: currY }];
          let bX = currX;
          let bY = currY;
          const branchSteps = Math.floor(Math.random() * 4 + 3);
          const dir = Math.random() > 0.5 ? 1 : -1;

          for (let b = 0; b < branchSteps; b++) {
            bX += (Math.random() * 18 + 8) * dir;
            bY += Math.random() * 16 + 8;
            branch.push({ x: bX, y: bY });
          }
          branches.push(branch);
        }
      }

      return { mainBolt, branches };
    }

    function triggerLightning() {
      const originX = Math.random() * (width * 0.6) + width * 0.2;
      const originY = Math.random() * 30;
      const { mainBolt, branches } = generateLightningBolt(originX, originY);

      lightningState.originX = originX;
      lightningState.originY = originY;
      lightningState.bolt = mainBolt;
      lightningState.branches = branches;
      lightningState.active = true;

      lightningState.flashIntensity = 0.45;
      
      setTimeout(() => {
        lightningState.flashIntensity = 0.15;
      }, 50);

      setTimeout(() => {
        lightningState.flashIntensity = 0.85;
      }, 100);

      setTimeout(() => {
        lightningState.flashIntensity = 0.35;
        lightningState.bolt = null;
        lightningState.branches = [];
      }, 220);

      setTimeout(() => {
        lightningState.flashIntensity = 0;
        lightningState.active = false;
      }, 420);

      nextLightningTime = Date.now() + (Math.random() * 9000 + 7000);
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

      // 1. Draw Lightning Atmosphere & Sky Glow
      if (fi > 0) {
        const skyGlow = ctx.createRadialGradient(
          lightningState.originX,
          lightningState.originY,
          10,
          lightningState.originX,
          lightningState.originY,
          width * 0.85
        );
        skyGlow.addColorStop(0, `rgba(240, 248, 255, ${fi * 0.38})`);
        skyGlow.addColorStop(0.3, `rgba(186, 215, 255, ${fi * 0.22})`);
        skyGlow.addColorStop(0.7, `rgba(147, 197, 253, ${fi * 0.08})`);
        skyGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = skyGlow;
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = `rgba(220, 235, 255, ${fi * 0.14})`;
        ctx.fillRect(0, 0, width, height * 0.7);

        if (lightningState.bolt && lightningState.bolt.length > 1) {
          ctx.save();

          ctx.strokeStyle = `rgba(147, 197, 253, ${fi * 0.9})`;
          ctx.lineWidth = 4;
          ctx.shadowColor = "rgba(186, 230, 253, 0.9)";
          ctx.shadowBlur = 14;
          ctx.beginPath();
          lightningState.bolt.forEach((pt, idx) => {
            if (idx === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          });
          ctx.stroke();

          ctx.strokeStyle = `rgba(255, 255, 255, ${fi})`;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          lightningState.bolt.forEach((pt, idx) => {
            if (idx === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          });
          ctx.stroke();

          lightningState.branches.forEach((br) => {
            if (br.length > 1) {
              ctx.strokeStyle = `rgba(186, 220, 255, ${fi * 0.75})`;
              ctx.lineWidth = 1.2;
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

      // 2. Draw Rain Drops across Castle
      ctx.save();
      rainDrops.forEach((drop) => {
        drop.x += drop.wind;
        drop.y += drop.speed;

        if (drop.y > height + 20) {
          drop.y = -25;
          drop.x = Math.random() * (width + 200) - 100;
        }

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

      // 3. Update and Draw Bats
      bats.forEach((bat, index) => {
        bat.x += bat.vx;
        bat.swayPhase += 0.04;
        bat.y = bat.baseY + Math.sin(bat.swayPhase) * (18 * bat.depth);

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
          ? `rgba(28, 32, 45, ${bat.opacity})` 
          : `rgba(10, 12, 18, ${bat.opacity})`;

        ctx.beginPath();
        ctx.ellipse(0, 0, s * 0.18, s * 0.38, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(s * 0.08, -s * 0.32, s * 0.14, 0, Math.PI * 2);
        ctx.moveTo(-s * 0.05, -s * 0.38);
        ctx.lineTo(-s * 0.12, -s * 0.58);
        ctx.lineTo(0, -s * 0.44);
        ctx.moveTo(s * 0.15, -s * 0.38);
        ctx.lineTo(s * 0.25, -s * 0.58);
        ctx.lineTo(s * 0.18, -s * 0.44);
        ctx.fill();

        const tipY = -s * 0.35 + flap * (s * 0.65);
        const midY = -s * 0.10 + flap * (s * 0.35);

        ctx.beginPath();
        ctx.moveTo(-s * 0.1, -s * 0.1);
        ctx.quadraticCurveTo(-s * 0.6, midY - s * 0.2, -s * 1.35, tipY);
        ctx.quadraticCurveTo(-s * 0.95, tipY + s * 0.45, -s * 0.65, midY + s * 0.3);
        ctx.quadraticCurveTo(-s * 0.4, midY + s * 0.35, -s * 0.05, s * 0.2);
        ctx.closePath();
        ctx.fill();

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
