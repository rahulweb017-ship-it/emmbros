import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_PAGES = path.resolve(__dirname, "../../client/src/pages");

function cleanDir(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      cleanDir(full);
    } else if (item.endsWith(".jsx")) {
      let content = fs.readFileSync(full, "utf8");
      // Remove HTML comments
      content = content.replace(/<!--[\s\S]*?-->/g, "");
      fs.writeFileSync(full, content);
      console.log("Cleaned comments in:", item);
    }
  }
}

cleanDir(SRC_PAGES);
