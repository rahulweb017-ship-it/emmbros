import React, { useEffect, useState } from "react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 150);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Also check on mount
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="ekit-btt__button"
      style={{
        position: "fixed",
        bottom: 84,
        right: 20,
        zIndex: 9998,
        backgroundColor: "#98C8E9",
        color: "#0b141f",
        border: "none",
        borderRadius: "50%",
        width: 50,
        height: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.15)",
        cursor: "pointer",
        transition: "opacity 0.2s ease, transform 0.2s ease, background-color 0.2s ease",
        fontSize: "18px"
      }}
      aria-label="Scroll to top"
    >
      <i className="fas fa-arrow-up" style={{ fontSize: "16px" }}></i>
    </button>
  );
}
