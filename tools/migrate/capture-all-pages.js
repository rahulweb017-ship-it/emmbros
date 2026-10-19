import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9355;
const profile = `C:\\xampp\\htdocs\\Emmbros\\emmbros-react\\tools\\shots\\inspect-all-${Date.now()}`;
fs.mkdirSync(profile, { recursive: true });

const PAGES = [
  { slug: "home", path: "/" },
  { slug: "who-we-are", path: "/who-we-are/" },
  { slug: "what-we-do", path: "/what-we-do/" },
  { slug: "product-application", path: "/product-application/" },
  { slug: "front-axle-shaft", path: "/product-application/front-axle-shaft/" },
  { slug: "rear-axle-shaft", path: "/product-application/rear-axle-shaft/" },
  { slug: "gear-box-parts", path: "/product-application/gear-box-parts/" },
  { slug: "driveline-parts", path: "/product-application/driveline-parts/" },
  { slug: "hydraulic-parts", path: "/product-application/hydraulic-parts/" },
  { slug: "planetary-wheel-drive-parts", path: "/product-application/planetary-wheel-drive-parts/" },
  { slug: "career", path: "/career/" },
];

const chrome = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  `--user-data-dir=${profile}`,
  `--remote-debugging-port=${port}`,
  "about:blank"
]);

async function capturePage(page) {
  const url = `http://localhost:4000${page.path}`;
  const newTabRes = await fetch(`http://127.0.0.1:${port}/json/new?${url}`, { method: "PUT" });
  const tab = await newTabRes.json();
  const ws = new WebSocket(tab.webSocketDebuggerUrl);

  return new Promise((resolve, reject) => {
    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: "Page.enable" }));
      ws.send(JSON.stringify({
        id: 2,
        method: "Emulation.setDeviceMetricsOverride",
        params: { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }
      }));
    };

    ws.onmessage = async (e) => {
      const msg = JSON.parse(e.data);
      if (msg.method === "Page.loadEventFired") {
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 5,
            method: "Runtime.evaluate",
            params: {
              expression: `
                (async () => {
                  const totalHeight = document.body.scrollHeight;
                  for (let y = 0; y < totalHeight; y += 400) {
                    window.scrollTo(0, y);
                    await new Promise(r => setTimeout(r, 100));
                  }
                  window.scrollTo(0, 0);
                  return totalHeight;
                })()
              `,
              awaitPromise: true
            }
          }));
        }, 1500);
      }

      if (msg.id === 5) {
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 10,
            method: "Page.captureScreenshot",
            params: { captureBeyondViewport: true }
          }));
        }, 1500);
      }

      if (msg.id === 10) {
        const buf = Buffer.from(msg.result.data, "base64");
        const out = path.join("tools/shots/react", `${page.slug}_full.png`);
        fs.writeFileSync(out, buf);
        console.log(`Saved ${out}, size: ${buf.length}`);
        ws.close();
        resolve();
      }
    };
  });
}

async function main() {
  await new Promise(r => setTimeout(r, 1500));
  fs.mkdirSync("tools/shots/react", { recursive: true });

  for (const page of PAGES) {
    console.log(`Capturing ${page.slug}...`);
    try {
      await capturePage(page);
    } catch (e) {
      console.error(`Failed ${page.slug}:`, e);
    }
  }

  chrome.kill();
  console.log("All pages captured!");
}

main().catch(err => {
  console.error("Error:", err);
  chrome.kill();
  process.exit(1);
});
