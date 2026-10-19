import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PAGES_DIR = path.resolve(__dirname, "../../client/src/pages");

function cleanFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  
  // 1. Remove srcset attributes that contain wp-content
  content = content.replace(/\s+srcset="[^"]*wp-content[^"]*"/gi, "");
  
  // 2. Remove sizes attributes associated with removed srcset
  content = content.replace(/\s+sizes="\(max-width:[^"]*"/gi, "");

  // 3. Remove any remaining wp-image-xxxx or wp-post-xxxx classes
  content = content.replace(/\bwp-image-\d+\b/gi, "");
  content = content.replace(/\bwp-post-\d+\b/gi, "");

  // 4. Check for any remaining wp-content or wp-includes
  const matches = content.match(/wp-content|wp-includes/gi) || [];
  if (matches.length > 0) {
    console.warn(`[WARN] ${path.basename(filePath)} still has ${matches.length} matches!`);
  } else {
    console.log(`[CLEAN] ${path.basename(filePath)} has 0 wp-content/wp-includes references.`);
  }

  fs.writeFileSync(filePath, content);
}

function walk(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (item.endsWith(".jsx")) cleanFile(full);
  }
}

walk(PAGES_DIR);
