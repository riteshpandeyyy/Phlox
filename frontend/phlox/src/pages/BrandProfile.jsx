import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function BrandProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    companyName: "",
    industry: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await API.get("/brand/profile");
      setForm({
        companyName: response.data.companyName || "",
        industry: response.data.industry || "",
      });
      setProfileExists(true);
      setError(null);
    } catch (err) {
      // Profile doesn't exist yet
      setProfileExists(false);
      setForm({ companyName: "", industry: "" });
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        companyName: form.companyName,
        industry: form.industry,
      };

      if (profileExists) {
        await API.post("/brand/profile", payload);
        setSuccess("Brand profile updated successfully!");
      } else {
        await API.post("/brand/profile", payload);
        setSuccess("Brand profile created successfully!");
        setProfileExists(true);
      }

      console.log("Profile saved:", payload);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Error saving profile:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        err.message ||
        "Failed to save profile";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px", fontSize: "18px" }}>
        Loading your profile...
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "50px auto" }}>
      <h1>
        {profileExists ? "Update Your Brand Profile" : "Create Your Brand Profile"}
      </h1>
      <p style={{ color: "#666", marginBottom: "30px" }}>
        {profileExists
          ? "Update your brand information"
          : "Set up your brand profile to start creating campaigns"}
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
            Company Name *
          </label>
          <input
            type="text"
            name="companyName"
            placeholder="e.g., Nike, Apple, Coca-Cola"
            value={form.companyName}
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
          <small style={{ color: "#666" }}>Your company or brand name</small>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
            Industry *
          </label>
          <input
            type="text"
            name="industry"
            placeholder="e.g., Technology, Fashion, Healthcare"
            value={form.industry}
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
          <small style={{ color: "#666" }}>Your industry or business sector</small>
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
          {submitting
            ? "Saving..."
            : profileExists
            ? "Update Profile"
            : "Create Profile"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
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
          Back to Dashboard
        </button>
      </form>

      {profileExists && (
        <p style={{ marginTop: "20px", textAlign: "center", color: "#666" }}>
          Your brand profile is already set up. Update your information above if needed.
        </p>
      )}
    </div>
  );
}

export default BrandProfile;
