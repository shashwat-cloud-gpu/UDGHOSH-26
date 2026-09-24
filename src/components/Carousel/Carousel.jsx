import React, { useState, useEffect, useRef } from 'react';
import './Carousel.css';
// These image imports assume you have a local folder structure.
// For a live environment, you would use URLs.
const img1 = 'https://res.cloudinary.com/mxuy06ca/image/upload/w_3840,c_scale,q_auto:best,f_auto/v1/udghosh-23/src/components/Carousel/images/1';
const img2 = 'https://res.cloudinary.com/mxuy06ca/image/upload/w_3840,c_scale,q_auto:best,f_auto/v1/udghosh-23/src/components/Carousel/images/2';
const img3 = 'https://res.cloudinary.com/mxuy06ca/image/upload/w_3840,c_scale,q_auto:best,f_auto/v1/udghosh-23/src/components/Carousel/images/3';
const img4 = 'https://res.cloudinary.com/mxuy06ca/image/upload/w_3840,c_scale,q_auto:best,f_auto/v1/udghosh-23/src/components/Carousel/images/4';
const img5 = 'https://res.cloudinary.com/mxuy06ca/image/upload/w_3840,c_scale,q_auto:best,f_auto/v1/udghosh-23/src/components/Carousel/images/5';
const img6 = 'https://res.cloudinary.com/mxuy06ca/image/upload/w_3840,c_scale,q_auto:best,f_auto/v1/udghosh-23/src/components/Carousel/images/6';
const img7 = 'https://res.cloudinary.com/mxuy06ca/image/upload/w_3840,c_scale,q_auto:best,f_auto/v1/udghosh-23/src/components/Carousel/images/7';

export default function Carousel() {
  const cardData = [
    { id: 1, title: 'Esports', image: img1, url: 'https://esports.udghosh.org.in/' },
    { id: 2, title: 'Social Initiatives', image: img2, url: 'https://udghosh.org.in/social' },
    { id: 3, title: 'Pro Shows', image: img3, url: '/past-events' },
    { id: 4, title: 'Competitons', image: img4, url: 'https://events.udghosh.org.in/' },
    { id: 5, title: 'Antique', image: img5, url: 'https://udghosh.org.in/antique' },
    { id: 6, title: 'Gallery', image: img6, url: 'https://udghosh.org.in/gallery' },
    { id: 7, title: 'UNOSQ', image: img7, url: 'https://unosq.udghosh.org.in/' },
  ];

  const [activeIndex, setActiveIndex] = useState(Math.floor(cardData.length / 2));
  const intervalRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const next = () => setActiveIndex((prev) => (prev + 1) % cardData.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + cardData.length) % cardData.length);

  const resetAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      next();
    }, 3000);
  };

  useEffect(() => {
    resetAutoScroll();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCardClick = (index, url) => {
    if (index === activeIndex) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      setActiveIndex(index);
      resetAutoScroll();
    }
  };

  const handlePrevClick = () => {
    prev();
    resetAutoScroll();
  };

  const handleNextClick = () => {
    next();
    resetAutoScroll();
  };

  const getCardStyles = (index) => {
    const offset = index - activeIndex;
    const half = Math.floor(cardData.length / 2);
    let displayOffset = offset;

    if (Math.abs(offset) > half) {
      displayOffset = offset > 0 ? offset - cardData.length : offset + cardData.length;
    }
    
    const zIndex = cardData.length - Math.abs(displayOffset);

    // ✨ --- START OF CHANGES --- ✨
    // Increased the mobile translateY and rotate values for a more pronounced S-curve.
    // I also slightly reduced translateX to keep the horizontal spacing tighter.
    const translateX = displayOffset * (isMobile ? 30 : 15); 
    const translateY = displayOffset * (isMobile ? 25 : 15); 
    const rotate = displayOffset * (isMobile ? 15 : 15); 
    const scale = 1 - Math.abs(displayOffset) * (isMobile ? 0.15 : 0.12);
    // ✨ --- END OF CHANGES --- ✨

    const transform = `translateX(${translateX}%) translateY(${translateY}%) rotate(${rotate}deg) scale(${scale})`;

    return {
      transform,
      zIndex,
      opacity: 1,
      position: 'absolute',
      transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
      cursor: 'pointer',
    };
  };

  return (
    <div className="carousel relative bg-gradient-to-br from-[#000000] via-[#000c43] to-black animate-gradientShift" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="absolute z-[5] top-0 left-0 h-screen w-screen bg-gradient-to-b from-black via-transparent to-transparent"></div>
      <h1 id="textblock-title" className='pb-12 relative z-10' style={{ fontFamily: "'Cinzel', serif" }}>WEBSITES</h1>
      <button className='pointer-events-auto hidden sm:block' id="prev-btn" onClick={handlePrevClick} style={{ position: 'absolute', left: 10, top: '50%', zIndex: 99, transform: 'translateY(-50%)' }}>
        <img className='w-8' src="https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/icons8-double-left-24?_a=BAMAPqcg0" alt="" />
      </button>
      <button className='pointer-events-auto hidden sm:block' id="next-btn" onClick={handleNextClick} style={{ position: 'absolute', right: 10, top: '50%', zIndex: 99, transform: 'translateY(-50%)' }}>
        <img className='w-8' src="https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/icons8-double-right-30?_a=BAMAPqcg0" alt="" />
      </button>

      <div id="carousel-container" style={{ position: 'relative', height: '400px', perspective: '1000px' }}>
        {cardData.map((card, index) => (
          <div
            key={card.id}
            className={`carousel-card_1-wrapper cursor-pointer ${isMobile ? 'mobile' : ''}`}
            style={getCardStyles(index)}
            onClick={() => onCardClick(index, card.url)}
          >
            <div className={`card_1 ${isMobile ? 'mobile' : ''}`}>
              <img src={card.image} alt={card.title} />
              <div className="card_1-overlay"></div>
              <div className="card_1-content">
                <div className="card_1-number">
                  <span>{String(card.id).padStart(2, '0')}</span>
                </div>
                <div className="card_1-arrow">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </div>
                <div className="card_1-title">
                  <h2>{card.title}</h2>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

