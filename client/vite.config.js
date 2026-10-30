import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function viteDevSsrPlugin() {
  return {
    name: "emmbros-dev-ssr-seo",
    transformIndexHtml: {
      order: "post",
      async handler(html, ctx) {
        if (!ctx.server) return html;
        try {
          const rawUrl = ctx.originalUrl || ctx.path || "/";
          const cleanPath = rawUrl.split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";
          if (cleanPath.startsWith("/admin")) return html;

          const ssrMod = await ctx.server.ssrLoadModule("/src/entry-server.jsx");
          const {
            render,
            SITE_URL,
            SITE_NAME,
            SEO_PAGES,
            getCanonicalUrl,
            buildPageJsonLd,
          } = ssrMod;

          const routeKey = SEO_PAGES[cleanPath] ? cleanPath : "/404";
          const cfg = SEO_PAGES[routeKey] || SEO_PAGES["/"];
          const { appHtml } = render(cleanPath);

          const canonicalUrl = getCanonicalUrl(cfg.canonicalPath);
          const ogImageUrl = cfg.ogImage.startsWith("http")
            ? cfg.ogImage
            : `${SITE_URL}${cfg.ogImage}`;
          const jsonLdGraph = buildPageJsonLd(routeKey);

          const seoHeadBlock = [
            `<title>${escapeHtml(cfg.title)}</title>`,
            `<meta name="description" content="${escapeHtml(cfg.description)}" />`,
            `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`,
            `<meta name="robots" content="${escapeHtml(cfg.robots || "index, follow")}" />`,
            `<meta property="og:title" content="${escapeHtml(cfg.title)}" />`,
            `<meta property="og:description" content="${escapeHtml(cfg.description)}" />`,
            `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`,
            `<meta property="og:type" content="${escapeHtml(cfg.ogType || "website")}" />`,
            `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />`,
            `<meta property="og:image" content="${escapeHtml(ogImageUrl)}" />`,
            `<meta property="og:image:width" content="1200" />`,
            `<meta property="og:image:height" content="630" />`,
            `<meta name="twitter:card" content="summary_large_image" />`,
            `<meta name="twitter:title" content="${escapeHtml(cfg.title)}" />`,
            `<meta name="twitter:description" content="${escapeHtml(cfg.description)}" />`,
            `<meta name="twitter:image" content="${escapeHtml(ogImageUrl)}" />`,
            `<script type="application/ld+json">${JSON.stringify(jsonLdGraph)}</script>`,
          ].join("\n    ");

          return html
            .replace("<!--seo-head-->", seoHeadBlock)
            .replace("<!--app-html-->", appHtml);
        } catch (err) {
          console.error("[vite-dev-ssr] Error pre-rendering dev HTML:", err.message);
          return html;
        }
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), viteDevSsrPlugin()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:4000",
    },
  },
  ssr: {
    noExternal: ["react-helmet-async"],
  },
  build: {
    outDir: "dist",
    assetsInlineLimit: 0,
  },
});
