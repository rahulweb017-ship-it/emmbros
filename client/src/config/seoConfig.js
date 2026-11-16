export const SITE_URL = "https://emmbros.com";
export const SITE_NAME = "Emmbros Autocomp Ltd";

export const PLANT_LOCATIONS_SCHEMA = [
  {
    "@context": "https://schema.org",
    "@type": ["AutoPartsStore", "AutomotiveBusiness", "LocalBusiness"],
    "@id": `${SITE_URL}/#plant-katha`,
    name: "Emmbros Autocomp Ltd – Regd & Works (Katha Plant)",
    alternateName: "EAL Katha Plant (Unit 1)",
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
    branchOf: { "@id": `${SITE_URL}/#organization` },
    description:
      "Primary registered manufacturing works of Emmbros Autocomp Limited in Katha, Baddi. Features heavy closed-die forging presses, horizontal upsetters, and driveline manufacturing facilities.",
    image: `${SITE_URL}/assets/images/katha-plant-image.jpg-e1770114833911.webp`,
    telephone: "+91-78077-72004",
    email: "reception@emmbros.com",
    priceRange: "$$$",
    currenciesAccepted: "INR, USD, EUR",
    paymentAccepted: "Wire Transfer, Commercial Letter of Credit, Bank Transfer",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Village Katha",
      addressLocality: "Baddi, District Solan",
      addressRegion: "Himachal Pradesh",
      postalCode: "173205",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 30.9578,
      longitude: 76.7914,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": ["AutoPartsStore", "AutomotiveBusiness", "LocalBusiness"],
    "@id": `${SITE_URL}/#plant-bhud`,
    name: "Emmbros Autocomp Ltd – Corporate Office & Works (Bhud Plant)",
    alternateName: "EAL Bhud Plant (Unit 2)",
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
    branchOf: { "@id": `${SITE_URL}/#organization` },
    description:
      "Corporate headquarters and precision manufacturing plant of Emmbros Autocomp Limited in Bhud, Baddi, housing CNC turning centers, finish grinding, and quality testing labs.",
    image: `${SITE_URL}/assets/images/new-project-54.webp`,
    telephone: "+91-78078-80990",
    email: "enquiry@emmbros.com",
    priceRange: "$$$",
    currenciesAccepted: "INR, USD, EUR",
    paymentAccepted: "Wire Transfer, Commercial Letter of Credit, Bank Transfer",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Village Bhud",
      addressLocality: "Baddi, District Solan",
      addressRegion: "Himachal Pradesh",
      postalCode: "173205",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 30.9421,
      longitude: 76.8042,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": ["AutoPartsStore", "AutomotiveBusiness", "LocalBusiness"],
    "@id": `${SITE_URL}/#plant-epip`,
    name: "Emmbros Autocomp Ltd – EPIP Forging & Machining Works",
    alternateName: "EAL EPIP Plant (Unit 3)",
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
    branchOf: { "@id": `${SITE_URL}/#organization` },
    description:
      "Advanced manufacturing facility at EPIP Phase-1, Jharmajri, Baddi, equipped with vertical induction hardening scanners, spline rolling machines, and central metallurgical laboratory.",
    image: `${SITE_URL}/assets/images/new-project-30-1.webp`,
    telephone: "+91-98169-31822",
    email: "enquiry@emmbros.com",
    priceRange: "$$$",
    currenciesAccepted: "INR, USD, EUR",
    paymentAccepted: "Wire Transfer, Commercial Letter of Credit, Bank Transfer",
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
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
  },
];

export const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": ["Organization", "AutoPartsStore", "AutomotiveBusiness"],
  "@id": `${SITE_URL}/#organization`,
  name: "Emmbros Autocomp Ltd",
  legalName: "Emmbros Autocomp Limited",
  alternateName: ["Emmbros", "Emmbros Autocomp", "EAL"],
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
  currenciesAccepted: "INR, USD, EUR",
  paymentAccepted: "Wire Transfer, Commercial Letter of Credit, Bank Transfer",
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
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+91-98169-31822",
      email: "enquiry@emmbros.com",
      contactType: "sales",
      areaServed: ["IN", "US", "DE", "IT", "TR", "GB"],
      availableLanguage: ["English", "Hindi"],
    },
    {
      "@type": "ContactPoint",
      telephone: "+91-78077-72004",
      email: "reception@emmbros.com",
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    "@id": `${SITE_URL}/#product-catalog`,
    name: "Emmbros Autocomp OEM Forged & Machined Components",
    itemListElement: [
      {
        "@type": "OfferCatalog",
        name: "Rear Axle Shafts",
        url: `${SITE_URL}/product-application/rear-axle-shaft`,
      },
      {
        "@type": "OfferCatalog",
        name: "Front Axle Shafts",
        url: `${SITE_URL}/product-application/front-axle-shaft`,
      },
      {
        "@type": "OfferCatalog",
        name: "Driveline Parts & Cardan Shafts",
        url: `${SITE_URL}/product-application/driveline-parts`,
      },
      {
        "@type": "OfferCatalog",
        name: "Gearbox Parts & Transmission Gears",
        url: `${SITE_URL}/product-application/gear-box-parts`,
      },
      {
        "@type": "OfferCatalog",
        name: "Hydraulic Parts & Cylinder Pistons",
        url: `${SITE_URL}/product-application/hydraulic-parts`,
      },
      {
        "@type": "OfferCatalog",
        name: "Planetary Wheel Drive & Flange Hubs",
        url: `${SITE_URL}/product-application/planetary-wheel-drive-parts`,
      },
    ],
  },
  subOrganization: [
    { "@id": `${SITE_URL}/#plant-katha` },
    { "@id": `${SITE_URL}/#plant-bhud` },
    { "@id": `${SITE_URL}/#plant-epip` },
  ],
  department: [
    { "@id": `${SITE_URL}/#plant-katha` },
    { "@id": `${SITE_URL}/#plant-bhud` },
    { "@id": `${SITE_URL}/#plant-epip` },
  ],
  knowsAbout: [
    "Automotive Forging",
    "Rear Axle Shafts",
    "Front Axle Shafts",
    "Driveline Parts",
    "Cardan Shafts",
    "Transmission Gears",
    "Hydraulic Parts",
    "Planetary Wheel Drive",
    "Closed-Die Forging",
    "Upsetter Forging",
    "Induction Hardening",
    "CNC Machining",
    "IATF 16949 Quality Management",
  ],
  sameAs: [
    "https://www.facebook.com/emmbrosautocompltd",
    "https://www.instagram.com/emmbrosautocomp1/",
    "https://www.linkedin.com/in/emmbros-autocomp-limited-83724a94/",
    "https://emmpower.in/",
    "https://www.youtube.com/watch?v=LwSK2Yxii4c",
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
    schemaType: "Catalog",
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
      mpn: "EAL-RAS-SERIES",
      category: "Automotive Driveline & Axle Components",
      material: "SAE 4140, EN19C, SAE 1541, EN8DCr, SAE 15B41",
      capacity: "500,000+ shafts annually",
      weightRange: "0.5 kg to 65 kg",
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
      mpn: "EAL-FAS-SERIES",
      category: "Automotive Front Axle Components",
      material: "EN19 (SAE 4140), 42CrMo4, SAE 1045, EN24",
      capacity: "Tier-1 OEM high-volume production line",
      weightRange: "1.0 kg to 45 kg",
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
      mpn: "EAL-DLP-SERIES",
      category: "Automotive Driveline Components",
      material: "Carbon & Micro-Alloy Forging Steels (SAE 1045, 20MnCr5)",
      capacity: "High-speed forgings with complete heat traceability",
      weightRange: "0.5 kg to 35 kg",
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
      mpn: "EAL-GBP-SERIES",
      category: "Automotive Transmission Components",
      material: "Case-Hardening Alloy Steels (16MnCr5, 20MnCr5, SAE 8620)",
      capacity: "Automated CNC gear cell and spline rolling line",
      weightRange: "0.8 kg to 30 kg",
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
      mpn: "EAL-HYP-SERIES",
      category: "Hydraulic & Fluid Power Forgings",
      material: "High-Tensile Micro-Alloyed Carbon Steel, EN8D",
      capacity: "Integrated forging, induction hardening and precision cylindrical grinding",
      weightRange: "1.0 kg to 40 kg",
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
      mpn: "EAL-PWD-SERIES",
      category: "Planetary Axle & Wheel Drive Components",
      material: "High-Toughness Forged Alloy Steel, EN19 / 42CrMo4",
      capacity: "Heavy press forging & 5-axis CNC machining line",
      weightRange: "2.0 kg to 65 kg",
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

export function buildProductSchema(prod, canonicalUrl, ogImageUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${canonicalUrl}#product`,
    name: prod.name,
    sku: prod.sku,
    mpn: prod.mpn || prod.sku,
    category: prod.category,
    description: prod.description,
    image: [ogImageUrl],
    brand: {
      "@type": "Brand",
      name: "Emmbros Autocomp",
    },
    manufacturer: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Emmbros Autocomp Ltd",
    },
    offers: {
      "@type": "Offer",
      "@id": `${canonicalUrl}#offer`,
      url: canonicalUrl,
      priceCurrency: "INR",
      price: "0",
      priceValidUntil: "2027-12-31",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "AutoPartsStore",
        "@id": `${SITE_URL}/#organization`,
        name: "Emmbros Autocomp Ltd",
      },
      areaServed: ["IN", "US", "DE", "IT", "TR", "GB"],
      eligibleRegion: ["IN", "US", "DE", "IT", "TR", "GB"],
      businessFunction: "http://purl.org/goodrelations/v1#Sell",
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Material Grade",
        value: prod.material || "High-Tensile Alloy & Carbon Steels",
      },
      {
        "@type": "PropertyValue",
        name: "Manufacturing Process",
        value: "Closed-Die Press Forging, Upsetter Forging, Induction Hardening, CNC Machining",
      },
      {
        "@type": "PropertyValue",
        name: "Quality Certifications",
        value: "IATF 16949:2016, ISO 9001:2015, ISO 14001:2015, ISO 45001:2018",
      },
      {
        "@type": "PropertyValue",
        name: "Production Facility",
        value: "Emmbros Autocomp Baddi Plants (Katha, Bhud, EPIP Jharmajri)",
      },
      {
        "@type": "PropertyValue",
        name: "Country of Origin",
        value: "India",
      },
      ...(prod.capacity
        ? [{ "@type": "PropertyValue", name: "Annual Capacity", value: prod.capacity }]
        : []),
      ...(prod.weightRange
        ? [{ "@type": "PropertyValue", name: "Component Weight Range", value: prod.weightRange }]
        : []),
    ],
  };
}

export function buildPageJsonLd(routePath, customMeta = {}) {
  const norm = normalizeCanonicalPath(routePath);
  const pageConfig = SEO_PAGES[norm] || {};
  const canonicalUrl = getCanonicalUrl(customMeta.canonicalUrl || pageConfig.canonicalPath || norm);
  const ogImageUrl = (customMeta.ogImage || pageConfig.ogImage || "/assets/og/home-og.webp").startsWith("http")
    ? customMeta.ogImage || pageConfig.ogImage
    : `${SITE_URL}${customMeta.ogImage || pageConfig.ogImage || "/assets/og/home-og.webp"}`;

  const graph = [ORGANIZATION_SCHEMA];

  // Inject verified Plant Locations on Home, Contact, About, Manufacturing, and Catalog pages
  if (
    norm === "/" ||
    norm === "/contact" ||
    norm === "/who-we-are" ||
    norm === "/what-we-do" ||
    norm === "/product-application"
  ) {
    graph.push(...PLANT_LOCATIONS_SCHEMA);
  }

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

  // Catalog Category page: inject ItemList and all 6 Products
  if (norm === "/product-application" || pageConfig.schemaType === "Catalog") {
    const productRoutes = [
      "/product-application/rear-axle-shaft",
      "/product-application/front-axle-shaft",
      "/product-application/driveline-parts",
      "/product-application/gear-box-parts",
      "/product-application/hydraulic-parts",
      "/product-application/planetary-wheel-drive-parts",
    ];

    const catalogItems = productRoutes.map((pRoute, idx) => {
      const pCfg = SEO_PAGES[pRoute];
      const pProd = pCfg.productInfo;
      const pCanonical = getCanonicalUrl(pCfg.canonicalPath);
      const pOgImage = pCfg.ogImage.startsWith("http") ? pCfg.ogImage : `${SITE_URL}${pCfg.ogImage}`;
      return {
        "@type": "ListItem",
        position: idx + 1,
        name: pProd.name,
        url: pCanonical,
        item: buildProductSchema(pProd, pCanonical, pOgImage),
      };
    });

    graph.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${canonicalUrl}#catalog`,
      name: "Emmbros Autocomp OEM Automotive Components Catalog",
      description:
        "OEM catalog of precision forged and CNC-machined rear axle shafts, front axle shafts, driveline parts, transmission gears, hydraulic parts, and planetary drives.",
      numberOfItems: catalogItems.length,
      itemListElement: catalogItems,
    });
  }

  // Individual Product page
  if (pageConfig.schemaType === "Product" && pageConfig.productInfo) {
    graph.push(buildProductSchema(pageConfig.productInfo, canonicalUrl, ogImageUrl));
  }

  return graph;
}
