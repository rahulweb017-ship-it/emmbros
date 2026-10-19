import fs from "node:fs";

let code = fs.readFileSync("client/src/pages/Home.jsx", "utf8");

// 1. Update imports
code = code.replace(
  'import React from "react";',
  'import React, { useState, useEffect } from "react";\nimport { VideoModal } from "../components/common/VideoModal";'
);

// 2. Add component state and effects
const compStart = 'export function Home() {\n';
const stateCode = `export function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 4);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % 4);
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + 4) % 4);
`;
code = code.replace(compStart, stateCode);

// 3. Make slides dynamic
code = code.replace(
  '<div className="hero-slide active">',
  '<div className={`hero-slide ${activeSlide === 0 ? "active" : ""}`}'
);
code = code.replace(
  '<div className="hero-slide">\n\t\t\t\t\t\t<img src="/assets/images/slide-2.webp"',
  '<div className={`hero-slide ${activeSlide === 1 ? "active" : ""}`}>\n\t\t\t\t\t\t<img src="/assets/images/slide-2.webp"'
);
code = code.replace(
  '<div className="hero-slide">\n\t\t\t\t\t\t<img src="/assets/images/slide-3.webp"',
  '<div className={`hero-slide ${activeSlide === 2 ? "active" : ""}`}>\n\t\t\t\t\t\t<img src="/assets/images/slide-3.webp"'
);
code = code.replace(
  '<div className="hero-slide">\n\t\t\t\t\t\t<img src="/assets/images/slide-4.webp"',
  '<div className={`hero-slide ${activeSlide === 3 ? "active" : ""}`}>\n\t\t\t\t\t\t<img src="/assets/images/slide-4.webp"'
);

// 4. Attach arrow click handlers
code = code.replace(
  '<button type="button" className="hero-arrow hero-arrow-prev" aria-label="Previous Slide">',
  '<button type="button" onClick={prevSlide} className="hero-arrow hero-arrow-prev" aria-label="Previous Slide">'
);
code = code.replace(
  '<button type="button" className="hero-arrow hero-arrow-next" aria-label="Next Slide">',
  '<button type="button" onClick={nextSlide} className="hero-arrow hero-arrow-next" aria-label="Next Slide">'
);

// 5. Render dots
code = code.replace(
  '<div className="hero-dots-container" role="tablist" aria-label="Slide navigation"></div>',
  `<div className="hero-dots-container" role="tablist" aria-label="Slide navigation">
    {[0, 1, 2, 3].map((idx) => (
      <button
        key={idx}
        type="button"
        className={\`hero-dot \${activeSlide === idx ? "active" : ""}\`}
        onClick={() => setActiveSlide(idx)}
        aria-label={\`Go to slide \${idx + 1}\`}
      />
    ))}
  </div>`
);

// 6. Hook up video play button & modal
code = code.replace(
  '<div className="elementor-custom-embed-play" role="button" aria-label="Play Video" tabIndex="0">',
  '<div className="elementor-custom-embed-play" role="button" aria-label="Play Video" tabIndex="0" onClick={() => setVideoOpen(true)} style={{ cursor: "pointer" }}>'
);

code = code.replace(
  '</PageMeta>',
  '</PageMeta>\n      <VideoModal videoId="LwSK2Yxii4c" isOpen={videoOpen} onClose={() => setVideoOpen(false)} />'
);

fs.writeFileSync("client/src/pages/Home.jsx", code);
console.log("Updated Home.jsx with interactive hero slider and video modal!");
