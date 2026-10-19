import fs from "node:fs";
import { spawn } from "node:child_process";

const profile = "C:\\xampp\\htdocs\\Emmbros\\emmbros-react\\tools\\shots\\chrome-profile-shot";
fs.mkdirSync(profile, { recursive: true });

const chromeProc = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
  "--headless=new",
  "--disable-gpu",
  `--user-data-dir=${profile}`,
  "--remote-debugging-port=9223",
  "--window-size=1440,900",
  "about:blank"
]);

setTimeout(async () => {
  try {
    const listRes = await fetch("http://127.0.0.1:9223/json/list");
    const tabs = await listRes.json();
    const tab = tabs[0];

    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: "Page.enable" }));
      ws.send(JSON.stringify({ id: 2, method: "Emulation.setDeviceMetricsOverride", params: { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false } }));
      ws.send(JSON.stringify({ id: 3, method: "Page.navigate", params: { url: "http://localhost:4000/" } }));
    };

    ws.onmessage = async (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === "Page.loadEventFired") {
        console.log("Page loaded! Waiting 1.5s for rendering...");
        setTimeout(() => {
          ws.send(JSON.stringify({ id: 10, method: "Page.captureScreenshot", params: { format: "png" } }));
        }, 1500);
      }
      if (msg.id === 10) {
        const buf = Buffer.from(msg.result.data, "base64");
        fs.writeFileSync("tools/shots/test_rendered_home.png", buf);
        console.log("Saved tools/shots/test_rendered_home.png, size:", buf.length);
        ws.close();
        chromeProc.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error("Error:", err.message);
    chromeProc.kill();
    process.exit(1);
  }
}, 1500);
