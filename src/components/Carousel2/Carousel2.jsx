import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './index.css';

gsap.registerPlugin(ScrollTrigger);

// --- Data for the carousel cards ---
const imageData = [
  "https://live.staticflickr.com/65535/54021765727_31d26a1946_h.jpg",
  "https://live.staticflickr.com/65535/54022645366_285aa35812_h.jpg",
  "https://live.staticflickr.com/65535/54023095970_7c6daf3c00_b.jpg",
  "https://live.staticflickr.com/65535/54022646216_69248d7373_b.jpg",
  "https://live.staticflickr.com/65535/54023095795_157a80d716_b.jpg",
];

export default function HelicalCarousel() {
  const componentRef = useRef(null);
  const carouselRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const scene = sceneRef.current;
      if (!scene) return;

      // ✨ CHANGE: Read card dimensions from computed CSS styles
      // This makes the animation aware of changes from media queries.
      const computedStyle = getComputedStyle(scene);
      const cardWidth = parseFloat(computedStyle.getPropertyValue('--card-width'));
      const cardHeight = parseFloat(computedStyle.getPropertyValue('--card-height'));

      // --- Define carousel geometry (now dynamically) ---
      const cardCount = imageData.length;
      const angle = 360 / cardCount;
      const radius = 1.75 * Math.round((cardWidth / 2) / Math.tan(Math.PI / cardCount));
      const verticalStep = -100 + Math.round(cardHeight * 1.05);
      const maxTilt = 20;

      const carousel = carouselRef.current;
      const cards = gsap.utils.toArray(".carousel-card");

      gsap.set(carousel, { transform: `translateZ(-${radius}px)` });
      
      cards.forEach((card, i) => {
          const initialCardRotationY = i * angle;
          const initialCardTranslateY = i * verticalStep;
          const initialOpacity = i === 0 ? 1 : 0.4;
          
          gsap.set(card, {
              transform: `rotateY(${initialCardRotationY}deg) translateZ(${radius}px) translateY(${initialCardTranslateY}px)`,
              opacity: initialOpacity,
          });
      });

      gsap.to(carousel, {
        translateY: (cardCount - 1) * -verticalStep,
        rotateY: (cardCount - 1) * -angle,
        ease: "none",
        scrollTrigger: {
          trigger: componentRef.current,
          start: "top top",
          end: `+=${(cardCount - 1) * 100}%`,
          pin: sceneRef.current,
          scrub: 1,
          invalidateOnRefresh: true, // This re-runs the logic on resize
          onUpdate: (self) => {
            const currentIndex = self.progress * (cardCount - 1);
            cards.forEach((card, i) => {
              const initialCardRotationY = i * angle;
              const initialCardTranslateY = i * verticalStep;
              
              const viewAngle = (i - currentIndex) * angle;
              const tiltY = -Math.sin(viewAngle * Math.PI / 180) * maxTilt;
              const finalCardRotationY = initialCardRotationY + tiltY;
              
              const opacity = 0.4 + 0.6 * (Math.cos(viewAngle * Math.PI / 180) + 1) / 2;

              gsap.set(card, {
                transform: `rotateY(${finalCardRotationY}deg) translateZ(${radius}px) translateY(${initialCardTranslateY}px)`,
                opacity: opacity,
              });
            });
          },
        },
      });
    }, componentRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="helical-carousel-component  bg-gradient-to-b from-[#000000] via-[#000c3e] to-[#000000] animate-gradientShift" ref={componentRef}>
      <div className="carousel-scene" ref={sceneRef}>
        <div className="carousel" ref={carouselRef}>
          {imageData.map((imageUrl, i) => (
            <div className="carousel-card" key={i}>
              <img src={imageUrl} alt={`Carousel Image ${i + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}