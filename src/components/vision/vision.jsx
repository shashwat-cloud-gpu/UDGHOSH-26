import React, { useEffect, useRef } from "react";
import Navbar2 from "../navbar/Navbar2.jsx";
import Footer2 from "../Footer2/Footer2.jsx";
import "./vision.css";

// Background Floating Embers Animation (Subtle Castle Torchlight)
function AmbientEmbersCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const emberCount = 24;
    const embers = Array.from({ length: emberCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.8,
      speedY: Math.random() * 0.4 + 0.2,
      speedX: (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.5 + 0.2,
      fadeSpeed: Math.random() * 0.006 + 0.002,
      color: Math.random() > 0.4 ? "245, 158, 11" : "217, 119, 6",
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      embers.forEach((ember) => {
        ember.y -= ember.speedY;
        ember.x += ember.speedX;
        ember.opacity += ember.fadeSpeed;

        if (ember.opacity > 0.65 || ember.opacity < 0.15) {
          ember.fadeSpeed = -ember.fadeSpeed;
        }

        if (ember.y < -10) {
          ember.y = height + 10;
          ember.x = Math.random() * width;
        }

        ctx.fillStyle = `rgba(${ember.color}, ${Math.max(0, ember.opacity)})`;
        ctx.beginPath();
        ctx.arc(ember.x, ember.y, ember.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="vision-embers-canvas" />;
}

export default function Vision() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="vision-page-root">
      {/* ── Background Gothic Architecture ── */}
      <img
        src="/images/antique_bg.jpg"
        alt=""
        className="vision-bg-image"
        loading="eager"
      />

      {/* Ambient Lighting Gradient */}
      <div className="vision-ambient-lighting" />

      {/* Floating Castle Embers */}
      <AmbientEmbersCanvas />

      {/* ── Foreground Content Layer ── */}
      <div className="relative z-10">
        <Navbar2 />

        {/* Hero Section - Ancient Monumental Header */}
        <header className="pt-36 pb-12 px-4 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold ancient-stone-title uppercase mb-4">
            Our Mission & Vision
          </h1>
          <p className="ancient-stone-subtitle text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            The foundational ethos of Udghosh, IIT Kanpur.
          </p>
          <div className="stone-groove-line max-w-xs mx-auto my-6" />
        </header>

        {/* Ancient Stone Tablets */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {/* Mission Stone Tablet */}
            <div className="ancient-stone-slab p-6 sm:p-8">
              <div className="ancient-stone-inner p-6 sm:p-8 flex flex-col justify-between min-h-[380px]">
                <div>
                  <span className="ancient-stone-meta block mb-2">
                    FOUNDATIONAL MANDATE
                  </span>
                  <div className="stone-groove-line mb-5" />
                  <h2 className="ancient-stone-heading text-2xl sm:text-3xl font-extrabold mb-5">
                    Our Mission
                  </h2>
                  <p className="ancient-stone-body">
                    At Udghosh, our mission is clear - to ignite the flames of dedication and inspire greatness. We believe in the transformative power of sports and its ability to shape character, instill discipline, and foster unwavering commitment. We are dedicated to nurturing the talent of today to become the sports icons of tomorrow.
                  </p>
                </div>
              </div>
            </div>

            {/* Vision Stone Tablet */}
            <div className="ancient-stone-slab p-6 sm:p-8">
              <div className="ancient-stone-inner p-6 sm:p-8 flex flex-col justify-between min-h-[380px]">
                <div>
                  <span className="ancient-stone-meta block mb-2">
                    FUTURE HORIZON
                  </span>
                  <div className="stone-groove-line mb-5" />
                  <h2 className="ancient-stone-heading text-2xl sm:text-3xl font-extrabold mb-5">
                    Our Vision
                  </h2>
                  <p className="ancient-stone-body">
                    We vision to evolve the sports and athletics in a way to enhance the lives of individuals and society and to inspire the newer generation to actively participate in sporting events. Our aim would be to enhance the lifestyle and personality of everyone for the sake of longevity and acting in a more sustainable manner.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer2 />
      </div>
    </div>
  );
}


