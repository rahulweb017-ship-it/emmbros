import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Calendar, User, ArrowLeft, Tag } from "lucide-react";
import { apiClient } from "../../api/apiClient";

export function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get(`/api/posts/${slug}`);
        setPost(res.data);
      } catch (err) {
        setError("Article not found or no longer published.");
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 20px", textAlign: "center", color: "#6b7280" }}>
        Loading article...
      </div>
    );
  }

  if (error || !post) {
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
        <Helmet>
          <title>404 - Article Not Found | Emmbros Autocomp</title>
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#111827", marginBottom: 16 }}>404 - Article Not Found</h1>
        <p style={{ color: "#4b5563", marginBottom: 24 }}>The blog post you are looking for does not exist or has been removed.</p>
        <Link to="/blog" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>
          <ArrowLeft size={16} /> Back to Blog List
        </Link>
      </div>
    );
  }

  const seoTitle = post.seo?.metaTitle || `${post.title} | Emmbros Autocomp`;
  const seoDesc = post.seo?.metaDescription || post.excerpt || "";
  const canonicalUrl = post.seo?.canonicalUrl || `https://emmbros.com/blog/${post.slug}`;
  const ogImage = post.seo?.ogImage || post.featuredImage?.url || "";

  return (
    <article style={{ maxWidth: 840, margin: "0 auto", padding: "40px 20px 80px 20px" }}>
      <Helmet>
        <title>{seoTitle}</title>
        {seoDesc && <meta name="description" content={seoDesc} />}
        <link rel="canonical" href={canonicalUrl} />
        {post.seo?.noindex && <meta name="robots" content="noindex" />}
        {post.seo?.nofollow && <meta name="robots" content="nofollow" />}

        {/* Open Graph Tags */}
        <meta property="og:title" content={post.seo?.ogTitle || seoTitle} />
        <meta property="og:description" content={post.seo?.ogDescription || seoDesc} />
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.seo?.ogTitle || seoTitle} />
        <meta name="twitter:description" content={post.seo?.ogDescription || seoDesc} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}
      </Helmet>

      {/* Back Link */}
      <Link to="/blog" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#4b5563", fontSize: 14, fontWeight: 500, textDecoration: "none", marginBottom: 24 }}>
        <ArrowLeft size={16} /> Back to Blog
      </Link>

      {/* Meta Bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13, color: "#6b7280", marginBottom: 16, flexWrap: "wrap" }}>
        {post.category && (
          <span style={{ background: "#eff6ff", color: "#1d4ed8", padding: "4px 12px", borderRadius: 16, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Tag size={12} /> {post.category}
          </span>
        )}
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <Calendar size={14} />
          {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
        {post.author?.name && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <User size={14} /> {post.author.name}
          </span>
        )}
      </div>

      {/* Main Title */}
      <h1 style={{ fontSize: 36, fontWeight: 800, color: "#111827", lineHeight: 1.25, marginBottom: 24 }}>
        {post.title}
      </h1>

      {/* Featured Image */}
      {post.featuredImage?.url && (
        <img
          src={post.featuredImage.url}
          alt={post.featuredImage.alt || post.title}
          style={{ width: "100%", maxHeight: 440, objectFit: "cover", borderRadius: 12, marginBottom: 32 }}
        />
      )}

      {/* Rich Text Body Content */}
      <div
        className="blog-content-body"
        style={{ fontSize: 17, lineHeight: 1.7, color: "#374151" }}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
