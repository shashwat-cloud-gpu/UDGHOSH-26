import React, { useState, useEffect } from "react";
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

function App() {
  const [activeYear, setActiveYear] = useState("2024");
  const [currentCards, setCurrentCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const dataKey = `y${activeYear}`;
    const data = cardData[dataKey] || cardData.y2024;
    setCurrentCards(data);
    setCurrentIndex(Math.floor(data.length / 2));
  }, [activeYear]);

  useEffect(() => {
    let isThrottled = false;
    const handleWheel = (event) => {
      event.preventDefault();
      if (isThrottled) return;

      if (event.deltaY > 0) {
        setCurrentIndex((prev) => (prev + 1) % currentCards.length);
      } else {
        setCurrentIndex((prev) => (prev - 1 + currentCards.length) % currentCards.length);
      }

      isThrottled = true;
      setTimeout(() => {
        isThrottled = false;
      }, 600);
    };
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [currentCards.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % currentCards.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + currentCards.length) % currentCards.length);
  };

  const handleCardClick = (index) => {
    setCurrentIndex(index);
  };

  const handleYearChange = (year) => {
    setActiveYear(year);
  };

  return (
    // ✨ CHANGE: Removed 'items-end' to allow the Navbar to sit at the top.
    <div className="app-root min-h-screen bg-gray-100 overflow-hidden font-inter relative">
      <Navbar2 />
      {/* Header */}
      <div className="absolute top-[9.5vh] left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold text-white-800 mt-4" style={{ fontFamily: "'Cinzel', serif" }}>Gallery</h1>
        <div className="pointer-events-auto flex gap-1 bg-zinc-900/70 backdrop-blur-md px-3 py-2 rounded-full shadow-lg border border-white/10">
          {["2024", "2023"].map((year) => (
            <button
              key={year}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${activeYear === year
                  ? "bg-black text-white shadow-md"
                  : "text-gray-300 hover:text-white hover:bg-zinc-800/70"
                }`}
              onClick={() => handleYearChange(year)}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="pointer-events-none relative w-full h-screen flex items-end justify-center max-w-[95vw] mx-auto [perspective:1500px]">
        {currentCards.map((card, index) => {
          const numCards = currentCards.length;
          let offsetFromCurrent = index - currentIndex;
          if (offsetFromCurrent > numCards / 2) offsetFromCurrent -= numCards;
          if (offsetFromCurrent < -numCards / 2) offsetFromCurrent += numCards;

          const isCurrentCard = index === currentIndex;
          const distanceFromCenter = Math.abs(offsetFromCurrent);

          const isVisible = distanceFromCenter < 6;

          const xOffsetFactor = 120;
          const yOffsetFactor = 30;
          const rotationFactor = 40;
          const baseScale = 0.9;
          const centralCardScale = 1.1;

          let yOffset, xOffset, rotation, scale;
          scale = isCurrentCard ? centralCardScale : baseScale;

          if (isVisible) {
            yOffset = distanceFromCenter * yOffsetFactor;
            xOffset = offsetFromCurrent * xOffsetFactor;
            rotation = offsetFromCurrent * rotationFactor;
          } else {
            yOffset = 500;
            xOffset = 0;
            rotation = 0;
          }

          const style = {
            transform: `translateX(calc(-50% + ${xOffset}px)) translateY(${yOffset}px) rotate(${rotation}deg) scale(${scale})`,
            filter: isCurrentCard ? "grayscale(0%)" : "grayscale(100%)",
            zIndex: numCards - distanceFromCenter,
            opacity: isVisible ? "1" : "0",
            transformOrigin: "bottom center",
            transition:
              "transform 0.6s cubic-bezier(0.65, 0, 0.35, 1), filter 0.6s cubic-bezier(0.65, 0, 0.35, 1), opacity 0.6s cubic-bezier(0.65, 0, 0.35, 1)",
          };

          return (
            <div
              key={`${activeYear}-${index}`}
              className="absolute w-[300px] h-[420px] left-1/2 bottom-[5vh] rounded-xl overflow-hidden shadow-[0_10px_20px_rgba(0,0,0,0.1),0_6px_6px_rgba(0,0,0,0.15)]"
              style={style}
              onClick={() => handleCardClick(index)}
            >
              <img
                src={card.src}
                alt={card.alt}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/400x600/f0f2f5/9ca3af?text=Image+Not+Found";
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <button
        id="prev-btn"
        className="absolute top-1/2 left-[2vw] -translate-y-1/2 w-[50px] h-[50px] rounded-full bg-black flex items-center justify-center shadow-md hover:scale-110 transition"
        onClick={handlePrev}
      >
        <img className='w-6 md:w-8' src="https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/icons8-double-left-24?_a=BAMAPqcg0" alt="" />
      </button>
      <button
        id="next-btn"
        className="absolute top-1/2 right-[2vw] -translate-y-1/2 w-[50px] h-[50px] rounded-full bg-black flex items-center justify-center shadow-md hover:scale-110 transition"
        onClick={handleNext}
      >
        <img className='w-6 md:w-8' src="https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/icons8-double-right-30?_a=BAMAPqcg0" alt="" />
      </button>

      <style>{`
      .app-root {
          background-image: url('https://res.cloudinary.com/mxuy06ca/image/upload/f_auto,q_auto/v1/udghosh-23/public/background?_a=BAMAPqcg0');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }
        .app-root img {
          border-radius: 0 !important;
          box-shadow: none !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}

export default App;