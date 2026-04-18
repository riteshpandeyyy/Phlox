import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function CreateCampaign() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    niche: "",
    budget: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "budget" ? parseFloat(value) || "" : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate budget
      if (!form.budget || form.budget <= 0) {
        setError("Budget must be a positive number");
        setSubmitting(false);
        return;
      }

      const payload = {
        title: form.title,
        description: form.description,
        niche: form.niche,
        budget: parseFloat(form.budget),
      };

      console.log("Creating campaign with:", payload);
      await API.post("/campaign", payload);
      
      setSuccess("Campaign created successfully!");
      console.log("Campaign created successfully");
      
      setTimeout(() => {
        navigate("/campaigns");
      }, 1500);
    } catch (err) {
      console.error("Error creating campaign:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        err.message ||
        "Failed to create campaign";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Check if user is BRAND
  const userRole = localStorage.getItem("userRole");
  if (userRole !== "BRAND") {
    return (
      <div style={{ textAlign: "center", marginTop: "100px", color: "#991b1b" }}>
        <h2>❌ Access Denied</h2>
        <p>Only BRAND users can create campaigns.</p>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            backgroundColor: "#3b82f6",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Go Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: "700px", margin: "50px auto" }}>
      <h1>Create New Campaign</h1>
      <p style={{ color: "#666", marginBottom: "30px" }}>
        Launch a campaign to find the perfect creators for your brand
      </p>

      {error && (
        <div
          style={{
            color: "#991b1b",
            padding: "15px",
            backgroundColor: "#fee2e2",
            border: "1px solid #fca5a5",
            borderRadius: "6px",
            marginBottom: "20px",
          }}
        >
          ❌ Error: {error}
        </div>
      )}

      {success && (
        <div
          style={{
            color: "#065f46",
            padding: "15px",
            backgroundColor: "#d1fae5",
            border: "1px solid #6ee7b7",
            borderRadius: "6px",
            marginBottom: "20px",
          }}
        >
          ✅ {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
            Campaign Title *
          </label>
          <input
            type="text"
            name="title"
            placeholder="e.g., Summer Collection Launch"
            value={form.title}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              boxSizing: "border-box",
              fontSize: "14px",
            }}
          />
          <small style={{ color: "#666" }}>Give your campaign a catchy name</small>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
            Description *
          </label>
          <textarea
            name="description"
            placeholder="Describe your campaign, goals, and what you're looking for in creators"
            value={form.description}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              boxSizing: "border-box",
              fontSize: "14px",
              fontFamily: "inherit",
              minHeight: "120px",
              resize: "vertical",
            }}
          />
          <small style={{ color: "#666" }}>Provide detailed information about your campaign</small>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
            Niche *
          </label>
          <input
            type="text"
            name="niche"
            placeholder="e.g., Fashion, Technology, Beauty, Fitness"
            value={form.niche}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              boxSizing: "border-box",
              fontSize: "14px",
            }}
          />
          <small style={{ color: "#666" }}>The industry or category of your campaign</small>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
            Budget (USD) *
          </label>
          <input
            type="number"
            name="budget"
            placeholder="e.g., 5000"
            value={form.budget}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              boxSizing: "border-box",
              fontSize: "14px",
            }}
          />
          <small style={{ color: "#666" }}>Total budget allocated for this campaign</small>
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            backgroundColor: "#3b82f6",
            color: "white",
            padding: "12px 24px",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: submitting ? "not-allowed" : "pointer",
            width: "100%",
            opacity: submitting ? 0.6 : 1,
            marginBottom: "10px",
          }}
        >
          {submitting ? "Creating Campaign..." : "Create Campaign"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/campaigns")}
          style={{
            backgroundColor: "#6b7280",
            color: "white",
            padding: "12px 24px",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            width: "100%",
          }}
        >
          View Campaigns
        </button>
      </form>
    </div>
  );
}

export default CreateCampaign;
