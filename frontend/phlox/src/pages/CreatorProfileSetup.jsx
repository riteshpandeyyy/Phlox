import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function CreatorProfileSetup() {
  const [form, setForm] = useState({
    niche: "",
    followers: "",
    engagementRate: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "followers" ? parseInt(value) || "" : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convert engagementRate to decimal
      const payload = {
        niche: form.niche,
        followers: parseInt(form.followers),
        engagementRate: parseFloat(form.engagementRate),
        bio: form.bio,
      };

      console.log("Creating profile with:", payload);
      const response = await API.post("/creator/profile", payload);
      alert("Creator profile created successfully!");
      console.log("Profile created:", response.data);
      navigate("/campaigns");
    } catch (err) {
      console.error("Error creating profile:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        err.message ||
        "Failed to create profile";
      setError(errorMessage);
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "50px auto" }}>
      <h1>Create Your Creator Profile</h1>
      <p style={{ color: "#666", marginBottom: "30px" }}>
        Set up your profile to start applying for campaigns
      </p>

      {error && (
        <div
          style={{
            color: "red",
            padding: "10px",
            backgroundColor: "#ffe6e6",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>
            Niche
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
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>
            Followers
          </label>
          <input
            type="number"
            name="followers"
            placeholder="e.g., 5000"
            value={form.followers}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>
            Engagement Rate (0-1)
          </label>
          <input
            type="number"
            name="engagementRate"
            placeholder="e.g., 0.15"
            step="0.01"
            min="0"
            max="1"
            value={form.engagementRate}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>
            Bio
          </label>
          <textarea
            name="bio"
            placeholder="Tell us about yourself"
            value={form.bio}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              boxSizing: "border-box",
              minHeight: "100px",
              fontFamily: "inherit",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: "#3b82f6",
            color: "white",
            padding: "12px 24px",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            width: "100%",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Creating Profile..." : "Create Profile"}
        </button>
      </form>
    </div>
  );
}

export default CreatorProfileSetup;
