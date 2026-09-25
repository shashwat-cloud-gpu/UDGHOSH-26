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

    // ── Fog removed ──
    const fogBlobs = [];

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

    // ── Castle Bats State ──
    const maxBats = 5;
    const bats = [];
    // A slowly drifting shared center the bats loosely trail toward, so the
    // group reads as a colony rather than independent random dots.
    const flock = { y: height * 0.32, targetY: height * 0.32, driftTimer: 0 };

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
        bank: 0,
        tone: Math.random(), // slight per-bat colour variation
      };
    }

    for (let i = 0; i < maxBats; i++) {
      bats.push(createBat(true));
    }

    // ── Drifting Motes Engine ──
    // Faint mist/firefly-like specks that catch ambient moonlight — cheap
    // to draw but adds a lot of perceived depth and life to the air itself.
    const moteCount = 36;
    const motes = [];
    function createMote() {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -(Math.random() * 0.25 + 0.08),
        size: Math.random() * 1.6 + 0.6,
        baseAlpha: Math.random() * 0.35 + 0.1,
        flickerPhase: Math.random() * Math.PI * 2,
        flickerSpeed: Math.random() * 0.02 + 0.01,
      };
    }
    for (let i = 0; i < moteCount; i++) motes.push(createMote());

    // ── Distant Birds Engine ──
    // A second, slower, farther-back silhouette layer beyond the bats for
    // extra parallax depth in the sky.
    const birdCount = 3;
    const birds = [];
    function createBird(initialSpread = false) {
      const fromLeft = Math.random() > 0.5;
      const speed = (Math.random() * 0.5 + 0.35) * (fromLeft ? 1 : -1);
      return {
        x: initialSpread ? Math.random() * width : (fromLeft ? -40 : width + 40),
        y: Math.random() * height * 0.22 + 15,
        vx: speed,
        wingAngle: Math.random() * Math.PI * 2,
        wingSpeed: Math.random() * 0.04 + 0.05,
        size: Math.random() * 3 + 5,
        opacity: Math.random() * 0.15 + 0.25,
      };
    }
    for (let i = 0; i < birdCount; i++) birds.push(createBird(true));

    // ── Lightning Engine ──
    // Each strike now gets a procedurally generated flicker profile (a
    // keyframed intensity curve sampled by elapsed time) and a random
    // "type", instead of the same fixed setTimeout flash sequence firing
    // identically every time. Most real storms are distant rumbles and
    // diffuse sheet flashes — dramatic close bolts are the rare case — so
    // strike types are weighted accordingly.
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
    let nextLightningTime = Date.now() + (Math.random() * 2000 + 800);

    const HUES = {
      cool: { glow: "186, 215, 255", core: "255, 255, 255", branch: "186, 220, 255" },
      violet: { glow: "196, 189, 255", core: "245, 240, 255", branch: "206, 196, 255" },
      warm: { glow: "230, 225, 255", core: "255, 253, 245", branch: "222, 218, 250" },
    };
    const HUE_KEYS = Object.keys(HUES);

    function buildProfile(type) {
      const r = () => Math.random();
      if (type === "single") {
        return [
          { t: 0, i: 0.5 + r() * 0.15 },
          { t: 35 + r() * 15, i: 0.12 },
          { t: 80 + r() * 25, i: 0.85 + r() * 0.15 },
          { t: 170 + r() * 30, i: 0.28 },
          { t: 260 + r() * 120, i: 0 },
        ];
      }
      if (type === "double") {
        return [
          { t: 0, i: 0.45 },
          { t: 35, i: 0.1 },
          { t: 85, i: 0.9 },
          { t: 150, i: 0.22 },
          { t: 195, i: 0.65 + r() * 0.2 },
          { t: 250, i: 0.12 },
          { t: 340 + r() * 100, i: 0 },
        ];
      }
      if (type === "triple") {
        return [
          { t: 0, i: 0.4 },
          { t: 30, i: 0.08 },
          { t: 70, i: 0.8 },
          { t: 120, i: 0.2 },
          { t: 160, i: 0.6 },
          { t: 205, i: 0.15 },
          { t: 250, i: 0.5 },
          { t: 300, i: 0.08 },
          { t: 420 + r() * 120, i: 0 },
        ];
      }
      if (type === "sheet") {
        // Diffuse glow behind clouds — no visible bolt.
        return [
          { t: 0, i: 0 },
          { t: 140 + r() * 60, i: 0.3 + r() * 0.15 },
          { t: 380 + r() * 100, i: 0.12 },
          { t: 650 + r() * 200, i: 0 },
        ];
      }
      // "distant" — very dim, slow, long — a strike far off on the horizon.
      return [
        { t: 0, i: 0 },
        { t: 220 + r() * 80, i: 0.14 + r() * 0.08 },
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
      const targetY = height * (Math.random() * 0.35 + 0.35);
      const jag = 20 + intensity * 20;

      while (currY < targetY) {
        const stepY = Math.random() * 20 + 12;
        const stepX = (Math.random() - 0.5) * jag + (width * 0.5 - currX) * 0.04;
        currX += stepX;
        currY += stepY;
        mainBolt.push({ x: currX, y: currY });

        if (Math.random() < 0.22 + intensity * 0.1 && branches.length < 4) {
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
      const roll = Math.random();
      const type =
        roll < 0.32 ? "distant" :
        roll < 0.55 ? "sheet" :
        roll < 0.78 ? "single" :
        roll < 0.94 ? "double" : "triple";

      const hasBolt = type === "single" || type === "double" || type === "triple";
      const intensity = type === "triple" ? 1 : type === "double" ? 0.7 : 0.45;

      const originX = Math.random() * (width * 0.6) + width * 0.2;
      const originY = Math.random() * 30;

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
      // Dim/distant flashes recur more often than dramatic close strikes —
      // shorter gaps here than GateAtmosphere so this scene (landing scrub
      // through the About Us dwell) reads as a genuinely active storm.
      const gapBase = hasBolt ? 2000 : 900;
      nextLightningTime = Date.now() + duration + gapBase + Math.random() * 2200;
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

      // 1. Fog removed

      // 2. Lightning atmosphere & sky glow
      if (fi > 0) {
        const skyGlow = ctx.createRadialGradient(
          lightningState.originX,
          lightningState.originY,
          10,
          lightningState.originX,
          lightningState.originY,
          width * 0.85
        );
        skyGlow.addColorStop(0, `rgba(${hue.glow}, ${fi * 0.38})`);
        skyGlow.addColorStop(0.3, `rgba(${hue.glow}, ${fi * 0.22})`);
        skyGlow.addColorStop(0.7, `rgba(${hue.glow}, ${fi * 0.08})`);
        skyGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = skyGlow;
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = `rgba(220, 235, 255, ${fi * 0.14})`;
        ctx.fillRect(0, 0, width, height * 0.7);

        if (
          lightningState.bolt &&
          lightningState.bolt.length > 1 &&
          perfNow < lightningState.boltVisibleUntil
        ) {
          ctx.save();

          ctx.strokeStyle = `rgba(${hue.glow}, ${fi * 0.9})`;
          ctx.lineWidth = 4;
          ctx.shadowColor = `rgba(${hue.glow}, 0.9)`;
          ctx.shadowBlur = 14;
          ctx.beginPath();
          lightningState.bolt.forEach((pt, idx) => {
            if (idx === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          });
          ctx.stroke();

          ctx.strokeStyle = `rgba(${hue.core}, ${fi})`;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          lightningState.bolt.forEach((pt, idx) => {
            if (idx === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          });
          ctx.stroke();

          lightningState.branches.forEach((br) => {
            if (br.length > 1) {
              ctx.strokeStyle = `rgba(${hue.branch}, ${fi * 0.75})`;
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

      // 3. Distant birds — slower, farther-back depth cue beyond the bats
      ctx.save();
      birds.forEach((bird, index) => {
        bird.x += bird.vx;
        bird.wingAngle += bird.wingSpeed;
        const offLeft = bird.vx < 0 && bird.x < -60;
        const offRight = bird.vx > 0 && bird.x > width + 60;
        if (offLeft || offRight) {
          birds[index] = createBird(false);
          return;
        }
        const facing = bird.vx > 0 ? 1 : -1;
        const flap = Math.sin(bird.wingAngle) * bird.size * 0.6;
        ctx.strokeStyle = `rgba(20, 22, 28, ${bird.opacity})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(bird.x - bird.size * facing, bird.y - flap);
        ctx.quadraticCurveTo(bird.x, bird.y + flap * 0.3, bird.x + bird.size * facing, bird.y - flap);
        ctx.stroke();
      });
      ctx.restore();

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

        // Foreground drops spawn a tiny splash near the bottom edge.
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
        flock.targetY = height * (0.18 + Math.random() * 0.32);
        flock.driftTimer = 180 + Math.random() * 180;
      }
      flock.y += (flock.targetY - flock.y) * 0.004;

      ctx.save();
      bats.forEach((bat, index) => {
        bat.x += bat.vx;
        bat.swayPhase += 0.04;

        // A gentle pull toward the shared flock center, layered under each
        // bat's own sway, so the group drifts together loosely rather than
        // as independent random dots or a rigid formation.
        bat.baseY += (flock.y - bat.baseY) * 0.0006;
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

        // Bank into vertical movement so turns look like real gliding
        // rather than a flat sprite sliding sideways.
        const verticalVel = Math.cos(bat.swayPhase) * 0.02 * bat.depth;
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
        const shade = 22 + bat.tone * 14;
        ctx.fillStyle = isIlluminated
          ? `rgba(${Math.round(shade + 8)}, ${Math.round(shade + 10)}, ${Math.round(shade + 22)}, ${bat.opacity})`
          : `rgba(${Math.round(shade)}, ${Math.round(shade + 2)}, ${Math.round(shade + 6)}, ${bat.opacity})`;

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
        ctx.lineTo(-s * 1.22, tipY + s * 0.12); // clawed wingtip
        ctx.quadraticCurveTo(-s * 0.95, tipY + s * 0.45, -s * 0.65, midY + s * 0.3);
        ctx.quadraticCurveTo(-s * 0.4, midY + s * 0.35, -s * 0.05, s * 0.2);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(s * 0.1, -s * 0.1);
        ctx.quadraticCurveTo(s * 0.6, midY - s * 0.2, s * 1.35, tipY);
        ctx.lineTo(s * 1.22, tipY + s * 0.12); // clawed wingtip
        ctx.quadraticCurveTo(s * 0.95, tipY + s * 0.45, s * 0.65, midY + s * 0.3);
        ctx.quadraticCurveTo(s * 0.4, midY + s * 0.35, s * 0.05, s * 0.2);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      });
      ctx.restore();

      // 7. Drifting motes — faint mist/firefly specks for foreground depth
      ctx.save();
      motes.forEach((m) => {
        m.x += m.vx;
        m.y += m.vy;
        m.flickerPhase += m.flickerSpeed;
        if (m.y < -10) {
          m.y = height + 10;
          m.x = Math.random() * width;
        }
        if (m.x < -10) m.x = width + 10;
        if (m.x > width + 10) m.x = -10;

        const flicker = 0.6 + 0.4 * Math.sin(m.flickerPhase);
        const a = m.baseAlpha * flicker + fi * 0.15;
        ctx.fillStyle = `rgba(225, 235, 250, ${a})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
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
