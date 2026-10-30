export const SITE_URL = "https://emmbros.com";
export const SITE_NAME = "Emmbros Autocomp Ltd";

export const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  "@id": `${SITE_URL}/#organization`,
  name: "Emmbros Autocomp Ltd",
  legalName: "Emmbros Autocomp Limited",
  url: `${SITE_URL}/`,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/assets/images/logo1.webp`,
    width: 280,
    height: 66,
  },
  image: `${SITE_URL}/assets/og/home-og.webp`,
  description:
    "IATF 16949:2016 certified manufacturer of rear axle shafts, front axle shafts, and closed-die forged driveline parts in Baddi, Himachal Pradesh since 1991. Trusted Tier-1 OEM supplier to Tata, Ashok Leyland, Mahindra, and global automotive manufacturers.",
  foundingDate: "1991",
  telephone: "+91-98169-31822",
  email: "enquiry@emmbros.com",
  priceRange: "$$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Plot No. 63, EPIP Phase-1, Jharmajri",
    addressLocality: "Baddi, District Solan",
    addressRegion: "Himachal Pradesh",
    postalCode: "174103",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 30.9384,
    longitude: 76.8103,
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+91-98169-31822",
      email: "enquiry@emmbros.com",
      contactType: "sales",
      areaServed: ["IN", "US", "DE", "IT", "TR", "GB"],
      availableLanguage: ["English", "Hindi"],
    },
  ],
  sameAs: [
    "https://www.facebook.com/emmbrosautocompltd",
    "https://www.instagram.com/emmbrosautocomp1/",
    "https://www.linkedin.com/in/emmbros-autocomp-limited-83724a94/",
    "https://emmpower.in/",
  ],
};

export function normalizeCanonicalPath(rawPath = "/") {
  if (!rawPath || rawPath === "/") return "/";
  const clean = rawPath.split("?")[0].split("#")[0].replace(/\/+$/, "");
  return clean || "/";
}

export function getCanonicalUrl(rawPath = "/") {
  const norm = normalizeCanonicalPath(rawPath);
  return norm === "/" ? `${SITE_URL}/` : `${SITE_URL}${norm}`;
}

export const SEO_PAGES = {
  "/": {
    title: "Rear Axle Shafts & Driveline Parts | Emmbros Autocomp Ltd",
    description:
      "IATF 16949 certified manufacturer of rear axle shafts and driveline parts in Baddi, Himachal Pradesh since 1991. Request an OEM forging quote from us today.",
    canonicalPath: "/",
    ogImage: "/assets/og/home-og.webp",
    ogType: "website",
    robots: "index, follow",
    priority: "1.0",
    changefreq: "weekly",
    breadcrumbs: [{ name: "Home", path: "/" }],
  },
  "/who-we-are": {
    title: "Automotive Forging Manufacturer India | Emmbros Autocomp",
    description:
      "Discover Emmbros Autocomp Ltd in Baddi, Himachal Pradesh, an IATF 16949 certified OEM automotive forging manufacturer since 1991. Contact our team today.",
    canonicalPath: "/who-we-are",
    ogImage: "/assets/og/who-we-are-og.webp",
    ogType: "website",
    robots: "index, follow",
    priority: "0.9",
    changefreq: "monthly",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Who We Are", path: "/who-we-are" },
    ],
  },
  "/what-we-do": {
    title: "Closed Die Forging & CNC Machining | Emmbros Autocomp Ltd",
    description:
      "Explore our closed-die press forging, upsetter forging, induction heat treatment, and precision CNC machining in Baddi, Himachal Pradesh. Request a quote.",
    canonicalPath: "/what-we-do",
    ogImage: "/assets/og/what-we-do-og.webp",
    ogType: "website",
    robots: "index, follow",
    priority: "0.9",
    changefreq: "monthly",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "What We Do", path: "/what-we-do" },
    ],
  },
  "/quality-certifications": {
    title: "IATF 16949 Quality & Certifications | Emmbros Autocomp Ltd",
    description:
      "IATF 16949:2016 and ISO 9001:2015 certified automotive forging quality lab in Baddi, Himachal Pradesh with CMM and metallurgy testing. Enquire with us now.",
    canonicalPath: "/quality-certifications",
    ogImage: "/assets/og/quality-certifications-og.webp",
    ogType: "website",
    robots: "index, follow",
    priority: "0.8",
    changefreq: "monthly",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Quality & Certifications", path: "/quality-certifications" },
    ],
  },
  "/industries-clients": {
    title: "OEM Automotive Industries & Clients | Emmbros Autocomp Ltd",
    description:
      "Trusted Tier-1 OEM supplier of forged axle shafts and driveline parts to Tata, Ashok Leyland, Mahindra, and global tractor manufacturers. Partner with us.",
    canonicalPath: "/industries-clients",
    ogImage: "/assets/og/industries-clients-og.webp",
    ogType: "website",
    robots: "index, follow",
    priority: "0.8",
    changefreq: "monthly",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Industries & Clients", path: "/industries-clients" },
    ],
  },
  "/contact": {
    title: "Contact Auto Parts Manufacturer Baddi | Emmbros Autocomp",
    description:
      "Contact Emmbros Autocomp Ltd in Baddi, Himachal Pradesh for custom OEM rear axle shafts, driveline forgings, and CNC machined parts. Send an enquiry now.",
    canonicalPath: "/contact",
    ogImage: "/assets/og/contact-og.webp",
    ogType: "website",
    robots: "index, follow",
    priority: "0.8",
    changefreq: "monthly",
    schemaType: "ContactPage",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Contact Us", path: "/contact" },
    ],
  },
  "/product-application": {
    title: "OEM Automotive Forged Driveline Parts | Emmbros Autocomp",
    description:
      "Browse our OEM catalog of rear axle shafts, front axle shafts, gearbox gears, driveline yokes, hydraulic parts, and planetary hubs. Request a quote today.",
    canonicalPath: "/product-application",
    ogImage: "/assets/og/product-application-og.webp",
    ogType: "website",
    robots: "index, follow",
    priority: "0.9",
    changefreq: "weekly",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Product Application", path: "/product-application" },
    ],
  },
  "/product-application/rear-axle-shaft": {
    title: "Rear Axle Shafts Manufacturer India | Emmbros Autocomp Ltd",
    description:
      "Leading OEM manufacturer of induction-hardened rear axle shafts for trucks, tractors, and commercial vehicles in Himachal Pradesh. Request your quote now.",
    canonicalPath: "/product-application/rear-axle-shaft",
    ogImage: "/assets/og/rear-axle-shaft-og.webp",
    ogType: "website",
    robots: "index, follow",
    priority: "0.9",
    changefreq: "weekly",
    schemaType: "Product",
    productInfo: {
      name: "OEM Rear Axle Shafts",
      sku: "EAL-RAS-001",
      category: "Automotive Driveline & Axle Components",
      description:
        "Precision upset-forged, CNC-machined, and induction-hardened rear axle shafts (flanged and full-floating) for commercial vehicles, agricultural tractors, and off-highway equipment.",
    },
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Product Application", path: "/product-application" },
      { name: "Rear Axle Shafts", path: "/product-application/rear-axle-shaft" },
    ],
  },
  "/product-application/front-axle-shaft": {
    title: "Front Axle Shafts Manufacturer India | Emmbros Autocomp",
    description:
      "Precision forged and CNC machined 4WD front axle shafts, stub axles, and steering drive shafts for tractors and commercial vehicles. Get an OEM quote now.",
    canonicalPath: "/product-application/front-axle-shaft",
    ogImage: "/assets/og/front-axle-shaft-og.webp",
    ogType: "website",
    robots: "index, follow",
    priority: "0.9",
    changefreq: "weekly",
    schemaType: "Product",
    productInfo: {
      name: "OEM Front Axle Shafts & Wheel Shafts",
      sku: "EAL-FAS-002",
      category: "Automotive Front Axle Components",
      description:
        "Closed-die forged and induction-hardened front axle shafts, 4WD front wheel drive shafts, stub axles, and steering spindles for tractors and heavy-duty vehicles.",
    },
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Product Application", path: "/product-application" },
      { name: "Front Axle Shafts", path: "/product-application/front-axle-shaft" },
    ],
  },
  "/product-application/driveline-parts": {
    title: "Driveline Parts & Cardan Shafts | Emmbros Autocomp Ltd",
    description:
      "High-torque OEM driveline parts, propeller shafts, cardan shafts, slip yokes, and flange yokes forged in Baddi, Himachal Pradesh. Request a custom quote.",
    canonicalPath: "/product-application/driveline-parts",
    ogImage: "/assets/og/driveline-parts-og.webp",
    ogType: "website",
    robots: "index, follow",
    priority: "0.9",
    changefreq: "weekly",
    schemaType: "Product",
    productInfo: {
      name: "OEM Driveline Parts, Cardan Shafts & Yokes",
      sku: "EAL-DLP-003",
      category: "Automotive Driveline Components",
      description:
        "Forged and precision-machined driveline components including cardan shafts, propeller shafts, flange yokes, slip yokes, weld yokes, and companion flanges.",
    },
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Product Application", path: "/product-application" },
      { name: "Driveline Parts", path: "/product-application/driveline-parts" },
    ],
  },
  "/product-application/gear-box-parts": {
    title: "Gearbox Parts & Transmission Gears | Emmbros Autocomp Ltd",
    description:
      "Precision forged transmission gears, main shafts, counter shafts, planet carriers, and sprockets for heavy commercial vehicles. Contact us for OEM quotes.",
    canonicalPath: "/product-application/gear-box-parts",
    ogImage: "/assets/og/gear-box-parts-og.webp",
    ogType: "website",
    robots: "index, follow",
    priority: "0.8",
    changefreq: "weekly",
    schemaType: "Product",
    productInfo: {
      name: "OEM Gearbox Parts & Transmission Shafts",
      sku: "EAL-GBP-004",
      category: "Automotive Transmission Components",
      description:
        "Closed-die forged and CNC-machined gearbox parts, main shafts, counter shafts, input shafts, planet carriers, and transmission gears for OEMs.",
    },
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Product Application", path: "/product-application" },
      { name: "Gear Box Parts", path: "/product-application/gear-box-parts" },
    ],
  },
  "/product-application/hydraulic-parts": {
    title: "Hydraulic Parts & Cylinder Pistons | Emmbros Autocomp Ltd",
    description:
      "Heavy-duty forged hydraulic lift shafts, rockshafts, brake pistons, and fluid power components for agricultural tractors and excavators. Enquire with us.",
    canonicalPath: "/product-application/hydraulic-parts",
    ogImage: "/assets/og/hydraulic-parts-og.webp",
    ogType: "website",
    robots: "index, follow",
    priority: "0.8",
    changefreq: "weekly",
    schemaType: "Product",
    productInfo: {
      name: "OEM Hydraulic Lift Shafts & Cylinder Pistons",
      sku: "EAL-HYP-005",
      category: "Hydraulic & Fluid Power Forgings",
      description:
        "Forged and precision-ground hydraulic lift shafts, rockshafts, cylinder pistons, and fluid system components for tractors and construction machinery.",
    },
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Product Application", path: "/product-application" },
      { name: "Hydraulic Parts", path: "/product-application/hydraulic-parts" },
    ],
  },
  "/product-application/planetary-wheel-drive-parts": {
    title: "Planetary Wheel Drive & Flange Hubs | Emmbros Autocomp Ltd",
    description:
      "OEM planetary wheel drive carriers, ring gears, sun gears, and wheel flange hubs engineered for off-highway and construction axles. Request a quote today.",
    canonicalPath: "/product-application/planetary-wheel-drive-parts",
    ogImage: "/assets/og/planetary-wheel-drive-parts-og.webp",
    ogType: "website",
    robots: "index, follow",
    priority: "0.8",
    changefreq: "weekly",
    schemaType: "Product",
    productInfo: {
      name: "OEM Planetary Wheel Drive Parts & Flange Hubs",
      sku: "EAL-PWD-006",
      category: "Planetary Axle & Wheel Drive Components",
      description:
        "Heavy-duty forged planetary carriers, wheel hubs, spindle shafts, and ring gear supports for off-highway, mining, and construction equipment.",
    },
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Product Application", path: "/product-application" },
      { name: "Planetary Wheel Drive Parts", path: "/product-application/planetary-wheel-drive-parts" },
    ],
  },
  "/career": {
    title: "Manufacturing Careers in Baddi | Emmbros Autocomp Ltd",
    description:
      "Build your engineering career at Emmbros Autocomp Ltd in Baddi, Himachal Pradesh. Explore openings in forging, CNC machining, and quality. Apply online now.",
    canonicalPath: "/career",
    ogImage: "/assets/og/career-og.webp",
    ogType: "website",
    robots: "index, follow",
    priority: "0.7",
    changefreq: "weekly",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Career", path: "/career" },
    ],
  },
  "/blog": {
    title: "Automotive Forging & Engineering Blog | Emmbros Autocomp",
    description:
      "Read technical insights on closed-die forging, induction hardening, driveline engineering, and OEM manufacturing from Emmbros Autocomp. Explore articles.",
    canonicalPath: "/blog",
    ogImage: "/assets/og/blog-og.webp",
    ogType: "website",
    robots: "index, follow",
    priority: "0.7",
    changefreq: "weekly",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
    ],
  },
  "/careers": {
    title: "Open Engineering & Plant Jobs Baddi | Emmbros Autocomp Ltd",
    description:
      "View current job openings in metallurgy, forging operations, CNC programming, and quality assurance at Emmbros Autocomp in Baddi. Submit your resume today.",
    canonicalPath: "/careers",
    ogImage: "/assets/og/careers-og.webp",
    ogType: "website",
    robots: "index, follow",
    priority: "0.7",
    changefreq: "weekly",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Open Positions", path: "/careers" },
    ],
  },
  "/404": {
    title: "Page Not Found - 404 Error | Emmbros Autocomp Limited",
    description:
      "The page you requested could not be found on Emmbros Autocomp Ltd. Browse our OEM rear axle shafts, driveline forgings, or return to the homepage now.",
    canonicalPath: "/404",
    ogImage: "/assets/og/home-og.webp",
    ogType: "website",
    robots: "noindex, follow",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Page Not Found", path: "/404" },
    ],
  },
};

export const PUBLIC_PRERENDER_ROUTES = Object.keys(SEO_PAGES).filter((r) => r !== "/404");

export function buildPageJsonLd(routePath, customMeta = {}) {
  const norm = normalizeCanonicalPath(routePath);
  const pageConfig = SEO_PAGES[norm] || {};
  const canonicalUrl = getCanonicalUrl(customMeta.canonicalUrl || pageConfig.canonicalPath || norm);
  const ogImageUrl = (customMeta.ogImage || pageConfig.ogImage || "/assets/og/home-og.webp").startsWith("http")
    ? customMeta.ogImage || pageConfig.ogImage
    : `${SITE_URL}${customMeta.ogImage || pageConfig.ogImage || "/assets/og/home-og.webp"}`;

  const graph = [ORGANIZATION_SCHEMA];

  if (norm === "/") {
    graph.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      publisher: { "@id": `${SITE_URL}/#organization` },
    });
  }

  const breadcrumbs = customMeta.breadcrumbs || pageConfig.breadcrumbs;
  if (breadcrumbs && breadcrumbs.length > 1) {
    graph.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${canonicalUrl}#breadcrumb`,
      itemListElement: breadcrumbs.map((b, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: b.name,
        item: getCanonicalUrl(b.path),
      })),
    });
  }

  if (pageConfig.schemaType === "ContactPage" || norm === "/contact") {
    graph.push({
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "@id": `${canonicalUrl}#contactpage`,
      url: canonicalUrl,
      name: customMeta.title || pageConfig.title,
      description: customMeta.description || pageConfig.description,
      mainEntity: { "@id": `${SITE_URL}/#organization` },
    });
  }

  if (pageConfig.schemaType === "Product" && pageConfig.productInfo) {
    const prod = pageConfig.productInfo;
    graph.push({
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": `${canonicalUrl}#product`,
      name: prod.name,
      sku: prod.sku,
      category: prod.category,
      description: prod.description,
      image: [ogImageUrl],
      brand: {
        "@type": "Brand",
        name: "Emmbros Autocomp Ltd",
      },
      manufacturer: { "@id": `${SITE_URL}/#organization` },
      offers: {
        "@type": "Offer",
        url: canonicalUrl,
        priceCurrency: "INR",
        price: "0",
        availability: "https://schema.org/InStock",
        seller: { "@id": `${SITE_URL}/#organization` },
      },
    });
  }

  return graph;
}
