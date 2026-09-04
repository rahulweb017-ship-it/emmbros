// Maps a site path (as it existed on the WordPress site) to a mirrored page slug + title.
export const ROUTES = [
  { path: "/", slug: "home", title: "Emmbros Autocomp Ltd | Auto Parts Mfr in Baddi, HP" },
  { path: "/who-we-are/", slug: "who-we-are", title: "About Emmbros Autocomp Ltd | Precision Engineering Baddi" },
  { path: "/what-we-do/", slug: "what-we-do", title: "Forging Capabilities: Press & Upsetter Forged Parts | Emmbros" },
  { path: "/product-application/", slug: "product-application", title: "Product Application | Emmbros Autocomp Ltd" },
  { path: "/product-application/front-axle-shaft/", slug: "front-axle-shaft", title: "Front Axle Shafts & Wheel Shafts Manufacturer | Emmbros Autocomp" },
  { path: "/product-application/rear-axle-shaft/", slug: "rear-axle-shaft", title: "OEM Rear Axle Shafts Manufacturer | Emmbros Autocomp" },
  { path: "/product-application/gear-box-parts/", slug: "gear-box-parts", title: "OEM Gearbox Parts, Planet Carriers & Sprockets | Emmbros" },
  { path: "/product-application/driveline-parts/", slug: "driveline-parts", title: "OEM Driveline Parts, Cardan Shafts & Yokes Manufacturer | Emmbros" },
  { path: "/product-application/hydraulic-parts/", slug: "hydraulic-parts", title: "OEM Hydraulic Parts & Brake Pistons Manufacturer | Emmbros" },
  { path: "/product-application/planetary-wheel-drive-parts/", slug: "planetary-wheel-drive-parts", title: "Planetary Wheel Drive Parts & Flange Hubs | Emmbros" },
  { path: "/front-axle-shaft/", slug: "front-axle-shaft", title: "Front Axle Shafts & Wheel Shafts Manufacturer | Emmbros Autocomp" },
  { path: "/rear-axle-shaft/", slug: "rear-axle-shaft", title: "OEM Rear Axle Shafts Manufacturer | Emmbros Autocomp" },
  { path: "/gear-box-parts/", slug: "gear-box-parts", title: "OEM Gearbox Parts, Planet Carriers & Sprockets | Emmbros" },
  { path: "/driveline-parts/", slug: "driveline-parts", title: "OEM Driveline Parts, Cardan Shafts & Yokes Manufacturer | Emmbros" },
  { path: "/hydraulic-parts/", slug: "hydraulic-parts", title: "OEM Hydraulic Parts & Brake Pistons Manufacturer | Emmbros" },
  { path: "/planetary-wheel-drive-parts/", slug: "planetary-wheel-drive-parts", title: "Planetary Wheel Drive Parts & Flange Hubs | Emmbros" },
  { path: "/career/", slug: "career", title: "Career | Emmbros Autocomp Ltd" },
];

function norm(p) {
  if (!p) return "/";
  p = p.split("?")[0];
  if (p.length > 1 && !p.endsWith("/")) p += "/";
  return p;
}

export function matchRoute(pathname) {
  const n = norm(pathname);
  const cleanSlug = n.replace(/^\/|\/$/g, "").split("/").pop();
  return (
    ROUTES.find((r) => norm(r.path) === n) ||
    ROUTES.find((r) => r.slug === cleanSlug) ||
    ROUTES.find((r) => r.path === "/")
  );
}
