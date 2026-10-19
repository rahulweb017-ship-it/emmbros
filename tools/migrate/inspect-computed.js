import { spawn } from "node:child_process";
import fs from "node:fs";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9345;
const profile = `C:\\xampp\\htdocs\\Emmbros\\emmbros-react\\tools\\shots\\inspect-comp-${Date.now()}`;
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
    ws.send(JSON.stringify({ id: 2, method: "Runtime.enable" }));
  };

  ws.onmessage = async (e) => {
    const msg = JSON.parse(e.data);
    if (msg.method === "Page.loadEventFired") {
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 10,
          method: "Runtime.evaluate",
          params: {
            expression: `
              (() => {
                function comp(sel) {
                  const el = document.querySelector(sel);
                  if (!el) return sel + ' NOT FOUND';
                  const s = window.getComputedStyle(el);
                  const before = window.getComputedStyle(el, '::before');
                  return {
                    bg: s.backgroundColor,
                    bgImg: s.backgroundImage,
                    bgPos: s.backgroundPosition,
                    bgSize: s.backgroundSize,
                    color: s.color,
                    borderRadius: s.borderRadius,
                    padding: s.padding,
                    beforeBg: before.backgroundColor,
                    beforeContent: before.content,
                    beforeOpacity: before.opacity
                  };
                }

                return {
                  customBtn: comp('.custom-btn .elementor-button'),
                  customBtnIcon: comp('.custom-btn span.elementor-button-icon'),
                  prodSection: comp('.elementor-element-89db8ac'),
                  divider: comp('.elementor-element-2094b03'),
                  dividerSeparator: comp('.elementor-element-2094b03 .elementor-divider-separator'),
                  videoContainer: comp('.elementor-element-d58f45c'),
                  sectorSection: comp('.elementor-element-7c20077')
                };
              })()
            `,
            returnByValue: true
          }
        }));
      }, 3000);
    }
    if (msg.id === 10) {
      console.log("COMPUTED STYLES FROM LIVE ORIGINAL:");
      console.log(JSON.stringify(msg.result.result.value, null, 2));
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
