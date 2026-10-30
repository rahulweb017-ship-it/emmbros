import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Calendar, Tag, ArrowRight } from "lucide-react";
import { apiClient } from "../../api/apiClient";
import { PageMeta } from "../../components/common/PageMeta";
import { TechnicalSeoSection } from "../../components/seo/TechnicalSeoSection";

export function BlogListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const category = searchParams.get("category") || "";
  const searchQuery = searchParams.get("q") || "";

  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page,
          limit: 9,
          ...(category && { category }),
          ...(searchQuery && { q: searchQuery }),
        });
        const res = await apiClient.get(`/api/posts?${params}`);
        setPosts(res.data || []);
        setPagination(res.pagination || { page: 1, totalPages: 1, total: 0 });

        // Extract categories
        if (res.data) {
          const cats = [...new Set(res.data.map((p) => p.category).filter(Boolean))];
          setCategories(cats);
        }
      } catch (err) {
        console.error("Failed to load blog posts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [page, category, searchQuery]);

  return (
    <article>
      <div className="public-blog-view" style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
        <PageMeta canonicalUrl="/blog" />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, color: "#111827", marginBottom: 12 }}>
          Engineering & Manufacturing Blog
        </h1>
        <p style={{ fontSize: 16, color: "#4b5563", maxWidth: 640, margin: "0 auto" }}>
          Explore technical case studies, closed-die forging innovations, and metallurgical advancements from our engineering team.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            className="admin-btn"
            style={{
              background: !category ? "#2271b1" : "#f0f0f1",
              color: !category ? "#fff" : "#2c3338",
              border: "none",
              borderRadius: 20,
              padding: "6px 16px",
              fontSize: 13,
              cursor: "pointer",
            }}
            onClick={() => setSearchParams({ page: "1" })}
          >
            All Articles
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className="admin-btn"
              style={{
                background: category === cat ? "#2271b1" : "#f0f0f1",
                color: category === cat ? "#fff" : "#2c3338",
                border: "none",
                borderRadius: 20,
                padding: "6px 16px",
                fontSize: 13,
                cursor: "pointer",
              }}
              onClick={() => setSearchParams({ category: cat, page: "1" })}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Loading & Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>
          Loading blog posts...
        </div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, background: "#f9fafb", borderRadius: 12 }}>
          <h2 style={{ fontSize: 20, color: "#374151" }}>Latest Automotive Forging Publications</h2>
          <p style={{ color: "#6b7280", marginTop: 8 }}>Explore our engineering articles and metallurgical guides below.</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 28,
          }}
        >
          {posts.map((post) => (
            <article
              key={post._id}
              style={{
                background: "#fff",
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
            >
              {post.featuredImage?.url && (
                <Link to={`/blog/${post.slug}`}>
                  <img
                    src={post.featuredImage.url}
                    alt={post.featuredImage.alt || post.title}
                    width="400"
                    height="200"
                    loading="lazy"
                    style={{ width: "100%", height: 200, objectFit: "cover" }}
                  />
                </Link>
              )}
              <div style={{ padding: 20, display: "flex", flexDirection: "column", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: "#6b7280", marginBottom: 10 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <Calendar size={13} />
                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  {post.category && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#eff6ff", color: "#1d4ed8", padding: "2px 8px", borderRadius: 12, fontWeight: 500 }}>
                      <Tag size={11} /> {post.category}
                    </span>
                  )}
                </div>

                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", lineHeight: 1.4, marginBottom: 10 }}>
                  <Link to={`/blog/${post.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                    {post.title}
                  </Link>
                </h2>

                <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.5, flex: 1, marginBottom: 16 }}>
                  {post.excerpt || post.seo?.metaDescription || ""}
                </p>

                <Link
                  to={`/blog/${post.slug}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#2563eb",
                    textDecoration: "none",
                  }}
                >
                  <span>Read Article</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
      </div>
      <TechnicalSeoSection sectionKey="blog" />
    </article>
  );
}
