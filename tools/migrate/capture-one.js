import { spawn } from "node:child_process";
import fs from "node:fs";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const out = "C:\\xampp\\htdocs\\Emmbros\\emmbros-react\\tools\\shots\\test_one.png";
const profile = "C:\\xampp\\htdocs\\Emmbros\\emmbros-react\\tools\\shots\\chrome-profile";
fs.mkdirSync(profile, { recursive: true });

const proc = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  `--user-data-dir=${profile}`,
  "--hide-scrollbars",
  "--window-size=1440,900",
  `--screenshot=${out}`,
  "--virtual-time-budget=5000",
  "http://localhost:4000/"
]);

proc.on("close", (code) => {
  if (fs.existsSync(out)) {
    console.log("Captured test_one.png, size:", fs.statSync(out).size);
  } else {
    console.error("File not created, code:", code);
  }
});
