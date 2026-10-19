import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUT_DIR = path.resolve(__dirname, "../../tools/shots/baseline");
fs.mkdirSync(OUT_DIR, { recursive: true });

const VIEWPORTS = [
  { name: "desktop-1440", w: 1440, h: 900 },
  { name: "tablet-1024", w: 1024, h: 768 },
  { name: "tablet-768", w: 768, h: 1024 },
  { name: "mobile-390", w: 390, h: 844 },
];

const PAGES = [
  { slug: "home", url: "http://localhost:4000/" },
  { slug: "who-we-are", url: "http://localhost:4000/who-we-are/" },
  { slug: "what-we-do", url: "http://localhost:4000/what-we-do/" },
  { slug: "product-application", url: "http://localhost:4000/product-application/" },
  { slug: "front-axle-shaft", url: "http://localhost:4000/product-application/front-axle-shaft/" },
  { slug: "rear-axle-shaft", url: "http://localhost:4000/product-application/rear-axle-shaft/" },
  { slug: "gear-box-parts", url: "http://localhost:4000/product-application/gear-box-parts/" },
  { slug: "driveline-parts", url: "http://localhost:4000/product-application/driveline-parts/" },
  { slug: "hydraulic-parts", url: "http://localhost:4000/product-application/hydraulic-parts/" },
  { slug: "planetary-wheel-drive-parts", url: "http://localhost:4000/product-application/planetary-wheel-drive-parts/" },
  { slug: "career", url: "http://localhost:4000/career/" },
];

function capture(url, outPath, w, h) {
  return new Promise((resolve, reject) => {
    const proc = spawn(CHROME, [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      `--window-size=${w},${h}`,
      `--screenshot=${outPath}`,
      "--virtual-time-budget=3000",
      url,
    ]);
    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Exit code ${code}`));
    });
  });
}

async function run() {
  console.log(`Starting baseline captures (${PAGES.length} pages x ${VIEWPORTS.length} viewports)...`);
  for (const page of PAGES) {
    for (const vp of VIEWPORTS) {
      const out = path.join(OUT_DIR, `${page.slug}_${vp.name}.png`);
      try {
        await capture(page.url, out, vp.w, vp.h);
        console.log(`Captured: ${page.slug} @ ${vp.name}`);
      } catch (e) {
        console.error(`Failed ${page.slug} @ ${vp.name}:`, e.message);
      }
    }
  }
  console.log("Baseline captures complete!");
}

run();
