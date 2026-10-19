import fs from "node:fs";

async function main() {
  const res = await fetch("https://emmbros.com/");
  const html = await res.text();
  console.log("Live HTML length:", html.length);
  fs.writeFileSync("tools/shots/live-home-source.html", html);
  console.log("Saved tools/shots/live-home-source.html");
}

main().catch(console.error);
