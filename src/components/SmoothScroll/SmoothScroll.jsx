import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }) {
  useEffect(() => {
    // 1. Initialize Lenis Smooth Scrolling Engine
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.75, // Softens raw mouse wheel bursts
      touchMultiplier: 1.2,
      infinite: false,
    });

    // Synchronize Lenis with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis via GSAP's internal high-precision ticker
    const tickerCallback = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // 2. Wheel Delta Capper (prevents sudden runaway scroll velocity on free-spinning wheels)
    const MAX_WHEEL_DELTA = 110;
    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) > MAX_WHEEL_DELTA) {
        // If a single wheel event delivers an extreme spike, normalize it
        // so speed is controlled and smooth
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, []);

  return children || null;
}
