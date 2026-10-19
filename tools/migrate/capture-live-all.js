import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUT_DIR = path.resolve(__dirname, "../../tools/shots/live");
fs.mkdirSync(OUT_DIR, { recursive: true });

const PAGES = [
  { slug: "home", url: "https://emmbros.com/" },
  { slug: "who-we-are", url: "https://emmbros.com/who-we-are/" },
  { slug: "what-we-do", url: "https://emmbros.com/what-we-do/" },
  { slug: "product-application", url: "https://emmbros.com/product-application/" },
  { slug: "front-axle-shaft", url: "https://emmbros.com/product-application/front-axle-shaft/" },
  { slug: "rear-axle-shaft", url: "https://emmbros.com/product-application/rear-axle-shaft/" },
  { slug: "gear-box-parts", url: "https://emmbros.com/product-application/gear-box-parts/" },
  { slug: "driveline-parts", url: "https://emmbros.com/product-application/driveline-parts/" },
  { slug: "hydraulic-parts", url: "https://emmbros.com/product-application/hydraulic-parts/" },
  { slug: "planetary-wheel-drive-parts", url: "https://emmbros.com/product-application/planetary-wheel-drive-parts/" },
  { slug: "career", url: "https://emmbros.com/career/" },
];

function capture(url, outPath) {
  return new Promise((resolve, reject) => {
    const proc = spawn(CHROME, [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--window-size=1440,900",
      `--screenshot=${outPath}`,
      "--virtual-time-budget=5000",
      url,
    ]);
    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Exit code ${code}`));
    });
  });
}

async function run() {
  console.log("Capturing live site screenshots for all pages...");
  for (const page of PAGES) {
    const out = path.join(OUT_DIR, `${page.slug}_1440.png`);
    try {
      await capture(page.url, out);
      console.log(`Captured live: ${page.slug}`);
    } catch (e) {
      console.error(`Failed ${page.slug}:`, e.message);
    }
  }
  console.log("Live capture complete!");
}

run();
