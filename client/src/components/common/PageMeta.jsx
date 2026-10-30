import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import {
  SITE_URL,
  SITE_NAME,
  SEO_PAGES,
  normalizeCanonicalPath,
  getCanonicalUrl,
  buildPageJsonLd,
} from "../../config/seoConfig";

export function PageMeta({
  title,
  description,
  canonicalUrl,
  ogImage,
  ogType,
  robots,
  breadcrumbs,
  customJsonLd,
}) {
  const location = useLocation();
  const routeKey = normalizeCanonicalPath(canonicalUrl || location.pathname || "/");
  const config = SEO_PAGES[routeKey] || {};

  const resolvedTitle = config.title || title;
  const resolvedDescription = config.description || description;
  const resolvedCanonicalPath = config.canonicalPath || canonicalUrl || routeKey;
  const fullCanonical = resolvedCanonicalPath.startsWith("http")
    ? resolvedCanonicalPath
    : getCanonicalUrl(resolvedCanonicalPath);

  if (!resolvedTitle || !resolvedDescription || !fullCanonical) {
    const msg = `[SEO Error] Missing required metadata (title, description, or canonical) for route "${routeKey}"`;
    if (typeof process !== "undefined" && process.env?.NODE_ENV === "production") {
      throw new Error(msg);
    } else {
      console.error(msg);
    }
  }

  const rawOgImage = config.ogImage || ogImage || "/assets/og/home-og.webp";
  const fullOgImage = rawOgImage.startsWith("http") ? rawOgImage : `${SITE_URL}${rawOgImage}`;
  const resolvedOgType = config.ogType || ogType || "website";
  const resolvedRobots = config.robots || robots || "index, follow";

  const jsonLdGraph = customJsonLd || buildPageJsonLd(routeKey, {
    title: resolvedTitle,
    description: resolvedDescription,
    canonicalUrl: resolvedCanonicalPath,
    ogImage: rawOgImage,
    breadcrumbs: breadcrumbs || config.breadcrumbs,
  });

  return (
    <Helmet prioritizeSeoTags>
      <html lang="en" />
      <title>{resolvedTitle}</title>
      <meta name="description" content={resolvedDescription} />
      <link rel="canonical" href={fullCanonical} />
      <meta name="robots" content={resolvedRobots} />

      {/* Open Graph */}
      <meta property="og:title" content={resolvedTitle} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:type" content={resolvedOgType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={resolvedTitle} />
      <meta name="twitter:description" content={resolvedDescription} />
      <meta name="twitter:image" content={fullOgImage} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">{JSON.stringify(jsonLdGraph)}</script>
    </Helmet>
  );
}
