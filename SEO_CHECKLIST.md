# Emmbros Autocomp Ltd – Technical SEO Checklist & Architecture Rules

All public pages on **https://emmbros.com** must comply with the rules below. The post-build script ([`client/scripts/seo-check.mjs`](file:///c:/xampp/htdocs/Emmbros/emmbros-react/client/scripts/seo-check.mjs)) runs automatically during `npm run build` and **fails the build** if any rule is violated.

---

## 1. Static Pre-Rendering (SSG)
- Every public route must be registered in [`client/src/config/seoConfig.js`](file:///c:/xampp/htdocs/Emmbros/emmbros-react/client/src/config/seoConfig.js) (`SEO_PAGES`) and [`client/src/routes/AppRoutes.jsx`](file:///c:/xampp/htdocs/Emmbros/emmbros-react/client/src/routes/AppRoutes.jsx).
- Do **not** access `window`, `document`, or `localStorage` outside `useEffect` or event handlers so that `vite build --ssr src/entry-server.jsx` can statically pre-render every route into `dist/<route>/index.html`.
- Every built HTML file must contain the rendered `<h1>`, full body text, internal `<a href>` links, `<head>` metadata, and JSON-LD structured data without requiring JavaScript execution.

## 2. Per-Page Metadata Rules
- **Centralized Config:** Always define page metadata in [`client/src/config/seoConfig.js`](file:///c:/xampp/htdocs/Emmbros/emmbros-react/client/src/config/seoConfig.js) and render `<PageMeta canonicalUrl="/your-route" />` on the page.
- **`<title>` (50–60 characters):**
  - Must be **unique** across all pages.
  - Format: `Primary Keyword First | Emmbros Autocomp Ltd` (or `Emmbros Autocomp`).
  - **Never** use abbreviations like `"Mfr"` or `"HP"` — always write `"Manufacturer"` and `"Himachal Pradesh"`.
- **`<meta name="description">` (140–160 characters):**
  - Must be **unique** across all pages and end with a clear call to action (e.g., *"Request an OEM quote today."*).
- **Canonical URL:**
  - Must be self-referencing, `https://emmbros.com` (non-`www`), with **no trailing slash** on inner pages (`https://emmbros.com/who-we-are`) and a trailing slash only on the root homepage (`https://emmbros.com/`).
- **Open Graph & Twitter Cards:**
  - Every page must set `og:title`, `og:description`, `og:url`, `og:type`, `og:site_name` (`"Emmbros Autocomp Ltd"`), and a **1200×630 WebP image** in `/assets/og/<slug>-og.webp` (never use the company logo as `og:image`).
- **Robots Meta:**
  - Public pages: `index, follow`
  - Error (`404`), admin (`/admin/*`), thank-you, or search pages: `noindex, follow` (or `noindex, nofollow`).

## 3. On-Page Semantic Structure & Images
- **Headings:** Exactly **one `<h1>` per page**, followed by a logical `<h2>` → `<h3>` hierarchy.
- **Minimum Content Depth:** Every public indexable page must contain **at least 300 words** of unique, crawlable technical content.
- **Semantic Landmarks:** Use `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, and `<footer>`, plus `<Breadcrumbs />` on all inner pages.
- **Images:**
  - Every `<img>` must have a descriptive, non-empty `alt` attribute, explicit numeric `width` and `height` attributes, and WebP/AVIF format.
  - Use `loading="lazy"` on all below-the-fold images and `loading="eager"` + `fetchPriority="high"` on the LCP hero image.
- **Internal Links:** Always use `<Link to="/canonical-path">` (rendering real `<a href>` tags) without trailing slashes. Never use `onClick`-only navigation.

## 4. Structured Data (JSON-LD)
- Rendered in static HTML via [`buildPageJsonLd()`](file:///c:/xampp/htdocs/Emmbros/emmbros-react/client/src/config/seoConfig.js):
  - `Organization` + `LocalBusiness` on every page (`foundingDate: "1991"`, Baddi address, phone, email, `sameAs` links).
  - `BreadcrumbList` on all inner pages.
  - `Product` schema on all `/product-application/*` product pages.
  - `ContactPage` schema on `/contact`.

## 5. Build & Verification Commands
```bash
cd client
npm run build       # Runs vite build + SSR build + SSG prerender + automated SEO audit
npm run seo:check   # Runs the standalone post-build SEO validator against dist/
```
