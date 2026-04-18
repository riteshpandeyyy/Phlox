import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function CreatorProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    niche: "",
    followers: "",
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
      const response = await API.get("/creator/profile/me");
      setForm({
        niche: response.data.niche || "",
        followers: response.data.followers || "",
      });
      setProfileExists(true);
      setError(null);
    } catch (err) {
      // Profile doesn't exist yet
      setProfileExists(false);
      setForm({ niche: "", followers: "" });
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "followers" ? parseInt(value) || "" : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        niche: form.niche,
        followers: parseInt(form.followers),
        engagementRate: 0.15, // Default value
        bio: `Creator in ${form.niche} with ${form.followers} followers`,
      };

      if (profileExists) {
        await API.post("/creator/profile", payload);
        setSuccess("Profile updated successfully!");
      } else {
        await API.post("/creator/profile", payload);
        setSuccess("Profile created successfully!");
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
        {profileExists ? "Update Your Creator Profile" : "Create Your Creator Profile"}
      </h1>
      <p style={{ color: "#666", marginBottom: "30px" }}>
        {profileExists
          ? "Update your profile information"
          : "Set up your profile to start applying for campaigns"}
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
            Niche *
          </label>
          <input
            type="text"
            name="niche"
            placeholder="e.g., Technology, Fashion, Fitness"
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
          <small style={{ color: "#666" }}>The main category of content you create</small>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
            Followers *
          </label>
          <input
            type="number"
            name="followers"
            placeholder="e.g., 5000"
            value={form.followers}
            onChange={handleChange}
            required
            min="0"
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              boxSizing: "border-box",
              fontSize: "14px",
            }}
          />
          <small style={{ color: "#666" }}>Your follower count across social platforms</small>
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
          Your profile is already set up. Update your information above if needed.
        </p>
      )}
    </div>
  );
}

export default CreatorProfile;
