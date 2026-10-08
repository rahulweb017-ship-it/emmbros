/**
 * Pure utility module for evaluating Yoast-style On-Page SEO & Readability quality.
 * Computes live checklist items and overall health score (good, needs-improvement, poor).
 */

export function resolveTemplateVariables(text, { title = "", sitename = "Emmbros" } = {}) {
  if (!text) return "";
  return text
    .replace(/%title%/gi, title)
    .replace(/%sitename%/gi, sitename)
    .replace(/%category%/gi, "General");
}

export function extractTextFromHtml(html = "") {
  if (!html) return "";
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractHeadingsFromHtml(html = "") {
  if (!html) return [];
  const headingRegex = /<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi;
  const headings = [];
  let match;
  while ((match = headingRegex.exec(html)) !== null) {
    const text = extractTextFromHtml(match[1]);
    if (text) headings.push(text);
  }
  return headings;
}

export function extractParagraphsFromHtml(html = "") {
  if (!html) return [];
  const paraRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  const paragraphs = [];
  let match;
  while ((match = paraRegex.exec(html)) !== null) {
    const text = extractTextFromHtml(match[1]);
    if (text) paragraphs.push(text);
  }
  if (paragraphs.length === 0) {
    const rawText = extractTextFromHtml(html);
    return rawText.split(/\n\s*\n/).filter(Boolean);
  }
  return paragraphs;
}

export function extractImagesFromHtml(html = "") {
  if (!html) return [];
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  const images = [];
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    const tag = match[0];
    const src = match[1];
    const altMatch = tag.match(/alt=["']([^"']*)["']/i);
    const alt = altMatch ? altMatch[1] : null;
    images.push({ src, alt, hasAlt: Boolean(alt && alt.trim()) });
  }
  return images;
}

export function extractLinksFromHtml(html = "") {
  if (!html) return { internal: [], external: [] };
  const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>/gi;
  const internal = [];
  const external = [];
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1];
    if (
      href.startsWith("/") ||
      href.startsWith("#") ||
      href.includes("emmbros.com") ||
      href.startsWith("./") ||
      href.startsWith("../")
    ) {
      internal.push(href);
    } else if (href.startsWith("http://") || href.startsWith("https://")) {
      external.push(href);
    }
  }
  return { internal, external };
}

// Passive Voice Heuristic Detector
export function detectPassiveVoice(text = "") {
  if (!text.trim()) return { passiveCount: 0, totalSentences: 0, percentage: 0 };
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sentences.length === 0) return { passiveCount: 0, totalSentences: 0, percentage: 0 };

  const passiveRegex = /\b(am|is|are|was|were|be|been|being)\s+([a-z]+ed|done|made|seen|built|given|taken|found|written|chosen|forged|cast|machined|processed)\b/i;

  let passiveCount = 0;
  sentences.forEach((sentence) => {
    if (passiveRegex.test(sentence)) {
      passiveCount++;
    }
  });

  const percentage = (passiveCount / sentences.length) * 100;
  return { passiveCount, totalSentences: sentences.length, percentage };
}

export function analyzeSeo({ title = "", slug = "", content = "", excerpt = "", seo = {}, type = "post" }) {
  const metaTitle = resolveTemplateVariables(seo.metaTitle || title, { title, sitename: "Emmbros" });
  const metaDescription = seo.metaDescription || excerpt || extractTextFromHtml(content).slice(0, 155);
  const focusKeyword = (seo.focusKeyword || "").trim().toLowerCase();
  const canonicalUrl = seo.canonicalUrl || "";
  const ogImage = seo.ogImage || "";

  const checks = [];

  // 1. Focus Keyword Set
  if (!focusKeyword) {
    checks.push({
      id: "focus-keyword-set",
      status: "error",
      label: "Focus Keyword",
      message: "No focus keyword is set for this content. Pick a keyword or phrase to optimize for.",
    });
  } else {
    checks.push({
      id: "focus-keyword-set",
      status: "good",
      label: "Focus Keyword",
      message: `Focus keyword is set to "${focusKeyword}".`,
    });
  }

  // 2. Keyword in Meta Title
  if (focusKeyword) {
    const titleLower = metaTitle.toLowerCase();
    const kwIndex = titleLower.indexOf(focusKeyword);
    if (kwIndex === -1) {
      checks.push({
        id: "keyword-in-title",
        status: "error",
        label: "Keyword in Title",
        message: "The focus keyword does not appear in the SEO Meta Title.",
      });
    } else if (kwIndex <= 20) {
      checks.push({
        id: "keyword-in-title",
        status: "good",
        label: "Keyword in Title",
        message: "The focus keyword appears at the beginning of the SEO Meta Title.",
      });
    } else {
      checks.push({
        id: "keyword-in-title",
        status: "warning",
        label: "Keyword in Title",
        message: "The focus keyword appears in the SEO Meta Title, but not near the beginning.",
      });
    }
  }

  // 3. Keyword in Meta Description
  if (focusKeyword) {
    const descLower = metaDescription.toLowerCase();
    if (descLower.includes(focusKeyword)) {
      checks.push({
        id: "keyword-in-description",
        status: "good",
        label: "Keyword in Description",
        message: "The focus keyword appears in the Meta Description.",
      });
    } else {
      checks.push({
        id: "keyword-in-description",
        status: "error",
        label: "Keyword in Description",
        message: "The focus keyword does not appear in the Meta Description.",
      });
    }
  }

  // 4. Keyword in Slug
  if (focusKeyword) {
    const normalizedSlug = (slug || "").toLowerCase().replace(/[^a-z0-9]/g, " ");
    const normalizedKw = focusKeyword.replace(/[^a-z0-9]/g, " ");
    if (normalizedSlug.includes(normalizedKw)) {
      checks.push({
        id: "keyword-in-slug",
        status: "good",
        label: "Keyword in Slug",
        message: "The focus keyword appears in the URL slug.",
      });
    } else {
      checks.push({
        id: "keyword-in-slug",
        status: "warning",
        label: "Keyword in Slug",
        message: "The focus keyword is not in the URL slug.",
      });
    }
  }

  // Raw body text & Word count
  const rawText = extractTextFromHtml(content);
  const words = rawText ? rawText.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;

  // 5. Keyword in First Paragraph
  if (focusKeyword) {
    const firstParaMatch = content.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    const firstParaText = firstParaMatch ? extractTextFromHtml(firstParaMatch[1]).toLowerCase() : rawText.slice(0, 300).toLowerCase();
    if (firstParaText.includes(focusKeyword)) {
      checks.push({
        id: "keyword-in-first-paragraph",
        status: "good",
        label: "First Paragraph",
        message: "The focus keyword appears in the first paragraph of your content.",
      });
    } else {
      checks.push({
        id: "keyword-in-first-paragraph",
        status: "warning",
        label: "First Paragraph",
        message: "Your focus keyword doesn't appear in the first paragraph.",
      });
    }
  }

  // 6. Keyword in Headings
  if (focusKeyword) {
    const headings = extractHeadingsFromHtml(content);
    const hasKwInHeading = headings.some((h) => h.toLowerCase().includes(focusKeyword));
    if (hasKwInHeading) {
      checks.push({
        id: "keyword-in-heading",
        status: "good",
        label: "Subheadings",
        message: "The focus keyword appears in at least one subheading (H2/H3).",
      });
    } else if (headings.length > 0) {
      checks.push({
        id: "keyword-in-heading",
        status: "warning",
        label: "Subheadings",
        message: "Use your focus keyword in at least one subheading (H2/H3).",
      });
    } else {
      checks.push({
        id: "keyword-in-heading",
        status: "warning",
        label: "Subheadings",
        message: "No subheadings found in content. Add subheadings containing your focus keyword.",
      });
    }
  }

  // 7. Keyword Density
  if (focusKeyword && wordCount > 0) {
    const kwWords = focusKeyword.split(/\s+/).filter(Boolean).length;
    const regex = new RegExp(focusKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    const matches = rawText.match(regex);
    const occurrences = matches ? matches.length : 0;
    const density = ((occurrences * kwWords) / wordCount) * 100;

    if (density >= 0.5 && density <= 2.5) {
      checks.push({
        id: "keyword-density",
        status: "good",
        label: "Keyword Density",
        message: `Keyword density is ${density.toFixed(1)}% (${occurrences} occurrence${occurrences === 1 ? "" : "s"}), which is in the ideal 0.5–2.5% range.`,
      });
    } else if (density > 0 && density < 0.5) {
      checks.push({
        id: "keyword-density",
        status: "warning",
        label: "Keyword Density",
        message: `Keyword density is ${density.toFixed(1)}% (${occurrences} occurrence${occurrences === 1 ? "" : "s"}). Try using your keyword a few more times.`,
      });
    } else if (density > 2.5) {
      checks.push({
        id: "keyword-density",
        status: "error",
        label: "Keyword Density",
        message: `Keyword density is ${density.toFixed(1)}% (${occurrences} occurrences), which is high. Avoid keyword stuffing.`,
      });
    } else {
      checks.push({
        id: "keyword-density",
        status: "error",
        label: "Keyword Density",
        message: "The focus keyword was not found in the main body text.",
      });
    }
  }

  // 8. Content Length Check
  const minWords = type === "job" ? 200 : type === "page" ? 250 : 300;
  if (wordCount >= minWords) {
    checks.push({
      id: "content-length",
      status: "good",
      label: "Content Length",
      message: `The text contains ${wordCount} words, exceeding the recommended minimum of ${minWords} words.`,
    });
  } else if (wordCount >= Math.floor(minWords * 0.7)) {
    checks.push({
      id: "content-length",
      status: "warning",
      label: "Content Length",
      message: `The text contains ${wordCount} words. We recommend at least ${minWords} words.`,
    });
  } else {
    checks.push({
      id: "content-length",
      status: "error",
      label: "Content Length",
      message: `The text contains only ${wordCount} words. This is far below the recommended minimum of ${minWords} words.`,
    });
  }

  // 9. Meta Title Length
  const titleLen = metaTitle.length;
  if (titleLen >= 50 && titleLen <= 60) {
    checks.push({
      id: "title-length",
      status: "good",
      label: "Meta Title Length",
      message: `Meta title length is ideal (${titleLen} characters).`,
    });
  } else if ((titleLen >= 35 && titleLen < 50) || (titleLen > 60 && titleLen <= 70)) {
    checks.push({
      id: "title-length",
      status: "warning",
      label: "Meta Title Length",
      message: `Meta title is ${titleLen} characters (ideal range is 50–60 characters).`,
    });
  } else {
    checks.push({
      id: "title-length",
      status: "error",
      label: "Meta Title Length",
      message: `Meta title length is ${titleLen} characters (too ${titleLen < 35 ? "short" : "long"}). Aim for 50–60 characters.`,
    });
  }

  // 10. Meta Description Length
  const descLen = metaDescription.length;
  if (descLen >= 120 && descLen <= 155) {
    checks.push({
      id: "description-length",
      status: "good",
      label: "Meta Description Length",
      message: `Meta description length is ideal (${descLen} characters).`,
    });
  } else if ((descLen >= 80 && descLen < 120) || (descLen > 155 && descLen <= 170)) {
    checks.push({
      id: "description-length",
      status: "warning",
      label: "Meta Description Length",
      message: `Meta description is ${descLen} characters (ideal range is 120–155 characters).`,
    });
  } else {
    checks.push({
      id: "description-length",
      status: "error",
      label: "Meta Description Length",
      message: `Meta description length is ${descLen} characters (too ${descLen < 80 ? "short" : "long"}). Aim for 120–155 characters.`,
    });
  }

  // 11. Image Alt Text Check
  const images = extractImagesFromHtml(content);
  if (images.length === 0 && !ogImage) {
    checks.push({
      id: "image-alt",
      status: "warning",
      label: "Images & Alt Attributes",
      message: "No images found in content or featured/OG image set. Adding visual media improves engagement.",
    });
  } else {
    const missingAltCount = images.filter((img) => !img.hasAlt).length;
    if (missingAltCount === 0) {
      checks.push({
        id: "image-alt",
        status: "good",
        label: "Images & Alt Attributes",
        message: "Featured/OG image is set and all content images have descriptive alt attributes.",
      });
    } else {
      checks.push({
        id: "image-alt",
        status: "warning",
        label: "Images & Alt Attributes",
        message: `${missingAltCount} image${missingAltCount > 1 ? "s" : ""} in content missing alt text attributes.`,
      });
    }
  }

  // 12. Internal & External Links Check
  const links = extractLinksFromHtml(content);
  if (links.internal.length > 0 && links.external.length > 0) {
    checks.push({
      id: "link-analysis",
      status: "good",
      label: "Link Analysis",
      message: `Found ${links.internal.length} internal link(s) and ${links.external.length} external link(s).`,
    });
  } else if (links.internal.length > 0 || links.external.length > 0) {
    checks.push({
      id: "link-analysis",
      status: "warning",
      label: "Link Analysis",
      message: links.internal.length === 0 ? "No internal links found in content." : "No outbound external links found in content.",
    });
  } else {
    checks.push({
      id: "link-analysis",
      status: "warning",
      label: "Link Analysis",
      message: "No internal or external links found in the content.",
    });
  }

  // 13. Slug Cleanliness Check
  const isCleanSlug = /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug || "");
  if (isCleanSlug && (slug || "").length <= 50) {
    checks.push({
      id: "clean-slug",
      status: "good",
      label: "URL Slug",
      message: "URL slug is clean, lowercase, and concise.",
    });
  } else {
    checks.push({
      id: "clean-slug",
      status: "warning",
      label: "URL Slug",
      message: "URL slug contains uppercase/special characters or is unnecessarily long.",
    });
  }

  // ================= READABILITY CHECKS =================

  // 14. Readability: Average Sentence Length
  const sentenceList = rawText ? rawText.split(/(?<=[.!?])\s+/).filter(Boolean) : [];
  const avgSentenceLength = sentenceList.length > 0 ? wordCount / sentenceList.length : 0;
  if (avgSentenceLength <= 20) {
    checks.push({
      id: "readability-sentence-length",
      status: "good",
      label: "Sentence Length",
      message: `Average sentence length is ${avgSentenceLength.toFixed(1)} words (ideal is <= 20 words). Great readability.`,
    });
  } else if (avgSentenceLength <= 25) {
    checks.push({
      id: "readability-sentence-length",
      status: "warning",
      label: "Sentence Length",
      message: `Average sentence length is ${avgSentenceLength.toFixed(1)} words. Try using shorter sentences to improve readability.`,
    });
  } else {
    checks.push({
      id: "readability-sentence-length",
      status: "error",
      label: "Sentence Length",
      message: `Average sentence length is ${avgSentenceLength.toFixed(1)} words (too long). Break up long sentences into concise statements.`,
    });
  }

  // 15. Readability: Paragraph Length
  const paragraphs = extractParagraphsFromHtml(content);
  const longParagraphs = paragraphs.filter((p) => p.split(/\s+/).filter(Boolean).length > 150);
  if (longParagraphs.length === 0) {
    checks.push({
      id: "readability-paragraph-length",
      status: "good",
      label: "Paragraph Length",
      message: "Paragraph length is well balanced. None of the paragraphs exceed 150 words.",
    });
  } else {
    checks.push({
      id: "readability-paragraph-length",
      status: "warning",
      label: "Paragraph Length",
      message: `${longParagraphs.length} paragraph${longParagraphs.length > 1 ? "s contain" : " contains"} more than 150 words. Consider splitting long paragraphs.`,
    });
  }

  // 16. Readability: Passive Voice Heuristic
  const passiveData = detectPassiveVoice(rawText);
  if (passiveData.percentage <= 10) {
    checks.push({
      id: "readability-passive-voice",
      status: "good",
      label: "Passive Voice",
      message: `${passiveData.percentage.toFixed(1)}% of the sentences contain passive voice, which is within the recommended maximum of 10%.`,
    });
  } else if (passiveData.percentage <= 20) {
    checks.push({
      id: "readability-passive-voice",
      status: "warning",
      label: "Passive Voice",
      message: `${passiveData.percentage.toFixed(1)}% of the sentences contain passive voice. Try using active verbs for higher impact.`,
    });
  } else {
    checks.push({
      id: "readability-passive-voice",
      status: "error",
      label: "Passive Voice",
      message: `${passiveData.percentage.toFixed(1)}% of sentences use passive voice (too high). Rewrite using active voice.`,
    });
  }

  // Calculate Overall Score
  const goodCount = checks.filter((c) => c.status === "good").length;
  const warningCount = checks.filter((c) => c.status === "warning").length;
  const errorCount = checks.filter((c) => c.status === "error").length;

  let overallRating = "good";
  if (errorCount > 2 || (errorCount > 0 && goodCount < checks.length / 2)) {
    overallRating = "poor";
  } else if (errorCount > 0 || warningCount > 3) {
    overallRating = "needs-improvement";
  }

  return {
    overallRating, // "good" | "needs-improvement" | "poor"
    goodCount,
    warningCount,
    errorCount,
    totalChecks: checks.length,
    checks,
  };
}
