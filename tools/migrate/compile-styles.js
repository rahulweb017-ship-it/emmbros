import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.resolve(__dirname, "../../client/public");
const map = JSON.parse(fs.readFileSync(path.join(__dirname, "asset-copy-map.json"), "utf8"));

const cssFiles = [
  "wp-content/themes/hello-elementor/assets/css/reset.css",
  "wp-content/themes/hello-elementor/assets/css/theme.css",
  "wp-content/themes/hello-elementor/assets/css/header-footer.css",
  "wp-content/plugins/elementor/assets/css/frontend.min.css",
  "wp-content/plugins/elementor/assets/css/widget-heading.min.css",
  "wp-content/plugins/elementor/assets/css/widget-image.min.css",
  "wp-content/plugins/elementor/assets/css/widget-icon-list.min.css",
  "wp-content/plugins/elementor/assets/css/widget-image-box.min.css",
  "wp-content/plugins/elementor/assets/css/widget-divider.min.css",
  "wp-content/plugins/elementor/assets/css/widget-spacer.min.css",
  "wp-content/plugins/elementor/assets/css/widget-video.min.css",
  "wp-content/plugins/elementor/assets/css/widget-social-icons.min.css",
  "wp-content/plugins/elementskit-lite/widgets/init/assets/css/widget-styles.css",
  "wp-content/plugins/elementskit-lite/widgets/init/assets/css/responsive.css",
  "wp-content/plugins/click-to-chat-for-whatsapp/new/inc/assets/css/main.css",
  "wp-content/plugins/contact-form-7/includes/css/styles.css",
];

let bundle = "/* Emmbros Consolidated Site Styles */\n";

for (const rel of cssFiles) {
  const abs = path.join(PUBLIC, rel);
  if (!fs.existsSync(abs)) {
    console.warn("CSS file not found:", rel);
    continue;
  }
  let content = fs.readFileSync(abs, "utf8");
  
  // Rewrite any asset references inside CSS using our asset map
  for (const [orig, item] of Object.entries(map)) {
    if (content.includes(orig)) {
      content = content.replaceAll(orig, item.targetRel);
    }
  }
  bundle += `\n/* === Source: ${rel} === */\n` + content + "\n";
}

fs.writeFileSync(path.resolve(__dirname, "../../client/src/styles/global.css"), bundle);
console.log("global.css created, size:", bundle.length);
