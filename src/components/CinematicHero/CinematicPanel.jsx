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
}) {
  const wrapperRef = useRef(null);
  const pinRef = useRef(null);
  const canvasRef = useRef(null);
  const staticImgRef = useRef(null);
  const outroImgRef = useRef(null);
  const framesRef = useRef([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef(null);
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
    const img = framesRef.current[index];
    if (!canvas || !img || !img.complete) return;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    const cw = canvas.width, ch = canvas.height;
    const iw = img.naturalWidth, ih = img.naturalHeight;
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
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
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

  useEffect(() => {
    if (!framesPath || !frameCount) return;
    const frames = new Array(frameCount);
    let loaded = 0;
    const handleLoad = () => {
      loaded += 1;
      setLoadProgress(Math.round((loaded / frameCount) * 100));
      if (loaded === frameCount) {
        framesRef.current = frames;
        setIsReady(true);
        isReadyRef.current = true;
        drawFrame(currentFrameRef.current);
      }
    };
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      const padded = String(i + 1).padStart(4, "0");
      img.src = `${framesPath}${padded}.${frameExt}`;
      img.onload = handleLoad;
      img.onerror = handleLoad;
      frames[i] = img;
    }
    return () => {
      for (let i = 0; i < frames.length; i++) {
        frames[i].onload = null;
        frames[i].onerror = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [framesPath, frameCount, frameExt]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        pin: pinRef.current,
        pinSpacing: false,
        anticipatePin: 1,
        onUpdate: (self) => {
          const total = self.progress;
          const ready = isReadyRef.current;

          if (total <= scrubRatio) {
            const scrubProgress = scrubRatio > 0 ? total / scrubRatio : 1;
            const targetFrame = Math.min(
              Math.floor(scrubProgress * (frameCount - 1)),
              frameCount - 1
            );
            if (targetFrame !== currentFrameRef.current) {
              currentFrameRef.current = targetFrame;
              if (rafRef.current) cancelAnimationFrame(rafRef.current);
              rafRef.current = requestAnimationFrame(() => drawFrame(targetFrame));
            }
            if (canvasRef.current) {
              canvasRef.current.style.opacity = ready ? "1" : "0";
            }
            if (staticImgRef.current) staticImgRef.current.style.opacity = "0";
            if (outroImgRef.current) outroImgRef.current.style.opacity = "0";
            if (enteredDwellRef.current) {
              enteredDwellRef.current = false;
              setInDwell(false);
            }
            setDwellProgress(0);
          } else {
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
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{ position: "relative", height: `calc(${scrubVh} + ${dwellVh})` }}
    >
      <div
        ref={pinRef}
        style={{
          position: "relative", height: "100vh", width: "100%",
          overflow: "hidden", backgroundColor: "#000",
        }}
      >
        {placeholderSrc && !isReady && (
          <img
            src={placeholderSrc}
            alt=""
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover", zIndex: 0,
            }}
          />
        )}

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute", top: 0, left: 0,
            width: "100%", height: "100%", zIndex: 1,
            opacity: isReady ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        />

        {staticBgSrc && (
          <img
            ref={staticImgRef}
            src={staticBgSrc}
            alt=""
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover", zIndex: 1,
              opacity: 0,
              transition: "opacity 0.5s ease",
            }}
          />
        )}

        {outroBgSrc && (
          <img
            ref={outroImgRef}
            src={outroBgSrc}
            alt=""
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover", zIndex: 1,
              opacity: 0,
              transition: "opacity 0.3s ease",
            }}
          />
        )}

        <div style={{ position: "absolute", inset: 0, zIndex: 2 }}>
          {typeof children === "function"
            ? children(dwellProgress, inDwell)
            : children}
        </div>

        {!isReady && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 3,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "flex-end",
            paddingBottom: "3rem",
          }}>
            <div style={{
              width: "200px", height: "2px",
              background: "rgba(255,255,255,0.15)",
              borderRadius: "2px", overflow: "hidden",
            }}>
              <div style={{
                height: "100%", width: `${loadProgress}%`,
                background: "rgba(255,255,255,0.7)",
                transition: "width 0.2s ease",
                borderRadius: "2px",
              }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
