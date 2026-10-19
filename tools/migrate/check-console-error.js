import { spawn } from "node:child_process";

const chromeProc = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
  "--headless=new",
  "--disable-gpu",
  "--remote-debugging-port=9222",
  "http://localhost:4000/"
]);

setTimeout(async () => {
  try {
    const listRes = await fetch("http://127.0.0.1:9222/json/list");
    const tabs = await listRes.json();
    const tab = tabs.find(t => t.url.includes("4000")) || tabs[0];
    console.log("Found tab:", tab.title, tab.url);

    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: "Runtime.enable" }));
      ws.send(JSON.stringify({ id: 2, method: "Log.enable" }));
      ws.send(JSON.stringify({ id: 3, method: "Page.enable" }));
      ws.send(JSON.stringify({ id: 4, method: "Page.reload" }));
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === "Runtime.exceptionThrown") {
        console.error("PAGE EXCEPTION:", JSON.stringify(msg.params.exceptionDetails, null, 2));
      }
      if (msg.method === "Runtime.consoleAPICalled") {
        console.log("CONSOLE:", msg.params.type, msg.params.args.map(a => a.value || a.description).join(" "));
      }
    };

    setTimeout(() => {
      ws.close();
      chromeProc.kill();
      process.exit(0);
    }, 4000);
  } catch (err) {
    console.error("Error:", err.message);
    chromeProc.kill();
    process.exit(1);
  }
}, 1500);
