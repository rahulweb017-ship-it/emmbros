import { spawn } from "node:child_process";
import fs from "node:fs";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9339;
const profile = `C:\\xampp\\htdocs\\Emmbros\\emmbros-react\\tools\\shots\\inspect-scroll-${Date.now()}`;
fs.mkdirSync(profile, { recursive: true });

const chrome = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  `--user-data-dir=${profile}`,
  `--remote-debugging-port=${port}`,
  "about:blank"
]);

async function main() {
  await new Promise(r => setTimeout(r, 1500));
  const newTabRes = await fetch(`http://127.0.0.1:${port}/json/new?https://emmbros.com/pages/home.html`, { method: "PUT" });
  const tab = await newTabRes.json();

  const ws = new WebSocket(tab.webSocketDebuggerUrl);

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
      setTimeout(async () => {
        // Evaluate smooth scroll to bottom to trigger waypoints
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
                // Also remove any elementor-invisible class
                document.querySelectorAll('.elementor-invisible').forEach(el => el.classList.remove('elementor-invisible'));
                return totalHeight;
              })()
            `,
            awaitPromise: true
          }
        }));
      }, 2000);
    }
    if (msg.id === 5) {
      console.log("Scrolled through total height:", msg.result.result.value);
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 10,
          method: "Page.captureScreenshot",
          params: { captureBeyondViewport: true }
        }));
      }, 2000);
    }
    if (msg.id === 10) {
      const buf = Buffer.from(msg.result.data, "base64");
      fs.writeFileSync("tools/shots/original_home_scrolled.png", buf);
      console.log("Saved tools/shots/original_home_scrolled.png, size:", buf.length);
      ws.close();
      chrome.kill();
      process.exit(0);
    }
  };
}

main().catch(err => {
  console.error("Error:", err);
  chrome.kill();
  process.exit(1);
});
