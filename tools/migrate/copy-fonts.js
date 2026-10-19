import fs from "node:fs";
import path from "node:path";

const fontsSrcDir = "client/public/wp-content";
const fontsDestDir = "client/public/assets/fonts";
fs.mkdirSync(fontsDestDir, { recursive: true });

function copyFonts(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      copyFonts(full);
    } else {
      const ext = path.extname(item).toLowerCase();
      if ([".woff", ".woff2", ".ttf", ".eot", ".svg"].includes(ext) && (full.includes("font") || full.includes("eicons"))) {
        const dest = path.join(fontsDestDir, item);
        fs.copyFileSync(full, dest);
        console.log("Copied font:", item, "to", dest);
      }
    }
  }
}

copyFonts(fontsSrcDir);
console.log("All font files copied to assets/fonts!");
