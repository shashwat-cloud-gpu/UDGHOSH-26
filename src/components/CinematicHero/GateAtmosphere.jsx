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

    // ── Wind Gust Engine ──
    // Layered sine drift so wind strength ebbs and flows over time instead
    // of blowing at a constant rate — real storms gust in waves.
    let gustPhase = Math.random() * Math.PI * 2;
    function currentGust() {
      return (
        0.6 +
        0.25 * Math.sin(gustPhase) +
        0.15 * Math.sin(gustPhase * 2.7 + 1.3)
      );
    }

    // ── Fog / Mist Engine ──
    // Low drifting haze across the hall floor for depth.
    const fogBlobCount = 6;
    const fogBlobs = [];
    function createFogBlob() {
      return {
        x: Math.random() * width,
        y: height * (0.6 + Math.random() * 0.35),
        radiusX: width * (0.26 + Math.random() * 0.2),
        radiusY: height * (0.08 + Math.random() * 0.06),
        speed: (Math.random() * 0.1 + 0.04) * (Math.random() > 0.5 ? 1 : -1),
        opacity: Math.random() * 0.07 + 0.04,
      };
    }
    for (let i = 0; i < fogBlobCount; i++) fogBlobs.push(createFogBlob());

    // ── Rain Engine ──
    const rainCount = 130;
    const rainDrops = [];
    function createRainDrop() {
      const depth = Math.random() * 0.75 + 0.25; // 0.25 (distant) to 1.0 (foreground)
      return {
        x: Math.random() * (width + 200) - 100,
        y: Math.random() * height - 20,
        length: (Math.random() * 18 + 12) * depth,
        speed: (Math.random() * 9 + 14) * depth,
        windBase: (Math.random() * 1.5 + 1.2) * depth,
        thickness: (Math.random() * 0.8 + 0.6) * depth,
        alpha: (Math.random() * 0.25 + 0.2) * depth,
        depth,
      };
    }
    for (let i = 0; i < rainCount; i++) rainDrops.push(createRainDrop());

    // Small ripple splashes where foreground drops hit the "ground".
    const splashes = [];
    function spawnSplash(x, y, depth) {
      splashes.push({
        x,
        y,
        radius: 1,
        maxRadius: (Math.random() * 4 + 3) * depth,
        opacity: 0.45 * depth,
        life: 0,
        maxLife: 14 + Math.random() * 6,
      });
    }

    // ── Gothic Hall Bats Engine ──
    const maxBats = 6;
    const bats = [];
    const flock = { y: height * 0.34, targetY: height * 0.34, driftTimer: 0 };

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
        bank: 0,
        tone: Math.random(), // slight per-bat colour variation
      };
    }

    for (let i = 0; i < maxBats; i++) {
      bats.push(createBat(true));
    }

    // ── Ember Engine ──
    // Warm drifting embers rising off unseen torches — replaces cool motes
    // with something that fits an indoor gothic hall lit by firelight.
    const emberCount = 34;
    const embers = [];
    function createEmber() {
      return {
        x: Math.random() * width,
        y: height + Math.random() * 60,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(Math.random() * 0.5 + 0.2),
        size: Math.random() * 1.8 + 0.7,
        baseAlpha: Math.random() * 0.5 + 0.15,
        flickerPhase: Math.random() * Math.PI * 2,
        flickerSpeed: Math.random() * 0.03 + 0.015,
        swayPhase: Math.random() * Math.PI * 2,
      };
    }
    for (let i = 0; i < emberCount; i++) {
      const e = createEmber();
      e.y = Math.random() * height; // spread through the frame on mount
      embers.push(e);
    }

    // ── Torchlight Breathing Glow ──
    // Slow, independent pulses of warm light from a couple of fixed points
    // (unseen wall torches), unrelated to the lightning — real firelight
    // never sits perfectly still.
    const torches = [
      { x: width * 0.12, y: height * 0.55, phase: Math.random() * Math.PI * 2, speed: 0.004 + Math.random() * 0.002 },
      { x: width * 0.88, y: height * 0.5, phase: Math.random() * Math.PI * 2, speed: 0.0035 + Math.random() * 0.002 },
    ];

    // ── Lightning Engine ──
    // Each strike gets a procedurally generated flicker profile (a
    // keyframed intensity curve sampled by elapsed time) and a random
    // "type", instead of the same fixed setTimeout flash sequence firing
    // identically every time. Distant rumbles and diffuse sheet flashes
    // are weighted to happen far more often than dramatic close bolts.
    let lightningState = {
      active: false,
      startTime: 0,
      profile: null,
      bolt: null,
      branches: [],
      boltVisibleUntil: 0,
      originX: width * 0.5,
      originY: 0,
      hue: "cool",
    };
    let nextLightningTime = Date.now() + (Math.random() * 5000 + 3500);

    const HUES = {
      cool: { glow: "147, 197, 253", core: "255, 255, 255", branch: "186, 220, 255" },
      violet: { glow: "196, 189, 255", core: "245, 240, 255", branch: "206, 196, 255" },
      warm: { glow: "205, 228, 255", core: "255, 253, 245", branch: "222, 218, 250" },
    };
    const HUE_KEYS = Object.keys(HUES);

    function buildProfile(type) {
      const r = () => Math.random();
      if (type === "single") {
        return [
          { t: 0, i: 0.5 + r() * 0.15 },
          { t: 35 + r() * 15, i: 0.12 },
          { t: 80 + r() * 25, i: 0.9 + r() * 0.1 },
          { t: 170 + r() * 30, i: 0.3 },
          { t: 260 + r() * 120, i: 0 },
        ];
      }
      if (type === "double") {
        return [
          { t: 0, i: 0.45 },
          { t: 35, i: 0.1 },
          { t: 85, i: 0.92 },
          { t: 150, i: 0.24 },
          { t: 195, i: 0.68 + r() * 0.2 },
          { t: 250, i: 0.14 },
          { t: 340 + r() * 100, i: 0 },
        ];
      }
      if (type === "triple") {
        return [
          { t: 0, i: 0.4 },
          { t: 30, i: 0.08 },
          { t: 70, i: 0.82 },
          { t: 120, i: 0.2 },
          { t: 160, i: 0.62 },
          { t: 205, i: 0.15 },
          { t: 250, i: 0.52 },
          { t: 300, i: 0.08 },
          { t: 420 + r() * 120, i: 0 },
        ];
      }
      if (type === "sheet") {
        return [
          { t: 0, i: 0 },
          { t: 140 + r() * 60, i: 0.32 + r() * 0.15 },
          { t: 380 + r() * 100, i: 0.13 },
          { t: 650 + r() * 200, i: 0 },
        ];
      }
      return [
        { t: 0, i: 0 },
        { t: 220 + r() * 80, i: 0.15 + r() * 0.08 },
        { t: 550 + r() * 150, i: 0.06 },
        { t: 950 + r() * 300, i: 0 },
      ];
    }

    function sampleProfile(profile, elapsed) {
      if (elapsed <= profile[0].t) return profile[0].i;
      for (let k = 0; k < profile.length - 1; k++) {
        const a = profile[k];
        const b = profile[k + 1];
        if (elapsed >= a.t && elapsed <= b.t) {
          const span = b.t - a.t || 1;
          const p = (elapsed - a.t) / span;
          return a.i + (b.i - a.i) * p;
        }
      }
      return 0;
    }

    function generateLightningBolt(startX, startY, intensity) {
      const mainBolt = [{ x: startX, y: startY }];
      const branches = [];
      let currX = startX;
      let currY = startY;
      const targetY = height * (Math.random() * 0.45 + 0.3);
      const jag = 22 + intensity * 22;

      while (currY < targetY) {
        const stepY = Math.random() * 22 + 12;
        const stepX = (Math.random() - 0.5) * jag + (width * 0.5 - currX) * 0.05;
        currX += stepX;
        currY += stepY;
        mainBolt.push({ x: currX, y: currY });

        if (Math.random() < 0.24 + intensity * 0.1 && branches.length < 4) {
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
      const roll = Math.random();
      const type =
        roll < 0.32 ? "distant" :
        roll < 0.55 ? "sheet" :
        roll < 0.78 ? "single" :
        roll < 0.94 ? "double" : "triple";

      const hasBolt = type === "single" || type === "double" || type === "triple";
      const intensity = type === "triple" ? 1 : type === "double" ? 0.7 : 0.45;

      const originX = Math.random() * (width * 0.65) + width * 0.18;
      const originY = Math.random() * 25;

      lightningState.originX = originX;
      lightningState.originY = originY;
      lightningState.hue = HUE_KEYS[Math.floor(Math.random() * HUE_KEYS.length)];
      lightningState.profile = buildProfile(type);
      lightningState.startTime = performance.now();
      lightningState.active = true;

      if (hasBolt) {
        const { mainBolt, branches } = generateLightningBolt(originX, originY, intensity);
        lightningState.bolt = mainBolt;
        lightningState.branches = branches;
        lightningState.boltVisibleUntil = lightningState.startTime + 130 + Math.random() * 80;
      } else {
        lightningState.bolt = null;
        lightningState.branches = [];
      }

      const duration = lightningState.profile[lightningState.profile.length - 1].t;
      const gapBase = hasBolt ? 6000 : 2800;
      nextLightningTime = Date.now() + duration + gapBase + Math.random() * 6000;
    }

    // ── Render Loop ──
    function render() {
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const now = Date.now();
      const perfNow = performance.now();
      gustPhase += 0.008;
      const gust = currentGust();

      if (now > nextLightningTime && !lightningState.active) {
        triggerLightning();
      }

      let fi = 0;
      if (lightningState.active) {
        const elapsed = perfNow - lightningState.startTime;
        const lastT = lightningState.profile[lightningState.profile.length - 1].t;
        if (elapsed > lastT) {
          lightningState.active = false;
          lightningState.bolt = null;
          lightningState.branches = [];
        } else {
          fi = sampleProfile(lightningState.profile, elapsed);
        }
      }
      const hue = HUES[lightningState.hue];

      // 1. Fog / mist (drifts low across the hall floor)
      ctx.save();
      fogBlobs.forEach((f) => {
        f.x += f.speed;
        if (f.x - f.radiusX > width + 50) f.x = -f.radiusX - 50;
        if (f.x + f.radiusX < -50) f.x = width + f.radiusX + 50;
        const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radiusX);
        const boosted = f.opacity + fi * 0.1;
        grad.addColorStop(0, `rgba(195, 205, 220, ${boosted})`);
        grad.addColorStop(1, "rgba(195, 205, 220, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(f.x, f.y, f.radiusX, f.radiusY, 0, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // 2. Torchlight breathing glow — independent of lightning
      ctx.save();
      torches.forEach((t) => {
        t.phase += t.speed;
        const pulse = 0.5 + 0.5 * Math.sin(t.phase);
        const radius = width * 0.22 * (0.85 + pulse * 0.15);
        const grad = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, radius);
        const a = (0.05 + pulse * 0.05) * (1 + fi * 0.3);
        grad.addColorStop(0, `rgba(255, 176, 96, ${a})`);
        grad.addColorStop(1, "rgba(255, 176, 96, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(t.x, t.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // 3. Lightning atmosphere & hall illumination
      if (fi > 0) {
        const skyGlow = ctx.createRadialGradient(
          lightningState.originX,
          lightningState.originY,
          10,
          lightningState.originX,
          lightningState.originY,
          width * 0.9
        );
        skyGlow.addColorStop(0, `rgba(${hue.glow}, ${fi * 0.42})`);
        skyGlow.addColorStop(0.35, `rgba(${hue.glow}, ${fi * 0.25})`);
        skyGlow.addColorStop(0.7, `rgba(${hue.glow}, ${fi * 0.1})`);
        skyGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = skyGlow;
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = `rgba(205, 228, 255, ${fi * 0.16})`;
        ctx.fillRect(0, 0, width, height);

        if (
          lightningState.bolt &&
          lightningState.bolt.length > 1 &&
          perfNow < lightningState.boltVisibleUntil
        ) {
          ctx.save();

          ctx.strokeStyle = `rgba(${hue.glow}, ${fi * 0.95})`;
          ctx.lineWidth = 4.5;
          ctx.shadowColor = `rgba(${hue.glow}, 0.95)`;
          ctx.shadowBlur = 16;
          ctx.beginPath();
          lightningState.bolt.forEach((pt, idx) => {
            if (idx === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          });
          ctx.stroke();

          ctx.strokeStyle = `rgba(${hue.core}, ${fi})`;
          ctx.lineWidth = 1.9;
          ctx.beginPath();
          lightningState.bolt.forEach((pt, idx) => {
            if (idx === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          });
          ctx.stroke();

          lightningState.branches.forEach((br) => {
            if (br.length > 1) {
              ctx.strokeStyle = `rgba(${hue.branch}, ${fi * 0.8})`;
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

      // 4. Rain — wind gusts modulate sideways drift in slow waves
      ctx.save();
      rainDrops.forEach((drop) => {
        const wind = drop.windBase * gust;
        drop.x += wind;
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
        ctx.lineTo(drop.x + wind * 2.2, drop.y + drop.length);
        ctx.stroke();

        if (drop.depth > 0.65 && drop.y + drop.length > height * 0.93 && Math.random() < 0.06) {
          spawnSplash(drop.x, height * 0.95 + Math.random() * height * 0.04, drop.depth);
        }
      });
      ctx.restore();

      // 5. Splash ripples
      ctx.save();
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        s.life += 1;
        const p = s.life / s.maxLife;
        if (p >= 1) {
          splashes.splice(i, 1);
          continue;
        }
        s.radius = s.maxRadius * p;
        ctx.strokeStyle = `rgba(200, 220, 240, ${s.opacity * (1 - p)})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.ellipse(s.x, s.y, s.radius, s.radius * 0.35, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // 6. Bats — loose flocking, banked turns, clawed wingtips
      flock.driftTimer -= 1;
      if (flock.driftTimer <= 0) {
        flock.targetY = height * (0.2 + Math.random() * 0.36);
        flock.driftTimer = 150 + Math.random() * 160;
      }
      flock.y += (flock.targetY - flock.y) * 0.005;

      ctx.save();
      bats.forEach((bat, index) => {
        bat.x += bat.vx;
        bat.swayPhase += 0.045;

        bat.baseY += (flock.y - bat.baseY) * 0.0007;
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

        const verticalVel = Math.cos(bat.swayPhase) * 0.022 * bat.depth;
        const targetBank = Math.max(-0.35, Math.min(0.35, verticalVel * 6));
        bat.bank += (targetBank - bat.bank) * 0.08;

        ctx.save();
        ctx.translate(bat.x, bat.y);

        const facing = bat.vx > 0 ? 1 : -1;
        ctx.scale(facing, 1);
        ctx.rotate(bat.bank);

        const flap = bat.isGliding ? 0.2 : Math.sin(bat.wingAngle);
        const s = bat.size;

        const isIlluminated = fi > 0.2;
        const shade = 24 + bat.tone * 16;
        ctx.fillStyle = isIlluminated
          ? `rgba(${Math.round(shade + 8)}, ${Math.round(shade + 12)}, ${Math.round(shade + 28)}, ${bat.opacity})`
          : `rgba(${Math.round(shade)}, ${Math.round(shade + 2)}, ${Math.round(shade + 7)}, ${bat.opacity})`;

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
        ctx.lineTo(-s * 1.22, tipY + s * 0.12);
        ctx.quadraticCurveTo(-s * 0.95, tipY + s * 0.45, -s * 0.65, midY + s * 0.3);
        ctx.quadraticCurveTo(-s * 0.4, midY + s * 0.35, -s * 0.05, s * 0.2);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(s * 0.1, -s * 0.1);
        ctx.quadraticCurveTo(s * 0.6, midY - s * 0.2, s * 1.35, tipY);
        ctx.lineTo(s * 1.22, tipY + s * 0.12);
        ctx.quadraticCurveTo(s * 0.95, tipY + s * 0.45, s * 0.65, midY + s * 0.3);
        ctx.quadraticCurveTo(s * 0.4, midY + s * 0.35, s * 0.05, s * 0.2);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      });
      ctx.restore();

      // 7. Embers — warm drifting sparks rising off unseen torches
      ctx.save();
      embers.forEach((e) => {
        e.swayPhase += 0.02;
        e.x += e.vx + Math.sin(e.swayPhase) * 0.15;
        e.y += e.vy;
        e.flickerPhase += e.flickerSpeed;
        if (e.y < -10) {
          e.y = height + Math.random() * 40;
          e.x = Math.random() * width;
        }
        if (e.x < -10) e.x = width + 10;
        if (e.x > width + 10) e.x = -10;

        const flicker = 0.55 + 0.45 * Math.sin(e.flickerPhase);
        const a = e.baseAlpha * flicker + fi * 0.1;
        const grad = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.size * 2.5);
        grad.addColorStop(0, `rgba(255, 170, 90, ${a})`);
        grad.addColorStop(1, "rgba(255, 170, 90, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size * 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 214, 170, ${Math.min(1, a * 1.4)})`;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

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
