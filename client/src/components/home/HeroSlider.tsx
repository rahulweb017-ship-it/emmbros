import React, { useState, useEffect, useRef, useCallback } from "react";
import { HERO_SLIDES, SlideData } from "./heroData";

interface HeroSliderProps {
  slides?: SlideData[];
  autoPlayInterval?: number;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({
  slides = HERO_SLIDES,
  autoPlayInterval = 6000,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Autoplay (6 seconds)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [nextSlide, autoPlayInterval, isPaused]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current) return;
      if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      ref={containerRef}
      className="hero-slider-container relative w-full overflow-hidden bg-[#071321] text-white select-none min-h-[480px] sm:min-h-[550px] lg:min-h-[calc(100vh-100px)] lg:max-h-[720px] flex items-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Homepage Hero Slider"
    >
      {/* Background Slides */}
      {slides.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.heading.replace("\n", " ")}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover object-bottom transform scale-100 transition-transform duration-[8000ms] ease-out"
              style={{ transform: isActive ? "scale(1)" : "scale(1.05)", objectPosition: "center bottom" }}
            />

            {/* Dark Navy Blue Gradient Overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(7,19,33,0.96) 0%, rgba(7,19,33,0.85) 38%, rgba(7,19,33,0.45) 65%, rgba(7,19,33,0.05) 90%)",
              }}
            />

            {/* Left-Aligned Slide Content (No Left/Right Padding) */}
            <div className="relative z-20 h-full w-full max-w-7xl mx-auto px-0 flex flex-col justify-center items-start text-left py-16">
              <div
                className={`max-w-xl pl-8 sm:pl-12 lg:pl-16 transform transition-all duration-700 delay-150 ${
                  isActive ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
              >
                {/* Solid White Heading */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[54px] font-bold text-white leading-[1.18] tracking-tight mb-4 whitespace-pre-line drop-shadow-sm">
                  {slide.heading}
                </h1>

                {/* Sub Heading */}
                <p className="text-sm sm:text-base lg:text-[17px] text-white leading-relaxed font-normal max-w-md whitespace-pre-line opacity-95 drop-shadow">
                  {slide.subHeading}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/20 hover:bg-black/50 text-white backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-200 opacity-70 hover:opacity-100 focus:outline-none"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/20 hover:bg-black/50 text-white backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-200 opacity-70 hover:opacity-100 focus:outline-none"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default HeroSlider;
