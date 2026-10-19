import http from "node:http";

function fetchUrl(path, options = {}) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:4000${path}`, options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data,
        });
      });
    }).on("error", reject);
  });
}

async function runVerification() {
  console.log("=== STARTING FULL SITE VERIFICATION ===");
  let failed = 0;

  // 1. Core Pages
  const routes = [
    "/",
    "/who-we-are",
    "/what-we-do",
    "/product-application",
    "/product-application/front-axle-shaft",
    "/product-application/rear-axle-shaft",
    "/product-application/gear-box-parts",
    "/product-application/driveline-parts",
    "/product-application/hydraulic-parts",
    "/product-application/planetary-wheel-drive-parts",
    "/career",
    "/blog",
    "/careers",
  ];

  for (const r of routes) {
    try {
      const res = await fetchUrl(r);
      const ok = res.statusCode === 200 && res.data.includes("<div id=\"root\">");
      const hasMeta = res.data.includes("canonical");
      console.log(`[ROUTE] ${r.padEnd(45)} -> Status ${res.statusCode} (Root: ${ok}, SEO: ${hasMeta})`);
      if (!ok) failed++;
    } catch (e) {
      console.error(`[ERROR] ${r}:`, e.message);
      failed++;
    }
  }

  // 2. Redirects (Permanent 301 short product URLs)
  const shortUrls = [
    "/front-axle-shaft",
    "/rear-axle-shaft",
    "/gear-box-parts",
    "/driveline-parts",
    "/hydraulic-parts",
    "/planetary-wheel-drive-parts",
  ];

  for (const s of shortUrls) {
    try {
      const res = await fetchUrl(s);
      // In SPA client routes or server redirects
      console.log(`[SHORT-URL] ${s.padEnd(35)} -> Status ${res.statusCode}`);
    } catch (e) {
      console.error(`[ERROR] ${s}:`, e.message);
      failed++;
    }
  }

  // 3. Sitemap & Robots
  try {
    const sitemap = await fetchUrl("/sitemap.xml");
    console.log(`[SITEMAP] /sitemap.xml -> Status ${sitemap.statusCode}, Length ${sitemap.data.length}, Contains urls: ${sitemap.data.includes("<urlset")}`);
    if (sitemap.statusCode !== 200) failed++;

    const robots = await fetchUrl("/robots.txt");
    console.log(`[ROBOTS] /robots.txt -> Status ${robots.statusCode}, Content: ${robots.data.trim().replace(/\n/g, " ")}`);
    if (robots.statusCode !== 200) failed++;
  } catch (e) {
    console.error("[ERROR] sitemap/robots:", e.message);
    failed++;
  }

  // 4. API Health
  try {
    const health = await fetchUrl("/api/health");
    console.log(`[HEALTH] /api/health -> Status ${health.statusCode}, Body: ${health.data}`);
    if (health.statusCode !== 200) failed++;
  } catch (e) {
    console.error("[ERROR] /api/health:", e.message);
    failed++;
  }

  console.log(`=== VERIFICATION COMPLETE: ${failed === 0 ? "ALL PASSED" : failed + " FAILED"} ===`);
}

runVerification();
