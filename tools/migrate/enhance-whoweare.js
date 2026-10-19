import fs from "node:fs";

let code = fs.readFileSync("client/src/pages/WhoWeAre.jsx", "utf8");

// 1. Update imports
code = code.replace(
  'import React from "react";',
  'import React, { useState } from "react";'
);

// 2. Add state
const compStart = 'export function WhoWeAre() {\n';
const stateCode = `export function WhoWeAre() {
  const [activeLeader, setActiveLeader] = useState(0);

  const prevLeader = () => setActiveLeader((prev) => (prev === 0 ? 1 : 0));
  const nextLeader = () => setActiveLeader((prev) => (prev === 1 ? 0 : 1));
`;
code = code.replace(compStart, stateCode);

// 3. Make cards active based on state
code = code.replace(
  '<div className="leadership-card active" data-slide-index="0">',
  '<div className={`leadership-card ${activeLeader === 0 ? "active" : ""}`} data-slide-index="0">'
);

code = code.replace(
  '<div className="leadership-card" data-slide-index="1">',
  '<div className={`leadership-card ${activeLeader === 1 ? "active" : ""}`} data-slide-index="1">'
);

// 4. Attach click handlers to buttons
code = code.replace(
  '<button type="button" className="leadership-arrow-btn" id="leadership-prev-btn" aria-label="Previous Leader">',
  '<button type="button" onClick={prevLeader} className="leadership-arrow-btn" id="leadership-prev-btn" aria-label="Previous Leader">'
);

code = code.replace(
  '<button type="button" className="leadership-arrow-btn" id="leadership-next-btn" aria-label="Next Leader">',
  '<button type="button" onClick={nextLeader} className="leadership-arrow-btn" id="leadership-next-btn" aria-label="Next Leader">'
);

fs.writeFileSync("client/src/pages/WhoWeAre.jsx", code);
console.log("Updated WhoWeAre.jsx with interactive leadership slider!");
