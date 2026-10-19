import React from "react";
import { Helmet } from "react-helmet-async";

export function PageMeta({ title, description, canonicalUrl, ogImage, ogType = "website" }) {
  const fullCanonical = canonicalUrl ? (canonicalUrl.startsWith("http") ? canonicalUrl : `https://emmbros.com${canonicalUrl}`) : "https://emmbros.com/";
  const fullOgImage = ogImage ? (ogImage.startsWith("http") ? ogImage : `https://emmbros.com${ogImage}`) : "https://emmbros.com/assets/images/logo1.webp";

  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={fullCanonical} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:type" content={ogType} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={fullOgImage} />
    </Helmet>
  );
}
