import { spawn } from "node:child_process";
import fs from "node:fs";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9347;
const profile = `C:\\xampp\\htdocs\\Emmbros\\emmbros-react\\tools\\shots\\inspect-7c-${Date.now()}`;
fs.mkdirSync(profile, { recursive: true });

const chrome = spawn(CHROME, ["--headless=new", "--disable-gpu", `--user-data-dir=${profile}`, `--remote-debugging-port=${port}`, "about:blank"]);

setTimeout(async () => {
  const newTabRes = await fetch(`http://127.0.0.1:${port}/json/new?http://localhost:4000/`, { method: "PUT" });
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
          params: {
            expression: `(() => {
              const el = document.querySelector(".eal-custom-embed-image-overlay");
              if (!el) return "NOT FOUND";
              const matches = [];
              for (const sheet of document.styleSheets) {
                try {
                  for (const rule of sheet.cssRules) {
                    if (rule.selectorText && el.matches(rule.selectorText)) {
                      if (rule.style.background || rule.style.backgroundImage) {
                        matches.push({ sel: rule.selectorText, bg: rule.style.background || rule.style.backgroundImage });
                      }
                    }
                  }
                } catch(e) {}
              }
              el.style.setProperty("background-image", "url('/assets/images/image-7.webp')", "important");
              return {
                inlineBg: el.style.backgroundImage,
                computedBg: window.getComputedStyle(el).backgroundImage
              };
            })()`,
            returnByValue: true
          }
        }));
      }, 2000);
    }
    if (msg.id === 10) {
      console.log("7c20077 COMPUTED ON REACT:", msg.result ? msg.result.result.value : msg);
      chrome.kill();
      process.exit(0);
    }
  };
}, 1500);
