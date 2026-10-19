import fs from "node:fs";
import path from "node:path";

const cssFiles = [
  "client/public/wp-content/plugins/elementor/assets/lib/font-awesome/css/fontawesome.min.css",
  "client/public/wp-content/plugins/elementor/assets/lib/font-awesome/css/solid.min.css",
  "client/public/wp-content/plugins/elementor/assets/lib/font-awesome/css/brands.min.css",
  "client/public/wp-content/plugins/skyboot-custom-icons-for-elementor/assets/css/elegant.css",
  "client/public/wp-content/plugins/skyboot-custom-icons-for-elementor/assets/css/linearicons.css",
  "client/public/wp-content/plugins/elementor/assets/lib/eicons/css/elementor-icons.min.css",
];

let bundle = "/* Site Icon Fonts (FontAwesome, Elegant, Linearicons, Eicons) */\n";

for (const f of cssFiles) {
  if (!fs.existsSync(f)) {
    console.warn("File missing:", f);
    continue;
  }
  let content = fs.readFileSync(f, "utf8");
  // Rewrite font urls to /assets/fonts/...
  content = content.replace(/url\(['"]?([^'"\)]+?)['"]?\)/g, (match, url) => {
    const cleanUrl = url.split("?")[0].split("#")[0];
    const baseName = path.basename(cleanUrl);
    if ([".woff", ".woff2", ".ttf", ".eot", ".svg"].includes(path.extname(baseName).toLowerCase())) {
      return `url("/assets/fonts/${baseName}")`;
    }
    return match;
  });
  bundle += `\n/* === ${path.basename(f)} === */\n` + content + "\n";
}

bundle += `
/* === Essential SVG Icon Sizing & Normalization === */
.ekit-svg-icon,
svg.ekit-svg-icon {
  width: 1em;
  height: 1em;
  max-width: 24px;
  max-height: 24px;
  fill: currentColor;
  vertical-align: middle;
}
.elementor-icon-list-icon svg,
.eal-icon-list-icon svg {
  width: var(--e-icon-list-icon-size, var(--eal-icon-list-icon-size, 16px));
  height: var(--e-icon-list-icon-size, var(--eal-icon-list-icon-size, 16px));
  max-width: 20px;
  max-height: 20px;
  fill: currentColor;
  display: inline-block;
  vertical-align: middle;
}
.elementor-social-icon svg,
.eal-social-icon svg {
  width: var(--icon-size, 16px);
  height: var(--icon-size, 16px);
  max-width: 20px;
  max-height: 20px;
  fill: currentColor;
}
.elementskit-submenu-indicator,
.icon-down-arrow1 {
  width: 10px;
  height: 10px;
  fill: currentColor;
  margin-left: 6px;
  display: inline-block;
}
`;

fs.writeFileSync("client/src/styles/icons.css", bundle);
console.log("icons.css rebuilt successfully, size:", bundle.length);
