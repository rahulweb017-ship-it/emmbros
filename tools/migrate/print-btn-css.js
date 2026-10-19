import { execSync } from "node:child_process";

const html = execSync("git show HEAD:client/public/pages/home.html", { maxBuffer: 15 * 1024 * 1024 }).toString("utf8");

const regex = /\.elementor-14418 \.elementor-element\.elementor-element-2f126e3[^{]*\{[^}]*\}/g;
let m;
while ((m = regex.exec(html)) !== null) {
  console.log(m[0]);
}
