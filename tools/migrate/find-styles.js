import { execSync } from "node:child_process";

const html = execSync("git show HEAD:client/public/pages/home.html", { maxBuffer: 15 * 1024 * 1024 }).toString("utf8");
const styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]);

const terms = ["89db8ac", "2094b03", "custom-btn", "9943fcf", "2c8e3bf", "new-project-20", "drone", "youtube", "arrow_right-up"];

for (const t of terms) {
  console.log(`\n=================== SEARCH: ${t} ===================`);
  styles.forEach((s, idx) => {
    if (s.includes(t)) {
      console.log(`Found in Style ${idx}:`);
      // Find rules containing t
      const reg = new RegExp(`[^{}]*${t}[^{}]*\\{[^}]*\\}`, "g");
      const matches = s.match(reg);
      if (matches) {
        matches.forEach(m => console.log(m.trim()));
      } else {
        const i = s.indexOf(t);
        console.log(s.slice(Math.max(0, i - 100), Math.min(s.length, i + 200)));
      }
    }
  });
}
