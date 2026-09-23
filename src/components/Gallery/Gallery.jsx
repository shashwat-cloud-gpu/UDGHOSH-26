import React, { useState, useEffect, useRef } from "react";
import Navbar2 from "../navbar/Navbar2";

const cardData = {
  y2024: [
    { src: 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2024/photo1?_a=BAMAPqcg0', alt: '2024 Image 1' },
    { src: 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2024/photo2?_a=BAMAPqcg0', alt: '2024 Image 2' },
    { src: 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2024/photo3?_a=BAMAPqcg0', alt: '2024 Image 3' },
    { src: 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2024/photo4?_a=BAMAPqcg0', alt: '2024 Image 4' },
    { src: 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2024/photo5?_a=BAMAPqcg0', alt: '2024 Image 5' },
    { src: 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2024/photo6?_a=BAMAPqcg0', alt: '2024 Image 6' },
    { src: 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2024/photo7?_a=BAMAPqcg0', alt: '2024 Image 7' },
  ],
  y2023: [
    { src: 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2023/photo1?_a=BAMAPqcg0', alt: '2023 Image 1' },
    { src: 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2023/photo2?_a=BAMAPqcg0', alt: '2023 Image 2' },
    { src: 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2023/photo3?_a=BAMAPqcg0', alt: '2023 Image 3' },
    { src: 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2023/photo4?_a=BAMAPqcg0', alt: '2023 Image 4' },
    { src: 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2023/photo5?_a=BAMAPqcg0', alt: '2023 Image 5' },
    { src: 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2023/photo6?_a=BAMAPqcg0', alt: '2023 Image 6' },
    { src: 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2023/photo7?_a=BAMAPqcg0', alt: '2023 Image 7' },
    { src: 'https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/images/2023/photo8?_a=BAMAPqcg0', alt: '2023 Image 8' },
  ],
};

const GLYPHS = ['✦', '☾', '☉', '⚷', '✧'];
const toRoman = (num) => ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV"][num] || (num + 1);

const allItems = [
  { type: 'gate', year: '2024', id: 'gate-2024', index: 0 },
  ...cardData.y2024.map((c, i) => ({ type: 'photo', year: '2024', ...c, id: `2024-${i}`, index: i })),
  { type: 'gate', year: '2023', id: 'gate-2023', index: 0 },
  ...cardData.y2023.map((c, i) => ({ type: 'photo', year: '2023', ...c, id: `2023-${i}`, index: i })),
];

const Corner = ({ className }) => (
  <svg className={`absolute w-[14px] h-[14px] ${className}`} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0 Q0 0 0 14" stroke="#c9a24b" strokeWidth="2" />
  </svg>
);

function App() {
  const [activeYear, setActiveYear] = useState("2024");
  const activeYearRef = useRef("2024");
  const cardsRef = useRef([]);
  const bgRef = useRef([]);
  const gate2024Ref = useRef(null);
  const gate2023Ref = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animationFrameId;

    if (prefersReducedMotion) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
          }
        });
      }, { threshold: 0.1 });
      
      cardsRef.current.forEach(el => {
        if (el) {
          el.style.opacity = 0;
          observer.observe(el);
        }
      });
      
      return () => observer.disconnect();
    }

    const onScroll = () => {
      const vh = window.innerHeight;
      
      // READ PHASE
      const reads = cardsRef.current.map(el => {
        if (!el) return null;
        const rect = el.parentElement.getBoundingClientRect();
        return rect.top + rect.height / 2;
      });

      // WRITE PHASE
      let minD = Infinity;
      let centerItemYear = activeYearRef.current;

      reads.forEach((elCenterY, i) => {
        if (elCenterY === null) return;
        const el = cardsRef.current[i];
        const item = allItems[i];
        
        const d = elCenterY - vh / 2;
        const p = Math.max(-1.5, Math.min(1.5, d / vh));
        const absP = Math.abs(p);
        
        if (absP * vh < minD) {
          minD = absP * vh;
          centerItemYear = item.year;
        }

        const isNear = absP < 0.15;
        let opacity, blur, scale;
        
        if (isNear) {
          opacity = 1;
          blur = 0;
          scale = 1;
        } else {
          const t = (absP - 0.15) / (1.5 - 0.15);
          opacity = 1 - (1 - 0.25) * t;
          blur = 8 * t;
          scale = 1 - (1 - 0.7) * t;
        }
        
        const tz = -absP * 200;
        
        el.style.transform = `translateZ(${tz}px) scale(${scale})`;
        el.style.opacity = opacity;
        el.style.filter = `blur(${blur}px)`;

        const photo = el.querySelector('.gallery-photo');
        if (photo) {
          if (absP > 0.4) {
            const gt = Math.min(1, (absP - 0.4) / (1.5 - 0.4));
            photo.style.filter = `grayscale(${gt * 100}%) brightness(${1 - gt * 0.4})`;
          } else {
            photo.style.filter = `grayscale(0%) brightness(1)`;
          }
        }
        
        const frame = el.querySelector('.gallery-frame');
        if (frame) {
          frame.style.boxShadow = isNear ? '0 0 24px rgba(201,162,75,0.35)' : 'none';
        }
      });

      // Background parallax
      bgRef.current.forEach((bg) => {
        if (!bg) return;
        const rect = bg.parentElement.getBoundingClientRect();
        const d = (rect.top + rect.height / 2) - vh / 2;
        const offset = d * 0.4; // d * 0.4 counters the scroll to make it move at 0.6x
        bg.style.transform = `translateY(${offset}px)`;
      });

      if (centerItemYear !== activeYearRef.current) {
        activeYearRef.current = centerItemYear;
        setTimeout(() => setActiveYear(centerItemYear), 0);
      }
    };

    const loop = () => {
      onScroll();
      animationFrameId = requestAnimationFrame(loop);
    };
    loop();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleYearChange = (year) => {
    setActiveYear(year);
    activeYearRef.current = year;
    const target = year === '2024' ? gate2024Ref.current : gate2023Ref.current;
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div 
      className="app-root min-h-screen relative font-inter text-[#ece4d3]"
      style={{ 
        backgroundColor: '#07090a', 
        backgroundImage: "url('https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/background?_a=BAMAPqcg0')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        overflowX: 'hidden'
      }}
    >
      {/* CSS overrides for gallery elements */}
      <style>{`
        .corridor-row {
          display: flex;
          align-items: center;
          height: 100vh;
          width: 100%;
          position: relative;
          justify-content: center;
        }
        @media (min-width: 640px) {
          .corridor-row.align-left { justify-content: flex-start; padding-left: 15%; }
          .corridor-row.align-right { justify-content: flex-end; padding-right: 15%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .card-content {
            transition: opacity 0.8s ease-out;
            transform: none !important;
            filter: none !important;
          }
          .card-parallax-bg { transform: none !important; }
        }
      `}</style>

      <Navbar2 />

      {/* Year Toggle */}
      <div className="fixed top-[12vh] left-1/2 -translate-x-1/2 z-50 pointer-events-auto flex gap-1 bg-[#151b1a]/80 backdrop-blur-md px-3 py-2 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-[#c9a24b]/30">
        {["2024", "2023"].map((year) => (
          <button
            key={year}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${activeYear === year
                ? "bg-[#c9a24b] text-[#07090a] shadow-[0_0_15px_rgba(201,162,75,0.4)]"
                : "text-[#ece4d3] hover:text-white hover:bg-white/10"
              }`}
            onClick={() => handleYearChange(year)}
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Corridor Centerline */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] z-0" 
           style={{ background: 'linear-gradient(to bottom, transparent, rgba(61, 218, 208, 0.15) 5%, rgba(61, 218, 208, 0.15) 95%, transparent)' }} />

      {/* Scrollable Corridor */}
      <div className="relative w-full max-w-[1200px] mx-auto z-10" style={{ perspective: '1200px' }} ref={containerRef}>
        {allItems.map((item, i) => {
          
          if (item.type === 'gate') {
            return (
              <div 
                key={item.id} 
                ref={item.year === '2024' ? gate2024Ref : gate2023Ref}
                className="corridor-row"
              >
                <div 
                  ref={el => cardsRef.current[i] = el}
                  className="card-content flex items-center justify-center relative w-full h-full"
                  style={{ transformOrigin: 'center center', willChange: 'transform, opacity, filter' }}
                >
                  <div className="gate-arch flex items-center justify-center" style={{
                      width: 'min(90vw, 500px)',
                      height: 'min(80vh, 700px)',
                      backgroundColor: '#151b1a',
                      border: '2px solid rgba(201,162,75,0.6)',
                      borderBottom: 'none',
                      borderTopLeftRadius: '250px',
                      borderTopRightRadius: '250px',
                      boxShadow: 'inset 0 0 80px rgba(0,0,0,0.9), 0 0 30px rgba(0,0,0,0.5)',
                      backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8))'
                  }}>
                      <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(4rem, 10vw, 6rem)', color: '#c9a24b', textShadow: '0 0 20px rgba(201,162,75,0.5)' }}>
                        {item.year}
                      </h2>
                  </div>
                </div>
              </div>
            );
          }

          // Photo Card
          const isLeft = i % 2 !== 0;
          return (
            <div key={item.id} className={`corridor-row ${isLeft ? 'align-left' : 'align-right'}`}>
              
              {/* Center Dot for the hallway line */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[#3ddad0] shadow-[0_0_8px_#3ddad0]" />

              <div className="relative flex items-center justify-center">
                {/* Parallax Stone Arch Background */}
                <div 
                  ref={el => bgRef.current[i] = el}
                  className="card-parallax-bg absolute z-0"
                  style={{
                    width: '340px',
                    height: '480px',
                    backgroundColor: '#1b2624',
                    border: '1px solid rgba(201, 162, 75, 0.4)',
                    borderBottom: 'none',
                    borderTopLeftRadius: '170px',
                    borderTopRightRadius: '170px',
                    willChange: 'transform',
                    boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)'
                  }}
                />

                {/* 3D Transformed Card Content */}
                <div 
                  ref={el => cardsRef.current[i] = el}
                  className="card-content relative z-10 flex flex-col items-center"
                  style={{ transformOrigin: 'center center', willChange: 'transform, opacity, filter' }}
                >
                  <div className="gallery-frame relative p-[4px] box-border transition-shadow duration-300" style={{
                    border: '3px solid #c9a24b',
                    background: '#151b1a'
                  }}>
                    <div className="relative w-full h-full" style={{ border: '1px solid rgba(201,162,75,0.7)' }}>
                      <img 
                        className="gallery-photo object-cover block transition-all duration-300"
                        style={{ width: '280px', height: '380px' }}
                        src={item.src} 
                        alt={item.alt} 
                        loading="lazy"
                      />
                    </div>
                    
                    {/* Corner Ornaments */}
                    <Corner className="-top-[6px] -left-[6px]" />
                    <Corner className="-top-[6px] -right-[6px] scale-x-[-1]" />
                    <Corner className="-bottom-[6px] -left-[6px] scale-y-[-1]" />
                    <Corner className="-bottom-[6px] -right-[6px] scale-[-1]" />
                  </div>

                  {/* Museum Plaque */}
                  <div className="absolute -bottom-10 flex items-center gap-4 px-5 py-1.5 shadow-[0_4px_10px_rgba(0,0,0,0.5)] whitespace-nowrap" style={{
                    background: '#151b1a',
                    border: '1px solid rgba(201,162,75,0.8)'
                  }}>
                    <span style={{ fontFamily: "'Cinzel', serif", color: '#c9a24b', fontSize: '1.1rem' }}>
                      {toRoman(item.index)}
                    </span>
                    <span style={{ fontSize: '0.6rem', color: '#3ddad0' }}>
                      {GLYPHS[item.index % GLYPHS.length]}
                    </span>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: '2px', color: '#ece4d3', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                      Edition {item.year}
                    </span>
                  </div>

                </div>
              </div>

            </div>
          );
        })}
        {/* Extra padding at bottom to let the last item scroll fully to center */}
        <div style={{ height: '50vh' }} />
      </div>
    </div>
  );
}

export default App;