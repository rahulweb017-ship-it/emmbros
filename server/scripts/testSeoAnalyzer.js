import {
  analyzeSeo,
  resolveTemplateVariables,
  detectPassiveVoice,
  extractParagraphsFromHtml,
} from "../../client/src/admin/utils/seoAnalyzer.js";

function runSeoAnalyzerTests() {
  console.log("=== Starting Phase 5 SEO & Readability Unit Test Suite ===");

  // Test 1: Template Variable Resolution
  const resolved = resolveTemplateVariables("%title% | Leading Automotive Forging | %sitename%", {
    title: "Precision Engine Components",
    sitename: "Emmbros",
  });
  if (resolved !== "Precision Engine Components | Leading Automotive Forging | Emmbros") {
    throw new Error(`Template variable resolution failed. Got: "${resolved}"`);
  }
  console.log("✓ Template Variable Resolution verified.");

  // Test 2: Passive Voice Heuristic
  const passiveText = "The forging dies were inspected by our quality control engineers. The precision components are manufactured in Baddi.";
  const passiveResult = detectPassiveVoice(passiveText);
  if (passiveResult.passiveCount < 1 || passiveResult.percentage === 0) {
    throw new Error("Passive voice detection failed.");
  }
  console.log(`✓ Passive Voice Detection verified (${passiveResult.passiveCount}/${passiveResult.totalSentences} sentences passive = ${passiveResult.percentage.toFixed(1)}%).`);

  // Test 3: Long Paragraph Extraction
  const sampleHtml = `<p>${"Word ".repeat(160)}</p><p>Short paragraph.</p>`;
  const paragraphs = extractParagraphsFromHtml(sampleHtml);
  if (paragraphs.length !== 2) {
    throw new Error("Paragraph extraction failed.");
  }
  console.log("✓ Long Paragraph Extraction verified.");

  // Test 4: Full High-Score Analysis including Readability
  const fillerSentence1 = "Our facility in Baddi operates modern forging press lines. ";
  const fillerSentence2 = "We produce precision steel components for tier-1 automotive OEMs. ";
  const fillerSentence3 = "Our quality control team inspects every part with care. ";
  
  const sampleContent = `
    <p>Emmbros Autocomp is a premier manufacturer specializing in <strong>automotive forging</strong> components for precision machinery.</p>
    <h2>Advanced Automotive Forging Capabilities</h2>
    <p>${(fillerSentence1 + fillerSentence2 + fillerSentence3).repeat(10)}</p>
    <p>Our engineering team operates press lines handling steel grades from 0.5kg up to 15kg. Learn more about our manufacturing <a href="/capabilities">capabilities</a> or review industry standards at <a href="https://iso.org">ISO Standards</a>.</p>
    <img src="/uploads/forging-press.webp" alt="Automotive forging press machine" />
  `;

  const metaTitle = "Automotive Forging Manufacturer Baddi | Emmbros India"; // 53 chars
  const metaDescription = "Leading automotive forging manufacturer in Baddi specializing in high precision steel components for Tier-1 OEMs worldwide."; // 123 chars

  const goodAnalysis = analyzeSeo({
    title: "Automotive Forging Manufacturer Baddi",
    slug: "automotive-forging-manufacturer-baddi",
    content: sampleContent,
    excerpt: "Leading automotive forging manufacturer in Baddi.",
    seo: {
      focusKeyword: "automotive forging",
      metaTitle,
      metaDescription,
      ogImage: "/uploads/forging-press.webp",
    },
    type: "post",
  });

  if (goodAnalysis.overallRating !== "good") {
    console.error("Good analysis failed checks:", goodAnalysis.checks.filter((c) => c.status !== "good"));
    throw new Error(`Expected overall rating "good", but got "${goodAnalysis.overallRating}".`);
  }
  console.log(
    `✓ Comprehensive SEO & Readability Analysis verified (Rating: "${goodAnalysis.overallRating}", Passed: ${goodAnalysis.goodCount}/${goodAnalysis.totalChecks}).`
  );

  console.log("\nALL SEO ANALYZER & READABILITY TESTS PASSED CLEANLY!");
}

runSeoAnalyzerTests();
