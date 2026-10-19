import React, { useState } from "react";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const body = new FormData();
      body.append("your-name", formData.name);
      body.append("your-email", formData.email);
      body.append("your-phone", formData.phone);
      body.append("your-subject", formData.subject);
      body.append("your-message", formData.message);
      body.append("__page", window.location.pathname);

      const res = await fetch("/api/contact", {
        method: "POST",
        body
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus({ ok: true, message: "Thank you. Your message has been sent successfully." });
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        setStatus({ ok: false, message: data.error || "Failed to send message. Please try again." });
      }
    } catch (err) {
      setStatus({ ok: false, message: "Network error. Please try again later." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="emmbros-contact-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {status && (
        <div style={{
          padding: "10px 14px",
          borderRadius: 6,
          fontSize: 14,
          background: status.ok ? "#ecfdf5" : "#fef2f2",
          color: status.ok ? "#065f46" : "#b91c1c",
          border: `1px solid ${status.ok ? "#a7f3d0" : "#fecaca"}`
        }}>
          {status.message}
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <input
          type="text"
          className="admin-input"
          placeholder="Your Name *"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="email"
          className="admin-input"
          placeholder="Email Address *"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <input
          type="tel"
          className="admin-input"
          placeholder="Phone Number *"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <input
          type="text"
          className="admin-input"
          placeholder="Subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
        />
      </div>
      <textarea
        className="admin-textarea"
        rows={4}
        placeholder="Your Message..."
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
      />
      <button
        type="submit"
        disabled={submitting}
        style={{
          background: "#002c40",
          color: "#ffffff",
          border: "none",
          padding: "12px 24px",
          borderRadius: 4,
          fontWeight: 600,
          cursor: "pointer",
          alignSelf: "flex-start"
        }}
      >
        {submitting ? "Sending..." : "Submit Inquiry"}
      </button>
    </form>
  );
}
