import React, { useState, useEffect } from 'react';
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { RxDotFilled } from 'react-icons/rx';

function Gallery2() {


  const slides = [
    {
      url: 'https://live.staticflickr.com/65535/53014086058_342e270d31_z.jpg',
    },
    {
      url: 'https://live.staticflickr.com/65535/52398025594_1c5678581e_z.jpg',
    },
    {
      url: 'https://live.staticflickr.com/65535/53229864239_c2f2bca418_b.jpg',
    },
    {
      url: 'https://live.staticflickr.com/65535/53229782858_39640139d4_b.jpg',
    },
    {
      url: 'https://live.staticflickr.com/65535/53234522828_bbc919c813_b.jpg',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  // Auto-slide effect every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval); // Clear the interval on component unmount
  }, [currentIndex]); // Add currentIndex as a dependency to reset the timer on manual change

  return (
    <div className="max-w-[1400px] h-[780px] w-full m-auto py-16 px-4 relative group mt-24">
      {/* Horizontal layout for larger screens */}
      <div
        style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
        className="w-full h-full rounded-2xl bg-center bg-cover duration-500 hidden sm:block"
      ></div>

      {/* Vertical layout for screens smaller than 500px */}
      <div className="sm:hidden flex flex-col gap-5 space-y-4">
        {slides.map((slide, index) => (
          <div
            key={index}
            style={{ backgroundImage: `url(${slide.url})` }}
            className="w-full h-[300px] bg-center bg-cover rounded-2xl"
          ></div>
        ))}
      </div>

      {/* Left Arrow for larger screens */}
      <div className="hidden sm:block group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
        <BsChevronCompactLeft onClick={prevSlide} size={30} />
      </div>

      {/* Right Arrow for larger screens */}
      <div className="hidden sm:block group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
        <BsChevronCompactRight onClick={nextSlide} size={30} />
      </div>

      {/* Pagination dots */}
      <div className="flex top-4 justify-center py-2">
        {slides.map((slide, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className="text-2xl cursor-pointer"
          >
            <RxDotFilled />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gallery2;
