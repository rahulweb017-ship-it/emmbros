import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_PAGES = path.resolve(__dirname, "../../client/src/pages");

for (const item of fs.readdirSync(SRC_PAGES)) {
  const full = path.join(SRC_PAGES, item);
  if (fs.statSync(full).isFile() && item.endsWith(".jsx")) {
    let content = fs.readFileSync(full, "utf8");
    content = content.replace(/\.\.\/\.\.\/styles\/pages\//g, "../styles/pages/");
    content = content.replace(/\.\.\/\.\.\/components\/common\//g, "../components/common/");
    fs.writeFileSync(full, content);
    console.log("Updated root page imports:", item);
  }
}
