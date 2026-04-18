import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Dashboard() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [hasCreatorProfile, setHasCreatorProfile] = useState(false);
  const [hasBrandProfile, setHasBrandProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user role from localStorage
    const role = localStorage.getItem("userRole");
    setUserRole(role);

    // Check profile based on role
    if (role === "CREATOR") {
      checkCreatorProfile();
    } else if (role === "BRAND") {
      checkBrandProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const checkCreatorProfile = async () => {
    try {
      await API.get("/creator/profile/me");
      setHasCreatorProfile(true);
    } catch {
      setHasCreatorProfile(false);
    } finally {
      setLoading(false);
    }
  };

  const checkBrandProfile = async () => {
    try {
      await API.get("/brand/profile");
      setHasBrandProfile(true);
    } catch {
      setHasBrandProfile(false);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "24px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ marginBottom: "48px" }}>
          <h1 style={{ fontSize: "36px", fontWeight: "700", margin: "0 0 8px 0", color: "#1f2937" }}>
            Welcome to Phlox
          </h1>
          <p style={{ fontSize: "16px", color: "#6b7280", margin: "0" }}>
            Logged in as: <span style={{ fontWeight: "600", color: "#3b82f6" }}>{userRole}</span>
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 24px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px", animation: "spin 1s linear infinite" }}>
              ⏳
            </div>
            <p style={{ fontSize: "16px", color: "#6b7280", fontWeight: "500" }}>
              Loading your dashboard...
            </p>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <>
            {userRole === "CREATOR" && !hasCreatorProfile && (
              <div
                style={{
                  backgroundColor: "#fef3c7",
                  border: "1px solid #fbbf24",
                  borderRadius: "12px",
                  padding: "24px",
                  marginBottom: "24px",
                  display: "flex",
                  gap: "16px",
                  alignItems: "center",
                }}
              >
                <div style={{ fontSize: "32px" }}>📋</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#92400e", margin: "0 0 6px 0" }}>
                    Complete Your Profile
                  </h3>
                  <p style={{ fontSize: "14px", color: "#92400e", margin: "0" }}>
                    Set up your creator profile to start applying for campaigns
                  </p>
                </div>
                <button
                  onClick={() => navigate("/creator-profile-setup")}
                  style={{
                    backgroundColor: "#f59e0b",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#d97706")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#f59e0b")}
                >
                  Set Up Now
                </button>
              </div>
            )}

            {userRole === "CREATOR" && hasCreatorProfile && (
              <div
                style={{
                  backgroundColor: "#d1fae5",
                  border: "1px solid #6ee7b7",
                  borderRadius: "12px",
                  padding: "20px 24px",
                  marginBottom: "24px",
                  color: "#065f46",
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "24px" }}>✅</span>
                <p style={{ margin: "0", fontWeight: "500" }}>Your profile is complete! Ready to apply for campaigns.</p>
              </div>
            )}

            {userRole === "BRAND" && !hasBrandProfile && (
              <div
                style={{
                  backgroundColor: "#fef3c7",
                  border: "1px solid #fbbf24",
                  borderRadius: "12px",
                  padding: "24px",
                  marginBottom: "24px",
                  display: "flex",
                  gap: "16px",
                  alignItems: "center",
                }}
              >
                <div style={{ fontSize: "32px" }}>🏢</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#92400e", margin: "0 0 6px 0" }}>
                    Complete Your Brand Profile
                  </h3>
                  <p style={{ fontSize: "14px", color: "#92400e", margin: "0" }}>
                    Set up your brand profile to start creating campaigns
                  </p>
                </div>
                <button
                  onClick={() => navigate("/brand-profile")}
                  style={{
                    backgroundColor: "#f59e0b",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#d97706")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#f59e0b")}
                >
                  Set Up Now
                </button>
              </div>
            )}

            {userRole === "BRAND" && hasBrandProfile && (
              <div
                style={{
                  backgroundColor: "#d1fae5",
                  border: "1px solid #6ee7b7",
                  borderRadius: "12px",
                  padding: "20px 24px",
                  marginBottom: "24px",
                  color: "#065f46",
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "24px" }}>✅</span>
                <p style={{ margin: "0", fontWeight: "500" }}>Your brand profile is complete! Ready to create campaigns.</p>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button
                onClick={() => navigate("/campaigns")}
                style={{
                  width: "100%",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  padding: "14px 20px",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#2563eb")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#3b82f6")}
              >
                🎯 View Campaigns
              </button>

              {userRole === "CREATOR" && (
                <button
                  onClick={() => navigate("/my-applications")}
                  style={{
                    width: "100%",
                    backgroundColor: "#8b5cf6",
                    color: "white",
                    padding: "14px 20px",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "15px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#7c3aed")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#8b5cf6")}
                >
                  📋 My Applications
                </button>
              )}

              {userRole === "BRAND" && (
                <button
                  onClick={() => navigate("/create-campaign")}
                  style={{
                    width: "100%",
                    backgroundColor: "#059669",
                    color: "white",
                    padding: "14px 20px",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "15px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#047857")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#059669")}
                >
                  ✨ Create Campaign
                </button>
              )}

              <button
                onClick={() => navigate(userRole === "CREATOR" ? "/creator-profile" : "/brand-profile")}
                style={{
                  width: "100%",
                  backgroundColor: "#10b981",
                  color: "white",
                  padding: "14px 20px",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#059669")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#10b981")}
              >
                👤 {userRole === "CREATOR" ? hasCreatorProfile ? "Edit Profile" : "Create Profile" : hasBrandProfile ? "Edit Brand Profile" : "Create Brand Profile"}
              </button>


            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;