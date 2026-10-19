import { spawn } from "node:child_process";

const chromeProc = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
  "--headless=new",
  "--disable-gpu",
  "--remote-debugging-port=9225",
  "about:blank"
]);

setTimeout(async () => {
  try {
    const listRes = await fetch("http://127.0.0.1:9225/json/list");
    const tabs = await listRes.json();
    const wsUrl = tabs[0].webSocketDebuggerUrl;

    const ws = new WebSocket(wsUrl);
    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: "Page.enable" }));
      ws.send(JSON.stringify({ id: 2, method: "Runtime.enable" }));
      ws.send(JSON.stringify({ id: 3, method: "Page.navigate", params: { url: "http://localhost:4000/" } }));
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === "Runtime.exceptionThrown") {
        console.error("EXCEPTION:", msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text);
      }
      if (msg.method === "Page.loadEventFired") {
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 10,
            method: "Runtime.evaluate",
            params: { expression: "document.getElementById('root')?.innerHTML" }
          }));
        }, 1000);
      }
      if (msg.id === 10) {
        console.log("ROOT INNERHTML LENGTH:", msg.result.result.value?.length);
        console.log("ROOT INNERHTML FIRST 300 CHARS:\n", msg.result.result.value?.slice(0, 300));
        ws.close();
        chromeProc.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error("Error:", err);
    chromeProc.kill();
    process.exit(1);
  }
}, 1500);
