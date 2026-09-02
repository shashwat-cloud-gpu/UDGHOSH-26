import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CinematicPanel({
  framesPath,
  frameCount,
  frameExt = "jpg",
  scrubVh = "500vh",
  dwellVh = "150vh",
  placeholderSrc = null,
  staticBgSrc = null,
  outroBgSrc = null,
  outroStart = 0.85,
  children,
  onEnterDwell,
  onLeaveDwell,
  onProgress,
  enabled = true,
  extendPinVh = null,
  hideBeforePin = false,
}) {
  const wrapperRef = useRef(null);
  const pinRef = useRef(null);
  const canvasRef = useRef(null);
  const staticImgRef = useRef(null);
  const outroImgRef = useRef(null);
  const placeholderImgRef = useRef(null);
  const framesRef = useRef([]);
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const currentRenderedFrameRef = useRef(0);
  const frameLoopRef = useRef(null);
  const enteredDwellRef = useRef(false);

  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [dwellProgress, setDwellProgress] = useState(0);
  const [inDwell, setInDwell] = useState(false);

  const isReadyRef = useRef(false);
  useEffect(() => {
    isReadyRef.current = isReady;
  }, [isReady]);

  const scrubNum = parseFloat(scrubVh);
  const dwellNum = parseFloat(dwellVh);
  const scrubRatio = scrubNum / (scrubNum + dwellNum);

  const drawFrame = (index) => {
    const canvas = canvasRef.current;
    const frames = framesRef.current;
    if (!canvas || !frames || frames.length === 0) return;

    let img = frames[index];
    // If targeted frame isn't loaded yet, smoothly find nearest available frame
    if (!img || !img.complete) {
      let closest = null;
      let minDiff = 9999;
      for (let i = 0; i < frames.length; i++) {
        if (frames[i] && frames[i].complete) {
          const diff = Math.abs(i - index);
          if (diff < minDiff) {
            minDiff = diff;
            closest = frames[i];
          }
        }
      }
      img = closest;
    }

    if (!img || !img.complete) return;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    const cw = canvas.width, ch = canvas.height;
    const iw = img.naturalWidth, ih = img.naturalHeight;
    if (!iw || !ih) return;
    const scale = Math.max(cw / iw, ch / ih);
    const sw = iw * scale, sh = ih * scale;
    const sx = (cw - sw) / 2, sy = (ch - sh) / 2;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, sx, sy, sw, sh);
  };

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      drawFrame(currentFrameRef.current);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Adaptive Progressive Frame Loading Engine
  useEffect(() => {
    if (!framesPath || !frameCount || !enabled) return;

    // Detect network speed and screen size to minimize initial bandwidth
    let step = 2; // Default: 96 frames (50% bandwidth cut, silky smooth)
    if (typeof navigator !== "undefined") {
      const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (conn && (conn.saveData || conn.effectiveType === "slow-2g" || conn.effectiveType === "2g")) {
        step = 4; // Ultra-light: 48 frames (75% bandwidth cut)
      } else if (conn && conn.effectiveType === "3g") {
        step = 3; // Light: 64 frames (67% bandwidth cut)
      }
    }
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      step = Math.max(step, 3); // Mobile: 64 frames (67% bandwidth cut)
    }

    const frames = new Array(frameCount);
    framesRef.current = frames;

    let isCancelled = false;
    let loadedCount = 0;

    // Build the list of keyframe indices to fetch
    const targetIndices = [];
    for (let i = 0; i < frameCount; i += step) {
      targetIndices.push(i);
    }
    if (targetIndices[targetIndices.length - 1] !== frameCount - 1) {
      targetIndices.push(frameCount - 1);
    }
    const totalToLoad = targetIndices.length;

    // Fast-path: Load Frame 1 immediately so the canvas renders within milliseconds
    const firstImg = new Image();
    const firstPadded = "0001";
    firstImg.src = `${framesPath}${firstPadded}.${frameExt}`;
    firstImg.onload = () => {
      if (isCancelled) return;
      frames[0] = firstImg;
      loadedCount += 1;
      setLoadProgress(Math.round((loadedCount / totalToLoad) * 100));
      setIsReady(true);
      isReadyRef.current = true;
      drawFrame(0);
      startQueue();
    };
    firstImg.onerror = () => {
      if (isCancelled) return;
      startQueue();
    };
    frames[0] = firstImg;

    // Controlled concurrent batch loader to prevent network saturation
    const startQueue = () => {
      const remaining = targetIndices.filter((idx) => idx !== 0);
      const BATCH_SIZE = 4;
      let currentIndex = 0;

      const loadNext = () => {
        if (isCancelled || currentIndex >= remaining.length) return;
        const frameIdx = remaining[currentIndex++];
        const padded = String(frameIdx + 1).padStart(4, "0");
        const img = new Image();
        img.src = `${framesPath}${padded}.${frameExt}`;
        img.onload = () => {
          if (isCancelled) return;
          frames[frameIdx] = img;
          loadedCount += 1;
          setLoadProgress(Math.round((loadedCount / totalToLoad) * 100));
          drawFrame(currentFrameRef.current);
          loadNext();
        };
        img.onerror = () => {
          if (isCancelled) return;
          loadNext();
        };
        frames[frameIdx] = img;
      };

      for (let b = 0; b < Math.min(BATCH_SIZE, remaining.length); b++) {
        loadNext();
      }
    };

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [framesPath, frameCount, frameExt, enabled]);

  // Capped Speed & Continuous Frame Interpolation Engine
  useEffect(() => {
    let lastTime = performance.now();

    function tick(now) {
      const deltaMs = Math.min(now - lastTime, 100);
      lastTime = now;

      // Rate limit: max ~75 frames per second speed cap
      // Even under extreme user scroll bursts, graphics scrub smoothly without frame drops
      const target = targetFrameRef.current;
      const current = currentRenderedFrameRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.001) {
        const maxStep = (75 / 1000) * deltaMs;
        const step = Math.sign(diff) * Math.min(Math.abs(diff) * 0.18, maxStep);

        currentRenderedFrameRef.current += step;
        const frameToDraw = Math.min(Math.max(Math.round(currentRenderedFrameRef.current), 0), (frameCount || 1) - 1);

        if (frameToDraw !== currentFrameRef.current) {
          currentFrameRef.current = frameToDraw;
          drawFrame(frameToDraw);
        }
      }

      frameLoopRef.current = requestAnimationFrame(tick);
    }

    frameLoopRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameLoopRef.current) cancelAnimationFrame(frameLoopRef.current);
    };
  }, [frameCount]);

  // GSAP ScrollTrigger
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        end: extendPinVh ? `bottom+=${extendPinVh} bottom` : "bottom bottom",
        scrub: 0.8, // Smooth GSAP tracking
        pin: pinRef.current,
        pinSpacing: false,
        anticipatePin: 1,
        onToggle: (self) => {
          if (hideBeforePin && pinRef.current) {
            pinRef.current.style.opacity = self.isActive ? "1" : "0";
          }
        },
        onUpdate: (self) => {
          const total = self.progress;
          if (onProgress) onProgress(total);
          const ready = isReadyRef.current;

          // Fade out the placeholder organically during the first 5% of scroll
          if (placeholderImgRef.current) {
            const fadeOutEnd = 0.05;
            let pOpacity = 1;
            if (total > fadeOutEnd) {
              pOpacity = 0;
            } else {
              pOpacity = 1 - (total / fadeOutEnd);
            }
            placeholderImgRef.current.style.opacity = String(pOpacity);
          }

          if (total <= scrubRatio) {
            const scrubProgress = scrubRatio > 0 ? total / scrubRatio : 1;
            targetFrameRef.current = Math.min(
              Math.floor(scrubProgress * (frameCount - 1)),
              frameCount - 1
            );

            if (canvasRef.current) {
              canvasRef.current.style.opacity = ready ? "1" : "0";
            }
            if (staticImgRef.current) staticImgRef.current.style.opacity = "0";
            if (outroImgRef.current) outroImgRef.current.style.opacity = "0";
            if (enteredDwellRef.current) {
              enteredDwellRef.current = false;
              setInDwell(false);
              if (onLeaveDwell) onLeaveDwell();
            }
            setDwellProgress(0);
          } else {
            // Once scrub finishes, lock to last frame
            targetFrameRef.current = frameCount - 1;

            if (canvasRef.current) canvasRef.current.style.opacity = "0";
            if (staticImgRef.current) staticImgRef.current.style.opacity = "1";

            const dp = scrubRatio < 1 ? (total - scrubRatio) / (1 - scrubRatio) : 1;
            const clampedDp = Math.min(Math.max(dp, 0), 1);
            setDwellProgress(clampedDp);

            if (outroImgRef.current) {
              if (outroBgSrc && clampedDp > outroStart && outroStart < 1) {
                const outroProgress = (clampedDp - outroStart) / (1 - outroStart);
                outroImgRef.current.style.opacity = String(
                  Math.min(Math.max(outroProgress, 0), 1)
                );
              } else {
                outroImgRef.current.style.opacity = "0";
              }
            }

            if (!enteredDwellRef.current) {
              enteredDwellRef.current = true;
              setInDwell(true);
              if (onEnterDwell) onEnterDwell();
            }
          }
        },
      });
    });
    return () => {
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameCount, scrubRatio, outroStart, outroBgSrc, extendPinVh, hideBeforePin]);

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "relative",
        height: `calc(${scrubVh} + ${dwellVh})`,
      }}
    >
      <div
        ref={pinRef}
        style={{
          position: "sticky",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Placeholder image (visible before frames load) */}
        {placeholderSrc && (
          <img
            ref={placeholderImgRef}
            src={placeholderSrc}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 0,
              opacity: isReady ? 0 : 1,
              transition: "opacity 0.6s ease",
            }}
          />
        )}

        {/* Scrub frame canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
            opacity: 0,
            transition: "opacity 0.3s ease",
          }}
        />

        {/* Static background during dwell */}
        {staticBgSrc && (
          <img
            ref={staticImgRef}
            src={staticBgSrc}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 1,
              opacity: 0,
              transition: "opacity 0.5s ease",
            }}
          />
        )}

        {/* Outro blend background (blends near end of dwell) */}
        {outroBgSrc && (
          <img
            ref={outroImgRef}
            src={outroBgSrc}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 1,
              opacity: 0,
              transition: "opacity 0.4s ease",
            }}
          />
        )}

        {/* Loading overlay indicator */}
        {!isReady && framesPath && (
          <div
            style={{
              position: "absolute",
              bottom: "2rem",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
              color: "rgba(255,255,255,0.7)",
              fontFamily: "'Cinzel', serif",
              fontSize: "0.85rem",
              letterSpacing: "0.2em",
              textAlign: "center",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                width: "120px",
                height: "2px",
                background: "rgba(255,255,255,0.2)",
                borderRadius: "2px",
                margin: "0 auto 0.5rem",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${loadProgress}%`,
                  height: "100%",
                  background: "#38BDF8",
                  transition: "width 0.1s linear",
                }}
              />
            </div>
            <span>{loadProgress}%</span>
          </div>
        )}

        {/* Panel children (interactive overlays, atmospheres, content) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            pointerEvents: inDwell ? "auto" : "none",
          }}
        >
          {typeof children === "function"
            ? children(dwellProgress)
            : children}
        </div>
      </div>
    </div>
  );
}
