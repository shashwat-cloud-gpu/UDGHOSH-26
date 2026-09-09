import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CinematicPanel({
  videoSrc,
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
  const videoRef = useRef(null);
  const staticImgRef = useRef(null);
  const outroImgRef = useRef(null);
  const placeholderImgRef = useRef(null);
  const enteredDwellRef = useRef(false);
  // Desired video position, expressed as 0–1 progress through the clip.
  // Written cheaply by ScrollTrigger's onUpdate; consumed by a separate
  // rAF loop below so seeking is paced to the browser's paint cycle
  // instead of the raw scroll-event rate.
  const targetProgressRef = useRef(0);

  const [videoReady, setVideoReady] = useState(false);
  const [dwellProgress, setDwellProgress] = useState(0);
  const [inDwell, setInDwell] = useState(false);

  const videoReadyRef = useRef(false);
  useEffect(() => {
    videoReadyRef.current = videoReady;
  }, [videoReady]);

  // If the video is already buffered (e.g. bfcache / instant cache hit),
  // `canPlayThrough` may never fire again — catch that case on mount.
  useEffect(() => {
    const video = videoRef.current;
    if (video && video.readyState >= 3) {
      setVideoReady(true);
      videoReadyRef.current = true;
    }
  }, [videoSrc]);

  // As soon as the video becomes ready, force GSAP to re-run onUpdate so the
  // placeholder/video swap immediately, even if the user isn't actively
  // scrolling right when the video finishes buffering.
  useEffect(() => {
    if (videoReady) {
      ScrollTrigger.update();
    }
  }, [videoReady]);

  // Dedicated seek loop, ticking on requestAnimationFrame.
  // Why not just set video.currentTime inside ScrollTrigger's onUpdate?
  // Because onUpdate can fire faster than the video element can actually
  // service a seek, especially with sparsely-keyframed footage — issuing a
  // new seek before the previous one resolves piles them up and the video
  // visibly lags/stutters behind the scroll. This loop:
  //  - only ever issues one seek per animation frame,
  //  - skips entirely while a previous seek is still in flight
  //    (video.seeking === true), letting the backlog drain instead of grow,
  //  - skips no-op seeks smaller than roughly one frame's worth of time,
  //  - uses fastSeek() where available for cheaper mid-scrub seeking, but
  //    always falls back to precise currentTime at the very start/end of
  //    the clip so it lands exactly on frame 0 (matching the placeholder)
  //    and the true last frame (matching the dwell background) for a
  //    seamless crossfade.
  useEffect(() => {
    let rafId;

    const tick = () => {
      const video = videoRef.current;
      if (
        video &&
        videoReadyRef.current &&
        video.duration &&
        isFinite(video.duration) &&
        !video.seeking
      ) {
        const progress = Math.min(Math.max(targetProgressRef.current, 0), 1);
        const safeDuration = Math.max(video.duration - 0.03, 0);
        const targetTime = Math.min(progress * video.duration, safeDuration);
        const delta = Math.abs(video.currentTime - targetTime);

        // Roughly one frame at 60fps — anything smaller isn't worth a seek.
        if (delta > 1 / 60) {
          const atEdge = progress <= 0.001 || progress >= 0.999;
          if (!atEdge && typeof video.fastSeek === "function") {
            video.fastSeek(targetTime);
          } else {
            video.currentTime = targetTime;
          }
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // extendPinVh adds extra *dwell* time (holding the final frame longer)
  // without touching how long the video takes to scrub. Critically, this
  // extra distance must be baked into the wrapper's real DOM height (see
  // totalHeight below) — not just into the ScrollTrigger "end" position —
  // otherwise the next panel in the document sits right after this panel's
  // un-extended height and starts activating while this one is still
  // pinned, producing two panels visible/fixed at once (a hard seam/split
  // screen). Making the wrapper's actual height match the full pin
  // duration means the next panel physically can't begin until this one's
  // pin has truly finished.
  const scrubNum = parseFloat(scrubVh);
  const dwellNum = parseFloat(dwellVh);
  const extendNum = extendPinVh ? parseFloat(extendPinVh) : 0;
  const scrubRatio = scrubNum / (scrubNum + dwellNum + extendNum);
  const totalHeight = extendPinVh
    ? `calc(${scrubVh} + ${dwellVh} + ${extendPinVh})`
    : `calc(${scrubVh} + ${dwellVh})`;

  // GSAP ScrollTrigger
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        end: "bottom bottom",
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
          const video = videoRef.current;
          const ready = videoReadyRef.current;
          if (onProgress) onProgress(total);

          // Fade placeholder during the first 5% of scroll — but only once the
          // video is actually ready to show. This prevents a black flash if the
          // user scrolls (in either direction) before the video has buffered:
          // the placeholder (which is the same image as the video's first
          // frame) stays put as a safe fallback until playback is possible.
          if (placeholderImgRef.current) {
            const fadeOutEnd = 0.05;
            if (total <= scrubRatio && !ready) {
              placeholderImgRef.current.style.opacity = "1";
            } else {
              placeholderImgRef.current.style.opacity =
                total > fadeOutEnd ? "0" : String(1 - total / fadeOutEnd);
            }
          }

          if (total <= scrubRatio) {
            // SCRUB PHASE — target progress is a pure function of scroll
            // position, so this scrubs correctly whether the user scrolls
            // down or up, and simply stops wherever the user stops
            // scrolling. The actual seek happens in the rAF loop above.
            const scrubProgress = scrubRatio > 0 ? total / scrubRatio : 1;
            targetProgressRef.current = Math.min(Math.max(scrubProgress, 0), 1);

            if (videoRef.current) videoRef.current.style.opacity = ready ? "1" : "0";
            if (staticImgRef.current) staticImgRef.current.style.opacity = "0";
            if (outroImgRef.current) outroImgRef.current.style.opacity = "0";
            if (enteredDwellRef.current) {
              enteredDwellRef.current = false;
              setInDwell(false);
              if (onLeaveDwell) onLeaveDwell();
            }
            setDwellProgress(0);
          } else {
            // DWELL PHASE — lock the target to the very last frame; the rAF
            // loop seeks to it once and then skips further no-op seeks.
            targetProgressRef.current = 1;
            if (video) video.style.opacity = "0";
            if (staticImgRef.current) staticImgRef.current.style.opacity = "1";

            const dp = scrubRatio < 1 ? (total - scrubRatio) / (1 - scrubRatio) : 1;
            const clampedDp = Math.min(Math.max(dp, 0), 1);
            setDwellProgress(clampedDp);

            if (outroImgRef.current) {
              if (outroBgSrc && clampedDp > outroStart && outroStart < 1) {
                const outroProgress = (clampedDp - outroStart) / (1 - outroStart);
                outroImgRef.current.style.opacity = String(Math.min(Math.max(outroProgress, 0), 1));
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
  }, [scrubRatio, outroStart, outroBgSrc, hideBeforePin]);

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "relative",
        height: totalHeight,
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
          // Start hidden (matches GSAP's first onToggle call) so there's no
          // flash of this panel's content before its own pin is reached.
          opacity: hideBeforePin ? 0 : 1,
          transition: hideBeforePin ? "opacity 0.15s ease" : undefined,
        }}
      >
        {/* Placeholder image (visible before video loads) */}
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
              opacity: videoReady ? 0 : 1,
              transition: "opacity 0.6s ease",
              willChange: "opacity",
              transform: "translateZ(0)",
            }}
          />
        )}

        {/* Scrub video */}
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
            opacity: videoReady ? 1 : 0,
            transition: "opacity 0.3s ease",
            willChange: "opacity",
            transform: "translateZ(0)",
          }}
          onCanPlayThrough={() => {
            setVideoReady(true);
            videoReadyRef.current = true;
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
              willChange: "opacity",
              transform: "translateZ(0)",
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
              willChange: "opacity",
              transform: "translateZ(0)",
            }}
          />
        )}

        {/* Loading indicator */}
        {!videoReady && videoSrc && (
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
            <span>Loading video...</span>
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
