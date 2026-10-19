import fs from "node:fs";

const cssPath = "client/src/styles/pages/home.css";
let css = fs.readFileSync(cssPath, "utf8");

const enhancements = `
/* === Home Section Polish & Overlays === */
.custom-btn span.eal-button-icon,
.custom-btn span.elementor-button-icon {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 28px !important;
  height: 28px !important;
  padding: 7px !important;
  background: #fff !important;
  border-radius: 50px !important;
  color: #034464 !important;
}
.custom-btn .eal-button {
  display: inline-flex !important;
  align-items: center !important;
  background-color: #98C8E9 !important;
  color: #000000 !important;
  border-radius: 50px !important;
  padding: 10px 8px 10px 30px !important;
  font-weight: 500 !important;
  text-decoration: none !important;
  transition: all 0.3s ease !important;
}
.custom-btn .eal-button-content-wrapper {
  display: inline-flex !important;
  align-items: center !important;
  flex-direction: row-reverse !important;
  gap: 15px !important;
}

.eal-element-2094b03 {
  width: 160px !important;
  max-width: 160px !important;
  height: 3px !important;
  margin: 14px auto 30px auto !important;
  background-image: linear-gradient(-90deg, #034464 50%, #AACDE6 50%) !important;
  border-radius: 2px !important;
}
.eal-element-2094b03 .eal-divider {
  display: none !important;
}

.eal-element-d58f45c {
  width: 100% !important;
  max-width: 1000px !important;
  margin: 0 auto !important;
}
.eal-element-d58f45c .eal-wrapper {
  position: relative !important;
  width: 100% !important;
  padding-bottom: 56.25% !important;
  border-radius: 20px !important;
  overflow: hidden !important;
  background-color: #000 !important;
}
.eal-element-d58f45c .eal-custom-embed-image-overlay {
  position: absolute !important;
  inset: 0 !important;
  background-size: cover !important;
  background-position: center !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}
.eal-element-d58f45c .eal-custom-embed-play {
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  width: 80px !important;
  height: 80px !important;
  border-radius: 50% !important;
  background: rgba(255, 255, 255, 0.2) !important;
  border: 3px solid #fff !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: transform 0.3s ease, background 0.3s ease !important;
}
.eal-element-d58f45c .eal-custom-embed-play:hover {
  transform: translate(-50%, -50%) scale(1.1) !important;
  background: rgba(255, 255, 255, 0.4) !important;
}
.eal-element-d58f45c .eal-custom-embed-play i {
  color: #fff !important;
  font-size: 32px !important;
  margin-left: 4px !important;
}

.eal-element-89db8ac {
  position: relative !important;
  background-image: url("/assets/images/new-project-20.webp") !important;
  background-size: cover !important;
  background-position: center center !important;
}
.eal-element-89db8ac::before {
  content: "" !important;
  position: absolute !important;
  inset: 0 !important;
  background-color: rgba(136, 176, 204, 0.85) !important;
  pointer-events: none !important;
  z-index: 0 !important;
}
.eal-element-89db8ac > * {
  position: relative !important;
  z-index: 1 !important;
}

.eal-element-7c20077 {
  position: relative !important;
  background-image: url("/assets/images/new-project-21.webp") !important;
  background-size: cover !important;
  background-position: center center !important;
}
.eal-element-7c20077::before {
  content: "" !important;
  position: absolute !important;
  inset: 0 !important;
  background-color: rgba(2, 44, 64, 0.85) !important;
  pointer-events: none !important;
  z-index: 0 !important;
}
.eal-element-7c20077 > * {
  position: relative !important;
  z-index: 1 !important;
}
`;

fs.writeFileSync(cssPath, css + "\n" + enhancements, "utf8");
console.log("Appended enhancements to home.css successfully!");
