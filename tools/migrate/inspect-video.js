import { spawn } from "node:child_process";
import fs from "node:fs";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9346;
const profile = `C:\\xampp\\htdocs\\Emmbros\\emmbros-react\\tools\\shots\\inspect-video-${Date.now()}`;
fs.mkdirSync(profile, { recursive: true });

const chrome = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  `--user-data-dir=${profile}`,
  `--remote-debugging-port=${port}`,
  "about:blank"
]);

setTimeout(async () => {
  const newTabRes = await fetch(`http://127.0.0.1:${port}/json/new?https://emmbros.com/pages/home.html`, { method: "PUT" });
  const tab = await newTabRes.json();
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  ws.onopen = () => {
    ws.send(JSON.stringify({ id: 1, method: "Page.enable" }));
    ws.send(JSON.stringify({ id: 2, method: "Runtime.enable" }));
  };
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.method === "Page.loadEventFired") {
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 10,
          method: "Runtime.evaluate",
          params: { expression: 'document.querySelector(".elementor-element-d58f45c").outerHTML' }
        }));
      }, 2000);
    }
    if (msg.id === 10) {
      console.log("VIDEO HTML:", msg.result.result.value);
      chrome.kill();
      process.exit(0);
    }
  };
}, 1500);
