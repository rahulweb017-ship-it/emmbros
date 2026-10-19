import { spawn } from "node:child_process";
import fs from "node:fs";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9333;
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
  console.log("Created tab:", tab.id, tab.url);

  const ws = new WebSocket(tab.webSocketDebuggerUrl);

  ws.onopen = () => {
    ws.send(JSON.stringify({ id: 1, method: "Page.enable" }));
    ws.send(JSON.stringify({ id: 2, method: "Runtime.enable" }));
    ws.send(JSON.stringify({ id: 3, method: "Log.enable" }));
    ws.send(JSON.stringify({
      id: 4,
      method: "Emulation.setDeviceMetricsOverride",
      params: { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }
    }));
  };

  ws.onmessage = async (e) => {
    const msg = JSON.parse(e.data);
    if (msg.method === "Runtime.exceptionThrown") {
      console.error("RUNTIME EXCEPTION:", JSON.stringify(msg.params.exceptionDetails, null, 2));
    }
    if (msg.method === "Log.entryAdded") {
      console.log("LOG:", msg.params.entry);
    }
    if (msg.method === "Page.loadEventFired") {
      console.log("Page loadEventFired! Waiting 2s for React render...");
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 10,
          method: "Runtime.evaluate",
          params: { expression: "document.getElementById('root')?.innerHTML?.length || 0" }
        }));
      }, 2000);
    }
    if (msg.id === 10) {
      console.log("Root innerHTML length:", msg.result.result.value);
      ws.send(JSON.stringify({ id: 11, method: "Page.captureScreenshot" }));
    }
    if (msg.id === 11) {
      const buf = Buffer.from(msg.result.data, "base64");
      fs.writeFileSync("tools/shots/rendered_check.png", buf);
      console.log("Saved tools/shots/rendered_check.png, size:", buf.length);
      ws.close();
      chrome.kill();
      process.exit(0);
    }
  };
}

main().catch(err => {
  console.error("Error in main:", err);
  chrome.kill();
  process.exit(1);
});
