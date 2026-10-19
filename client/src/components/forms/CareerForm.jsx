import React, { useState } from "react";

export function CareerForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email || !file) {
      setStatus("error");
      setMessage("Please fill in all required fields and attach your resume.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const data = new FormData();
      data.append("__page", "Career Application");
      data.append("Name", formData.name);
      data.append("Phone", formData.phone);
      data.append("Email", formData.email);
      data.append("Address", formData.address || "");
      if (file) {
        data.append("Resume", file);
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      if (json.ok) {
        setStatus("success");
        setMessage("Thank you for your application. We will get back to you soon!");
        setFormData({ name: "", phone: "", email: "", address: "" });
        setFile(null);
      } else {
        setStatus("error");
        setMessage(json.error || "Failed to submit application. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("An unexpected network error occurred. Please try again.");
    }
  };

  return (
    <div className="career-form-container">
      <form onSubmit={handleSubmit} className="career-form" noValidate>
        <div>
          <label htmlFor="career-name">Name *</label>
          <input
            id="career-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name here"
            required
          />
        </div>

        <div>
          <label htmlFor="career-phone">Phone *</label>
          <input
            id="career-phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            required
          />
        </div>

        <div>
          <label htmlFor="career-email">Email Address *</label>
          <input
            id="career-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Add email"
            required
          />
        </div>

        <div>
          <label htmlFor="career-address">Address</label>
          <input
            id="career-address"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Add address"
          />
        </div>

        <div>
          <label htmlFor="career-file">File Upload *</label>
          <input
            id="career-file"
            type="file"
            name="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            required
          />
        </div>

        <input
          type="submit"
          value={status === "loading" ? "Submitting..." : "Submit Application"}
          disabled={status === "loading"}
        />

        {message && (
          <div
            className="career-response-output"
            style={{
              marginTop: 15,
              padding: 12,
              background: status === "success" ? "#054d70" : "#842029",
              color: "#ffffff",
              borderRadius: 8,
              textAlign: "center",
              fontSize: 14,
            }}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
