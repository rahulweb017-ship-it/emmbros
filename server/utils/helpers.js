import sanitizeHtml from "sanitize-html";

export function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function sanitizeContent(html) {
  if (typeof html !== "string") return html;
  return sanitizeHtml(html, {
    allowedTags: [
      "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "p", "a", "ul", "ol",
      "nl", "li", "b", "i", "strong", "em", "strike", "code", "hr", "br", "div",
      "table", "thead", "caption", "tbody", "tr", "th", "td", "pre", "iframe",
      "img", "span", "figure", "figcaption"
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "rel", "title"],
      img: ["src", "srcset", "alt", "title", "width", "height", "loading"],
      iframe: ["src", "width", "height", "frameborder", "allowfullscreen"],
      "*": ["class", "id", "style"]
    },
    allowedSchemes: ["http", "https", "mailto", "tel", "data"],
  });
}
