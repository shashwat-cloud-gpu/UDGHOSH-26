import React, { useEffect, useRef } from "react";
import Navbar2 from "../navbar/Navbar2";
import "./Gallery.css";

// ── Image data (existing Cloudinary URLs) ─────────────────────────────────────
const TILES = [
  {
    src: "https://res.cloudinary.com/mxuy06ca/image/upload/w_1200,c_scale,q_auto:best,f_auto/v1/udghosh-23/public/images/2024/photo1?_a=BAMAPqcg0",
    alt: "Udghosh 2024 — I",
    year: "MMXXIV",
    style: { height: "14%", width: "20%", left: "5%",  top: "5%"  },
  },
  {
    src: "https://res.cloudinary.com/mxuy06ca/image/upload/w_1200,c_scale,q_auto:best,f_auto/v1/udghosh-23/public/images/2024/photo2?_a=BAMAPqcg0",
    alt: "Udghosh 2024 — II",
    year: "MMXXIV",
    style: { height: "24%", width: "14%", left: "42%", top: "12%" },
  },
  {
    src: "https://res.cloudinary.com/mxuy06ca/image/upload/w_1200,c_scale,q_auto:best,f_auto/v1/udghosh-23/public/images/2024/photo3?_a=BAMAPqcg0",
    alt: "Udghosh 2024 — III",
    year: "MMXXIV",
    style: { height: "18%", width: "16%", left: "12%", top: "34%" },
  },
  {
    src: "https://res.cloudinary.com/mxuy06ca/image/upload/w_1200,c_scale,q_auto:best,f_auto/v1/udghosh-23/public/images/2024/photo4?_a=BAMAPqcg0",
    alt: "Udghosh 2024 — IV",
    year: "MMXXIV",
    style: { height: "14%", width: "12%", left: "45%", top: "48%" },
  },
  {
    src: "https://res.cloudinary.com/mxuy06ca/image/upload/w_1200,c_scale,q_auto:best,f_auto/v1/udghosh-23/public/images/2024/photo5?_a=BAMAPqcg0",
    alt: "Udghosh 2024 — V",
    year: "MMXXIV",
    style: { height: "16%", width: "32%", left: "8%",  top: "70%" },
  },
  {
    src: "https://res.cloudinary.com/mxuy06ca/image/upload/w_1200,c_scale,q_auto:best,f_auto/v1/udghosh-23/public/images/2024/photo6?_a=BAMAPqcg0",
    alt: "Udghosh 2024 — VI",
    year: "MMXXIV",
    style: { height: "24%", width: "24%", left: "68%", top: "8%"  },
  },
  {
    src: "https://res.cloudinary.com/mxuy06ca/image/upload/w_1200,c_scale,q_auto:best,f_auto/v1/udghosh-23/public/images/2024/photo7?_a=BAMAPqcg0",
    alt: "Udghosh 2024 — VII",
    year: "MMXXIV",
    style: { height: "16%", width: "20%", left: "50%", top: "74%" },
  },
  {
    src: "https://res.cloudinary.com/mxuy06ca/image/upload/w_1200,c_scale,q_auto:best,f_auto/v1/udghosh-23/public/images/2023/photo1?_a=BAMAPqcg0",
    alt: "Udghosh 2023 — I",
    year: "MMXXIII",
    style: { height: "24%", width: "18%", left: "72%", top: "42%" },
  },
  {
    src: "https://res.cloudinary.com/mxuy06ca/image/upload/w_1200,c_scale,q_auto:best,f_auto/v1/udghosh-23/public/images/2023/photo2?_a=BAMAPqcg0",
    alt: "Udghosh 2023 — II",
    year: "MMXXIII",
    style: { height: "10%", width: "8%",  left: "84%", top: "84%" },
  },
  {
    src: "https://res.cloudinary.com/mxuy06ca/image/upload/w_1200,c_scale,q_auto:best,f_auto/v1/udghosh-23/public/images/2023/photo3?_a=BAMAPqcg0",
    alt: "Udghosh 2023 — III",
    year: "MMXXIII",
    style: { height: "18%", width: "22%", left: "28%", top: "6%"  },
  },
  {
    src: "https://res.cloudinary.com/mxuy06ca/image/upload/w_1200,c_scale,q_auto:best,f_auto/v1/udghosh-23/public/images/2023/photo4?_a=BAMAPqcg0",
    alt: "Udghosh 2023 — IV",
    year: "MMXXIII",
    style: { height: "20%", width: "14%", left: "60%", top: "56%" },
  },
  {
    src: "https://res.cloudinary.com/mxuy06ca/image/upload/w_1200,c_scale,q_auto:best,f_auto/v1/udghosh-23/public/images/2023/photo5?_a=BAMAPqcg0",
    alt: "Udghosh 2023 — V",
    year: "MMXXIII",
    style: { height: "14%", width: "18%", left: "32%", top: "56%" },
  },
  {
    src: "https://res.cloudinary.com/mxuy06ca/image/upload/w_1200,c_scale,q_auto:best,f_auto/v1/udghosh-23/public/images/2023/photo6?_a=BAMAPqcg0",
    alt: "Udghosh 2023 — VI",
    year: "MMXXIII",
    style: { height: "22%", width: "16%", left: "78%", top: "68%" },
  },
];

export default function Gallery() {
  const galleryRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    const onMouseMove = (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const xDecimal = mouseX / window.innerWidth;
      const yDecimal = mouseY / window.innerHeight;

      const maxX = gallery.offsetWidth  - window.innerWidth;
      const maxY = gallery.offsetHeight - window.innerHeight;

      const panX = maxX * xDecimal * -1;
      const panY = maxY * yDecimal * -1;

      if (animRef.current) animRef.current.cancel?.();
      animRef.current = gallery.animate(
        { transform: `translate(${panX}px, ${panY}px)` },
        { duration: 4000, fill: "forwards", easing: "ease" }
      );
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <div className="gallery-root">
      <Navbar2 />

      {/* Dungeon ambient overlay */}
      <div className="gallery-vignette" />

      {/* Floating torchlight orbs for atmosphere */}
      <div className="torch-glow torch-glow--left"  />
      <div className="torch-glow torch-glow--right" />

      {/* The pannable canvas */}
      <div className="gallery-canvas" ref={galleryRef}>
        {TILES.map((tile, i) => (
          <div key={i} className="gallery-tile" style={tile.style}>
            {/* Gothic arch top cutout */}
            <div className="tile-arch" />

            {/* Outer ornate frame */}
            <div className="tile-frame">
              {/* Corner gargoyle bosses */}
              <span className="corner corner--tl">✦</span>
              <span className="corner corner--tr">✦</span>
              <span className="corner corner--bl">✦</span>
              <span className="corner corner--br">✦</span>

              {/* Inner frame line */}
              <div className="tile-frame-inner">
                <img src={tile.src} alt={tile.alt} className="tile-img" />
                {/* Sepia overlay for vintage look */}
                <div className="tile-sepia" />
              </div>
            </div>

            {/* Museum plaque */}
            <div className="tile-plaque">
              <span className="tile-plaque-year">{tile.year}</span>
              <span className="tile-plaque-divider">·</span>
              <span className="tile-plaque-alt">{tile.alt}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Header title */}
      <div className="gallery-header">
        <h1 className="gallery-title">ARCANA ASCENSION</h1>
        <p className="gallery-subtitle">✦ &nbsp; GALLERY OF MEMORIAE &nbsp; ✦</p>
      </div>
    </div>
  );
}