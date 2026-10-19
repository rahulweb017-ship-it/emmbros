import fs from "node:fs";

const sliderCss = `
/* Custom Modern Industrial Hero Slider Styles - Reference Design Match */
.emmbros-hero-slider {
  position: relative;
  width: 100%;
  min-height: 500px;
  height: calc(100vh - 90px);
  max-height: 750px;
  background-color: #071321;
  overflow: hidden;
  user-select: none;
  font-family: inherit, system-ui, -apple-system, sans-serif;
}
@media (max-width: 1024px) {
  .emmbros-hero-slider {
    min-height: 460px;
    height: 65vh;
  }
}
@media (max-width: 640px) {
  .emmbros-hero-slider {
    min-height: 400px;
    height: 62vh;
  }
}
.hero-slide {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 1;
  pointer-events: none;
  transition: opacity 1000ms cubic-bezier(0.4, 0, 0.2, 1);
}
.hero-slide.active {
  opacity: 1;
  z-index: 2;
  pointer-events: auto;
}
.hero-slide-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center bottom !important;
  transform: scale(1);
  transition: transform 8000ms cubic-bezier(0.25, 1, 0.5, 1);
}
.hero-slide.active .hero-slide-bg {
  transform: scale(1.04);
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(7, 19, 33, 0.96) 0%, rgba(7, 19, 33, 0.85) 38%, rgba(7, 19, 33, 0.45) 65%, rgba(7, 19, 33, 0.05) 90%);
  z-index: 3;
}
@media (max-width: 640px) {
  .hero-overlay {
    background: linear-gradient(180deg, rgba(7, 19, 33, 0.38) 0%, rgba(7, 19, 33, 0.55) 50%, rgba(7, 19, 33, 0.88) 100%);
  }
  .hero-slide-bg {
    object-position: center center !important;
  }
}
.hero-content-wrapper {
  position: relative;
  z-index: 4;
  height: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  text-align: left;
}
@media (max-width: 1024px) {
  .hero-content-wrapper {
    padding: 0 72px;
  }
}
@media (max-width: 640px) {
  .hero-content-wrapper {
    padding: 0 22px;
  }
}
.emmbros-hero-slider .hero-title {
  color: #ffffff !important;
  font-size: 54px;
  font-weight: 700;
  line-height: 1.18;
  letter-spacing: -0.5px;
  margin: 0 0 20px 0;
  max-width: 800px;
  white-space: pre-line;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}
@media (max-width: 1024px) {
  .emmbros-hero-slider .hero-title {
    font-size: 42px;
  }
}
@media (max-width: 640px) {
  .emmbros-hero-slider .hero-title {
    font-size: 26px;
    line-height: 1.22;
    letter-spacing: 0;
    margin-bottom: 12px;
    max-width: 100%;
  }
}
.emmbros-hero-slider .hero-subtitle {
  color: #f1f5f9;
  font-size: 17px;
  font-weight: 400;
  line-height: 1.5;
  margin: 0 0 32px 0;
  max-width: 500px;
  white-space: pre-line;
  opacity: 0.92;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}
@media (max-width: 640px) {
  .emmbros-hero-slider .hero-subtitle {
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 0;
    max-width: 100%;
  }
}
.hero-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 40px;
  height: 48px;
  border-radius: 6px !important;
  background-color: #98C8E9 !important;
  border: none !important;
  color: #0b141f !important;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 200ms ease;
  outline: none;
  opacity: 0.5 !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
.hero-arrow:hover {
  background-color: #98C8E9 !important;
  opacity: 0.95 !important;
}
.hero-arrow svg {
  stroke: #0b141f !important;
}
.hero-arrow-prev { left: 20px !important; }
.hero-arrow-next { right: 20px !important; }
@media (max-width: 640px) {
  .hero-arrow {
    width: 34px;
    height: 38px;
    top: auto;
    bottom: 16px;
    transform: none;
    opacity: 0.7 !important;
  }
  .hero-arrow-prev { left: 14px !important; }
  .hero-arrow-next { right: 14px !important; }
}
.hero-dots-container {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 14px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 9999px;
  backdrop-filter: blur(4px);
}
.emmbros-hero-slider .hero-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4) !important;
  border: none !important;
  cursor: pointer;
  transition: all 300ms ease;
  padding: 0;
  min-width: 0;
}
.emmbros-hero-slider .hero-dot:hover {
  background: rgba(255, 255, 255, 0.8) !important;
}
.emmbros-hero-slider .hero-dot.active {
  width: 28px;
  border-radius: 9999px;
  background: #ffffff !important;
}
`;

fs.appendFileSync("client/src/styles/pages/home.css", "\n" + sliderCss);
console.log("Appended hero slider css to home.css");

const headerResp = `
@media (max-width: 1024px) {
  .header-top-strip .header-contact-items {
    display: none !important;
  }
  .desktop-nav {
    display: none !important;
  }
  .mobile-menu-toggle {
    display: inline-flex !important;
  }
}
`;
fs.appendFileSync("client/src/styles/global.css", "\n" + headerResp);
console.log("Appended header responsive css to global.css");
