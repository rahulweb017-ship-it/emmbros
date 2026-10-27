import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.resolve(__dirname, "../../client/public");
const STYLES_DIR = path.resolve(__dirname, "../../client/src/styles");
const map = JSON.parse(fs.readFileSync(path.join(__dirname, "asset-copy-map.json"), "utf8"));

const cssFiles = [
  "wp-includes/css/dashicons.min.css",
  "wp-content/plugins/gutenkit-blocks-addon/build/gutenkit/frontend-common.css",
  "wp-content/themes/hello-elementor/assets/css/reset.css",
  "wp-content/themes/hello-elementor/assets/css/theme.css",
  "wp-content/themes/hello-elementor/assets/css/header-footer.css",
  "wp-content/plugins/elementor/assets/css/frontend.min.css",
  "wp-content/plugins/elementor/assets/css/conditionals/apple-webkit.min.css",
  "wp-content/plugins/elementor/assets/css/widget-heading.min.css",
  "wp-content/plugins/elementor/assets/css/widget-image.min.css",
  "wp-content/plugins/elementor/assets/css/widget-icon-list.min.css",
  "wp-content/plugins/elementor/assets/css/widget-image-box.min.css",
  "wp-content/plugins/elementor/assets/css/widget-divider.min.css",
  "wp-content/plugins/elementor/assets/css/widget-spacer.min.css",
  "wp-content/plugins/elementor/assets/css/widget-video.min.css",
  "wp-content/plugins/elementor/assets/css/widget-social-icons.min.css",
  "wp-content/plugins/elementor/assets/css/widget-image-gallery.min.css",
  "wp-content/plugins/elementor/assets/lib/swiper/v8/css/swiper.min.css",
  "wp-content/plugins/elementor/assets/css/conditionals/e-swiper.min.css",
  "wp-content/plugins/elementor/assets/css/widget-image-carousel.min.css",
  "wp-content/plugins/elementor/assets/lib/animations/styles/e-animation-wobble-to-bottom-right.min.css",
  "wp-content/plugins/elementor/assets/lib/animations/styles/e-animation-grow.min.css",
  "wp-content/plugins/elementskit-lite/widgets/init/assets/css/widget-styles.css",
  "wp-content/plugins/elementskit-lite/widgets/init/assets/css/responsive.css",
  "wp-content/plugins/click-to-chat-for-whatsapp/new/inc/assets/css/main.css",
  "wp-content/plugins/contact-form-7/includes/css/styles.css",
  "wp-content/plugins/wp-social/assets/css/frontend.css",
  "wp-content/plugins/wp-social/assets/css/font-icon.css",
];

function cleanCssStyles(content) {
  let s = content;

  // Rewrite any asset references inside CSS using our asset map
  for (const [orig, item] of Object.entries(map)) {
    if (s.includes(orig)) {
      s = s.replaceAll(orig, item.targetRel);
    }
  }

  // Strip Elementor lazyload media queries that hide background-image on viewports <= 1024px height
  s = s.replace(
    /@media\s+screen\s+and\s+\(max-height:\s*(?:1024|640)px\)\s*\{\s*\.(?:eal|e)-con\.(?:eal|e)-parent:nth-of-type\(n\+[23]\):not\(\.e-lazyloaded\):not\(\.e-no-lazyload\)\s*,\s*\.(?:eal|e)-con\.(?:eal|e)-parent:nth-of-type\(n\+[23]\):not\(\.e-lazyloaded\):not\(\.e-no-lazyload\)\s*\*\s*\{\s*background-image:\s*none\s*!important;\s*\}\s*\}/g,
    ""
  );

  // Replace class selectors and animation names
  s = s.replace(/\.elementor-([a-zA-Z0-9_-]+)/g, ".eal-$1");
  s = s.replace(/keyframes\s+elementor-([a-zA-Z0-9_-]+)/g, "keyframes eal-$1");
  s = s.replace(/animation-name:\s*elementor-([a-zA-Z0-9_-]+)/g, "animation-name:eal-$1");
  s = s.replace(/\.elementor\b/g, ".eal-page");
  s = s.replace(/\.ekit-([a-zA-Z0-9_-]+)/g, ".eal-kit-$1");
  s = s.replace(/\.e-con-boxed\b/g, ".eal-con-boxed");
  s = s.replace(/\.e-con-full\b/g, ".eal-con-full");
  s = s.replace(/\.e-con-inner\b/g, ".eal-con-inner");
  s = s.replace(/\.e-con\b/g, ".eal-con");
  s = s.replace(/\.e-flex\b/g, ".eal-flex");
  s = s.replace(/\.e-parent\b/g, ".eal-parent");
  s = s.replace(/\.e-child\b/g, ".eal-child");
  s = s.replace(/\.e-font-icon-svg\b/g, ".eal-icon-svg");
  s = s.replace(/\.e-eicon-play\b/g, ".eal-icon-play");

  // Map Elementor CSS custom property names
  s = s.replace(/--elementor-/g, "--eal-");
  s = s.replace(/--e-/g, "--eal-");

  return s;
}

let bundle = "/* Emmbros Consolidated Site Styles */\n";

for (const rel of cssFiles) {
  const abs = path.join(PUBLIC, rel);
  if (!fs.existsSync(abs)) {
    console.warn("CSS file not found:", rel);
    continue;
  }
  const content = fs.readFileSync(abs, "utf8");
  bundle += `\n/* === Source: ${rel} === */\n` + content + "\n";
}

bundle = cleanCssStyles(bundle);
fs.writeFileSync(path.join(STYLES_DIR, "global.css"), bundle);
console.log("global.css created and sanitized, size:", bundle.length);

// Also sanitize kit.css and all page CSS files (removing lazyload blocks and mapping classes/assets)
function walkAndCleanCss(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      walkAndCleanCss(full);
    } else if (item.endsWith(".css") && item !== "global.css") {
      const orig = fs.readFileSync(full, "utf8");
      const cleaned = cleanCssStyles(orig);
      fs.writeFileSync(full, cleaned);
      console.log(`Sanitized CSS: ${item} (size: ${cleaned.length})`);
    }
  }
}
walkAndCleanCss(STYLES_DIR);
