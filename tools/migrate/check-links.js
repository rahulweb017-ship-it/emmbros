import { execSync } from "node:child_process";

const html = execSync("git show HEAD:client/public/pages/home.html", { maxBuffer: 15 * 1024 * 1024 }).toString("utf8");
const links = html.match(/<link[^>]+rel=["']stylesheet["'][^>]*>/g) || [];
console.log("STYLESHEET LINKS:", links.length);
links.forEach(l => console.log(l));

const styles = html.match(/<style[^>]*>([\s\S]*?)<\/style>/g) || [];
console.log("STYLE TAGS COUNT:", styles.length);
styles.forEach((s, idx) => console.log(`Style ${idx} length:`, s.length));
