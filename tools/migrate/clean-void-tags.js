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
      // Remove any <link ...> or <meta ...> or <script ...> tags inside the body JSX
      content = content.replace(/<link[^>]*>/gi, "");
      content = content.replace(/<meta[^>]*>/gi, "");
      content = content.replace(/<script[\s\S]*?<\/script>/gi, "");
      // Close any stray void tags like <input ...> or <img ...>
      content = content.replace(/<(img|input|br|hr)([^>]*?)(?<!\/)>/gi, "<$1$2 />");
      fs.writeFileSync(full, content);
      console.log("Stripped link/meta/script tags in:", item);
    }
  }
}

cleanDir(SRC_PAGES);
