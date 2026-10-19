import { execSync } from "node:child_process";
import fs from "node:fs";

const html = execSync("git show HEAD:client/public/pages/home.html", { maxBuffer: 15 * 1024 * 1024 }).toString("utf8");

const matches = [];
const regex = /\.elementor-element-89db8ac[^{]*\{[^}]*\}/g;
let m;
while ((m = regex.exec(html)) !== null) {
  matches.push(m[0]);
}

console.log("Matches for 89db8ac in home.html styles:\n", matches.join("\n\n"));
