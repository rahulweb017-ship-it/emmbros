import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.resolve(__dirname, "../../client/public");
const refs = JSON.parse(fs.readFileSync(path.join(__dirname, "all-asset-refs.json"), "utf8"));

const mapping = {};
const collisionCheck = {};

for (const ref of refs) {
  // Ignore css/js runtime plugins
  if (ref.endsWith(".css") || ref.endsWith(".js")) continue;
  
  const ext = path.extname(ref).toLowerCase();
  let category = "images";
  if (['.mp4', '.webm', '.mov'].includes(ext)) category = "videos";
  else if (['.svg'].includes(ext)) category = "icons";
  else if (['.woff', '.woff2', '.ttf', '.eot'].includes(ext)) category = "fonts";
  else if (['.pdf', '.doc', '.docx'].includes(ext)) category = "documents";
  
  // Clean filename: remove %20 and special characters, keep extension
  const decodedBase = decodeURIComponent(path.basename(ref));
  let cleanBase = decodedBase.replace(/[\s\(\)]+/g, "-").replace(/--+/g, "-").toLowerCase();
  
  // Handle collisions if distinct source files map to same cleanBase
  let targetName = cleanBase;
  let counter = 1;
  while (collisionCheck[targetName] && collisionCheck[targetName] !== ref) {
    const extname = path.extname(cleanBase);
    const bare = path.basename(cleanBase, extname);
    targetName = `${bare}-${counter}${extname}`;
    counter++;
  }
  collisionCheck[targetName] = ref;

  mapping[ref] = {
    sourceRel: ref,
    sourceAbs: path.join(PUBLIC, decodeURIComponent(ref.replace(/^\//, ""))),
    targetRel: `/assets/${category}/${targetName}`,
    targetAbs: path.join(PUBLIC, `assets/${category}/${targetName}`),
    category
  };
}

console.log("Total media assets to copy to public/assets/*:", Object.keys(mapping).length);
fs.writeFileSync(path.join(__dirname, "asset-copy-map.json"), JSON.stringify(mapping, null, 2));

// Copy files
for (const [ref, item] of Object.entries(mapping)) {
  fs.mkdirSync(path.dirname(item.targetAbs), { recursive: true });
  fs.copyFileSync(item.sourceAbs, item.targetAbs);
}

console.log("All media assets copied to public/assets/ successfully!");
