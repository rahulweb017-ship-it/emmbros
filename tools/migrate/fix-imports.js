import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_PAGES = path.resolve(__dirname, "../../client/src/pages");

function fixImports(dir, isSub) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      fixImports(full, true);
    } else if (item.endsWith(".jsx")) {
      let content = fs.readFileSync(full, "utf8");
      if (isSub) {
        content = content.replace(/from "\.\.\/components\/common\/PageMeta"/g, 'from "../../components/common/PageMeta"');
        content = content.replace(/from "\.\.\/styles\/pages\//g, 'from "../../styles/pages/');
      } else {
        content = content.replace(/from "\.\.\/\.\.\/components\/common\/PageMeta"/g, 'from "../components/common/PageMeta"');
        content = content.replace(/from "\.\.\/\.\.\/styles\/pages\//g, 'from "../styles/pages/');
      }
      fs.writeFileSync(full, content);
    }
  }
}

fixImports(SRC_PAGES, false);
console.log("Imports in client/src/pages fixed!");
