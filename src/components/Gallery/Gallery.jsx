import React, { useState, useCallback } from "react";
import Navbar2 from "../navbar/Navbar2";
import "./Gallery.css";

// ── Book pages — each page has a front and back image ────────────────────────
// Pair consecutive Cloudinary photos as front/back of each leaf
const BASE = "https://res.cloudinary.com/mxuy06ca/image/upload/w_800,c_scale,q_auto:best,f_auto/v1/udghosh-23/public/images";

const PAGES = [
  {
    front: { src: `${BASE}/2024/photo1?_a=BAMAPqcg0`, label: "MMXXIV · I" },
    back:  { src: `${BASE}/2024/photo2?_a=BAMAPqcg0`, label: "MMXXIV · II" },
  },
  {
    front: { src: `${BASE}/2024/photo3?_a=BAMAPqcg0`, label: "MMXXIV · III" },
    back:  { src: `${BASE}/2024/photo4?_a=BAMAPqcg0`, label: "MMXXIV · IV" },
  },
  {
    front: { src: `${BASE}/2024/photo5?_a=BAMAPqcg0`, label: "MMXXIV · V" },
    back:  { src: `${BASE}/2024/photo6?_a=BAMAPqcg0`, label: "MMXXIV · VI" },
  },
  {
    front: { src: `${BASE}/2024/photo7?_a=BAMAPqcg0`, label: "MMXXIV · VII" },
    back:  { src: `${BASE}/2023/photo1?_a=BAMAPqcg0`, label: "MMXXIII · I" },
  },
  {
    front: { src: `${BASE}/2023/photo2?_a=BAMAPqcg0`, label: "MMXXIII · II" },
    back:  { src: `${BASE}/2023/photo3?_a=BAMAPqcg0`, label: "MMXXIII · III" },
  },
];

export default function Gallery() {
  const [openPages, setOpenPages] = useState(new Set());

  const togglePage = useCallback((e, idx) => {
    e.stopPropagation();
    setOpenPages(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }, []);

  const closeAll = useCallback(() => {
    setOpenPages(new Set());
  }, []);

  const anyOpen = openPages.size > 0;

  return (
    <div className="gb-root" onClick={closeAll}>
      <Navbar2 />

      {/* Big gothic background text */}
      <div className="gb-bg-type" aria-hidden="true">
        <span>Arcana</span>
        <span>Memoriae</span>
      </div>

      {/* Ambient vignette */}
      <div className="gb-vignette" />

      {/* Floating torch orbs */}
      <div className="gb-torch gb-torch--l" />
      <div className="gb-torch gb-torch--r" />

      {/* The book stack */}
      <div
        className={`gb-book${anyOpen ? " gb-book--open" : ""}`}
        style={{ "--spine-shift": anyOpen ? "120px" : "0px" }}
      >
        {PAGES.map((page, i) => {
          const isOpen = openPages.has(i);
          return (
            <div
              key={i}
              className={`gb-page${isOpen ? " gb-page--open" : ""}`}
              style={{
                "--i": i,
                "--page-rotate": isOpen ? "-180deg" : "0deg",
                zIndex: isOpen ? 20 + i : 10 - i,
              }}
              onClick={(e) => togglePage(e, i)}
            >
              {/* Front face */}
              <div className="gb-face gb-face--front">
                <img src={page.front.src} alt={page.front.label} />
                {/* Gothic ornate overlay */}
                <div className="gb-face-overlay" />
                <div className="gb-corner gb-corner--tl">✦</div>
                <div className="gb-corner gb-corner--tr">✦</div>
                <div className="gb-corner gb-corner--bl">✦</div>
                <div className="gb-corner gb-corner--br">✦</div>
                {/* Spine crack line */}
                <div className="gb-spine-line" />
                <div className="gb-label">{page.front.label}</div>
              </div>

              {/* Back face */}
              <div className="gb-face gb-face--back">
                <img src={page.back.src} alt={page.back.label} />
                <div className="gb-face-overlay" />
                <div className="gb-corner gb-corner--tl">✦</div>
                <div className="gb-corner gb-corner--tr">✦</div>
                <div className="gb-corner gb-corner--bl">✦</div>
                <div className="gb-corner gb-corner--br">✦</div>
                <div className="gb-spine-line" />
                <div className="gb-label">{page.back.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Instruction hint */}
      <p className="gb-hint">✦ &nbsp; Click a page to turn it &nbsp; ✦</p>
    </div>
  );
}