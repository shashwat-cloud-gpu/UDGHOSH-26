import React, { useState, useCallback, useEffect } from "react";
import Navbar2 from "../navbar/Navbar2";
import "./Gallery.css";

const BASE = "https://res.cloudinary.com/mxuy06ca/image/upload/w_800,c_scale,q_auto:best,f_auto/v1/udghosh-23/public/images";

const PAGES_2025 = [
  {
    front: { src: `${BASE}/2024/photo1?_a=BAMAPqcg0`, label: "MMXXV · I" },
    back:  { src: `${BASE}/2024/photo2?_a=BAMAPqcg0`, label: "MMXXV · II" },
  },
  {
    front: { src: `${BASE}/2024/photo3?_a=BAMAPqcg0`, label: "MMXXV · III" },
    back:  { src: `${BASE}/2024/photo4?_a=BAMAPqcg0`, label: "MMXXV · IV" },
  },
  {
    front: { src: `${BASE}/2024/photo5?_a=BAMAPqcg0`, label: "MMXXV · V" },
    back:  { src: `${BASE}/2024/photo6?_a=BAMAPqcg0`, label: "MMXXV · VI" },
  },
  {
    front: { src: `${BASE}/2024/photo7?_a=BAMAPqcg0`, label: "MMXXV · VII" },
    back:  { src: `${BASE}/2024/photo1?_a=BAMAPqcg0`, label: "MMXXV · VIII" },
  },
];

const PAGES_2024 = [
  {
    front: { src: `${BASE}/2023/photo1?_a=BAMAPqcg0`, label: "MMXXIV · I" },
    back:  { src: `${BASE}/2023/photo2?_a=BAMAPqcg0`, label: "MMXXIV · II" },
  },
  {
    front: { src: `${BASE}/2023/photo3?_a=BAMAPqcg0`, label: "MMXXIV · III" },
    back:  { src: `${BASE}/2023/photo4?_a=BAMAPqcg0`, label: "MMXXIV · IV" },
  },
  {
    front: { src: `${BASE}/2023/photo5?_a=BAMAPqcg0`, label: "MMXXIV · V" },
    back:  { src: `${BASE}/2023/photo6?_a=BAMAPqcg0`, label: "MMXXIV · VI" },
  },
];

const Book = ({ title, pages }) => {
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

  // Close all pages if click bubbles to document
  useEffect(() => {
    const closeAll = () => setOpenPages(new Set());
    document.addEventListener("click", closeAll);
    return () => document.removeEventListener("click", closeAll);
  }, []);

  const anyOpen = openPages.size > 0;

  return (
    <div className="gb-book-wrapper" onClick={(e) => e.stopPropagation()}>
      <h2 className="gb-book-title">✦ {title} ✦</h2>
      <div
        className={`gb-book${anyOpen ? " gb-book--open" : ""}`}
        style={{ "--spine-shift": anyOpen ? "50px" : "0px" }}
      >
        {pages.map((page, i) => {
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
              <div className="gb-face gb-face--front">
                <img src={page.front.src} alt={page.front.label} />
                <div className="gb-face-overlay" />
                <div className="gb-corner gb-corner--tl">✦</div>
                <div className="gb-corner gb-corner--tr">✦</div>
                <div className="gb-corner gb-corner--bl">✦</div>
                <div className="gb-corner gb-corner--br">✦</div>
                <div className="gb-spine-line" />
                <div className="gb-label">{page.front.label}</div>
              </div>

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
    </div>
  );
};

export default function Gallery() {
  return (
    <div className="gb-root">
      <Navbar2 />

      {/* Big gothic background text - Shortened as requested */}
      <div className="gb-bg-type" aria-hidden="true">
        <span>Lost</span>
        <span>Lore</span>
      </div>

      <div className="gb-vignette" />
      <div className="gb-torch gb-torch--l" />
      <div className="gb-torch gb-torch--r" />

      <div className="gb-books-container">
        <Book title="EDITION 2025" pages={PAGES_2025} />
        <Book title="EDITION 2024" pages={PAGES_2024} />
      </div>

      <p className="gb-hint">✦ &nbsp; Click a page to turn it &nbsp; ✦</p>
    </div>
  );
}