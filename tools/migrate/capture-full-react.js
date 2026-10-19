import { spawn } from "node:child_process";
import fs from "node:fs";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9334;
const profile = `C:\\xampp\\htdocs\\Emmbros\\emmbros-react\\tools\\shots\\inspect-profile-${Date.now()}`;
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
  const newTabRes = await fetch(`http://127.0.0.1:${port}/json/new?http://localhost:4000/`, { method: "PUT" });
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
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 10,
          method: "Page.captureScreenshot",
          params: { captureBeyondViewport: true }
        }));
      }, 2500);
    }
    if (msg.id === 10) {
      const buf = Buffer.from(msg.result.data, "base64");
      fs.writeFileSync("tools/shots/home_full_react.png", buf);
      console.log("Saved tools/shots/home_full_react.png, size:", buf.length);
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
