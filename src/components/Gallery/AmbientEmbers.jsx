import React, { useEffect, useRef } from "react";

export default function AmbientEmbers() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrameId;
    let particles = [];
    const count = 35;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -(Math.random() * 0.7 + 0.2),
        alpha: Math.random() * 0.6 + 0.2,
        decay: Math.random() * 0.003 + 0.001,
        color: Math.random() > 0.35 ? "rgba(0, 242, 254," : "rgba(212, 175, 55,"
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.y < -10) {
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + 10;
          p.alpha = Math.random() * 0.6 + 0.2;
        }

        ctx.fillStyle = `${p.color} ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="gothic-ambient-canvas" />;
}
