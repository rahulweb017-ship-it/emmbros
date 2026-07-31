// Maps a site path (as it existed on the WordPress site) to a mirrored page slug + title.
export const ROUTES = [
  { path: "/", slug: "home", title: "Emmbros Autocomp Ltd | Auto Parts Mfr in Baddi, HP" },
  { path: "/who-we-are/", slug: "who-we-are", title: "Who We Are | Emmbros Autocomp Ltd" },
  { path: "/what-we-do/", slug: "what-we-do", title: "What We Do | Emmbros Autocomp Ltd" },
  { path: "/product-application/", slug: "product-application", title: "Product Application | Emmbros Autocomp Ltd" },
  { path: "/product-application/front-axle-shaft/", slug: "front-axle-shaft", title: "Front Axle Parts | Emmbros Autocomp Ltd" },
  { path: "/product-application/rear-axle-shaft/", slug: "rear-axle-shaft", title: "Rear Axle Parts | Emmbros Autocomp Ltd" },
  { path: "/product-application/gear-box-parts/", slug: "gear-box-parts", title: "Gear Box Parts | Emmbros Autocomp Ltd" },
  { path: "/product-application/driveline-parts/", slug: "driveline-parts", title: "Driveline Parts | Emmbros Autocomp Ltd" },
  { path: "/product-application/hydraulic-parts/", slug: "hydraulic-parts", title: "Hydraulic Parts | Emmbros Autocomp Ltd" },
  { path: "/product-application/planetary-wheel-drive-parts/", slug: "planetary-wheel-drive-parts", title: "Planetary Wheel Drive Parts | Emmbros Autocomp Ltd" },
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
  return (
    ROUTES.find((r) => norm(r.path) === n) ||
    ROUTES.find((r) => r.path === "/")
  );
}
