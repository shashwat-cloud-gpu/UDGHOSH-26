import React, { useEffect, useRef, useState } from "react";
import Navbar2 from "../navbar/Navbar2.jsx";
import Footer2 from "../Footer2/Footer2.jsx";
import "./antique.css";

// Official historical records sourced exclusively from udghosh.org.in/antique
const EDITIONS = [
  {
    id: "edition-2023",
    year: "2023",
    date: "October, 2023",
    roman: "XIX",
    edition: "19th Edition",
    theme: "The Colosseum's Conquest",
    title: "The Colosseum's Conquest, 19th Edition",
    description:
      "Udghosh'23, themed “The Colosseum's Conquest” is ready to take forward the legacy to be the flag bearer of intercollegiate sports and is all set to commence on October 6 amidst an electrifying buzz among the college community across the country.",
    accentColor: "#d97706",
  },
  {
    id: "edition-2022",
    year: "2022",
    date: "October, 2022",
    roman: "XVIII",
    edition: "18th Edition",
    theme: "The Paladin's Imperium",
    title: "The Paladin's Imperium, 18th Edition",
    description:
      "The 2022 edition invited Dronacharya award recipient and formal chief national coach, Mr. Vimal Kumar, on the occasion of teacher’s day. Other fun events like Freestyle Football and MTV hustle graced by famous names such as Shlovij, KhullarG, and Prakhar Gupta. EDM night by a renowned DJ to blend heart-pounding music with crazy dance moves.",
    accentColor: "#0284c7",
  },
  {
    id: "edition-2021",
    year: "2021",
    date: "April, 2021",
    roman: "XVII",
    edition: "17th Edition",
    theme: "The Phoenix's Desideratum",
    title: "The Phoenix's Desideratum, 17th Edition",
    description:
      "The 2021 edition witnessed some great events and inspiring talks by even greater personalities such as Avadh Ojha, Prakash Padukone, Kiran Bedi, Sangeeta Sindhi Bahl, Sharad Kumar.",
    accentColor: "#ea580c",
  },
  {
    id: "edition-2019",
    year: "2019",
    date: "September, 2019",
    roman: "XVI",
    edition: "16th Edition",
    theme: "Morior Invictus",
    title: "Morior Invictus, 16th Edition",
    description:
      "Udghosh 2019 organises 22 sports events with a huge participation of both boys and girls from over 200 colleges across the country. To provide talent the right push forward with elements of inspiration, Udghosh also plays host to some of the most renowned sports personalities.",
    accentColor: "#e11d48",
  },
  {
    id: "edition-2018",
    year: "2018",
    date: "October, 2018",
    roman: "XV",
    edition: "15th Edition",
    theme: "Chants Of Cachet",
    title: "Chants Of Cachet, 15th Edition",
    description:
      "The 2018 edition of Udghosh saw various mind-boggling performances, including standups by Nishant Tanwar and Aakash Gupta.",
    accentColor: "#9333ea",
  },
  {
    id: "edition-2017",
    year: "2017",
    date: "October, 2017",
    roman: "XIV",
    edition: "14th Edition",
    theme: "Mayhem For Victory",
    title: "Mayhem For Victory, 14th Edition",
    description:
      "The 2017 edition was one of its kind, had registered great events and even greater personalities, such as an inspiring talk by Abhinav Bindra. Also had participation from Gaurav Taneja and sports personalities such as Nuzhat Parween.",
    accentColor: "#059669",
  },
];

// Authentic Ancient Stone Tablet Slab
function StoneArtifactCard({ item, index, isVisible, isActive }) {
  const isEven = index % 2 === 1;

  return (
    <div
      id={item.id}
      className={`relative flex flex-col md:flex-row items-center justify-between my-10 md:my-20 card-entry-anim ${
        isVisible ? "is-in-view" : ""
      } ${isEven ? "md:flex-row-reverse" : ""}`}
    >
      {/* Ancient Stone Tablet Slab */}
      <div className="w-full md:w-[46%] pl-10 md:pl-0">
        <div className="ancient-stone-slab p-3 sm:p-4">
          <div className="ancient-stone-inner p-5 sm:p-7">
            {/* Header: Date & Edition Marker */}
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="ancient-stone-meta">
                {item.date}
              </span>
              <span className="ancient-stone-meta">
                {item.edition}
              </span>
            </div>

            <div className="stone-groove-line my-3" />

            {/* Chiseled Title in Natural Case */}
            <h2 className="text-xl sm:text-2xl font-bold mb-3.5 ancient-stone-heading leading-snug">
              {item.title}
            </h2>

            {/* Official Text Carved in Stone in Natural Case */}
            <p className="ancient-stone-body">
              {item.description}
            </p>
          </div>
        </div>
      </div>

      {/* Central Carved Stone Milestone Node */}
      <div className="absolute left-2 md:left-1/2 -translate-x-1/2 flex items-center justify-center z-20">
        <div
          className={`ancient-stone-node w-11 h-11 sm:w-13 sm:h-13 rounded-full flex flex-col items-center justify-center transition-all ${
            isActive ? "node-active" : ""
          }`}
          title={`${item.title} (${item.year})`}
        >
          <span className="text-xs text-amber-200 font-bold tracking-tight">
            {item.roman}
          </span>
          <span className="text-[9px] font-mono text-slate-400">
            '{item.year.slice(2)}
          </span>
        </div>
      </div>

      {/* Counterbalance Spacer Side for Desktop Symmetry */}
      <div className="hidden md:block w-[46%]" />
    </div>
  );
}

// Background Floating Embers Animation (Canvas Engine)
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

    const emberCount = 32;
    const embers = Array.from({ length: emberCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.8,
      speedY: Math.random() * 0.45 + 0.2,
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.6 + 0.2,
      fadeSpeed: Math.random() * 0.008 + 0.003,
      color: Math.random() > 0.4 ? "245, 158, 11" : "217, 119, 6",
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      embers.forEach((ember) => {
        ember.y -= ember.speedY;
        ember.x += ember.speedX;
        ember.opacity += ember.fadeSpeed;

        if (ember.opacity > 0.75 || ember.opacity < 0.15) {
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

  return <canvas ref={canvasRef} className="antique-embers-canvas" />;
}

export default function Antique() {
  const [revealedIds, setRevealedIds] = useState(new Set());
  const [activeEditionId, setActiveEditionId] = useState("edition-2023");
  const [scrollProgress, setScrollProgress] = useState(0);
  const timelineRef = useRef(null);

  // Track timeline vertical scroll progress
  useEffect(() => {
    window.scrollTo(0, 0);

    const handleScroll = () => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalHeight = rect.height;
      const topOffset = rect.top;

      // Calculate progress percentage down the timeline
      const passed = viewportHeight * 0.5 - topOffset;
      const progress = Math.max(0, Math.min(100, (passed / totalHeight) * 100));
      setScrollProgress(progress);

      // Determine active edition based on scroll position
      const elements = EDITIONS.map((ed) => ({
        id: ed.id,
        el: document.getElementById(ed.id),
      }));

      for (let i = elements.length - 1; i >= 0; i--) {
        const item = elements[i];
        if (item.el) {
          const itemRect = item.el.getBoundingClientRect();
          if (itemRect.top <= viewportHeight * 0.55) {
            setActiveEditionId(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // IntersectionObserver for staggered card reveal
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealedIds((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.12 }
    );

    const cards = document.querySelectorAll(".card-entry-anim");
    cards.forEach((card) => observer.observe(card));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="antique-page-root">
      {/* ── Background Castle Architecture ── */}
      <img
        src="/images/antique_bg.jpg"
        alt=""
        className="antique-bg-image"
        loading="eager"
      />

      {/* Subtle Lighting Transitions for Navbar and Footer */}
      <div className="antique-ambient-lighting" />

      {/* Floating Castle Embers Canvas */}
      <AmbientEmbersCanvas />

      {/* ── Foreground Content Layer (Z-10) ── */}
      <div className="relative z-10">
        {/* Header Navigation */}
        <Navbar2 />

        {/* Hero Section */}
        <header className="pt-36 pb-12 px-4 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold ancient-stone-title mb-4">
            Chronicles of Udghosh
          </h1>

          <p className="ancient-stone-subtitle text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            An archival chronicle of past Udghosh editions and collegiate sports heritage.
          </p>

          <div className="stone-groove-line max-w-xs mx-auto my-6" />
        </header>

        {/* Main Interactive Timeline Showcase */}
        <main
          ref={timelineRef}
          className="max-w-5xl mx-auto px-4 sm:px-6 pb-28 relative"
        >
          {/* Vertical Timeline Track with Scroll Progress Indicator */}
          <div className="absolute left-2 md:left-1/2 -translate-x-1/2 top-4 bottom-12 w-0.5 timeline-track-base z-0">
            <div
              className="w-full timeline-track-fill"
              style={{ height: `${scrollProgress}%` }}
            />
          </div>

          {/* Chronological Stone Artifact Slabs */}
          <div className="relative z-10">
            {EDITIONS.map((item, index) => (
              <StoneArtifactCard
                key={item.id}
                item={item}
                index={index}
                isVisible={revealedIds.has(item.id)}
                isActive={activeEditionId === item.id}
              />
            ))}
          </div>
        </main>

        {/* Site Footer */}
        <Footer2 />
      </div>
    </div>
  );
}
