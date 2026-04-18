import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Campaigns() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applyingCampaignId, setApplyingCampaignId] = useState(null);
  const userRole = localStorage.getItem("userRole");

  // Fetch campaigns on page load
  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get("/campaign");
      setCampaigns(response.data);
    } catch (err) {
      setError("Failed to load campaigns");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (campaignId) => {
    try {
      setApplyingCampaignId(campaignId);
      const token = localStorage.getItem("token");
      const userRole = localStorage.getItem("userRole");
      const userEmail = localStorage.getItem("userEmail");
      
      if (!token) {
        alert("Please login first");
        setApplyingCampaignId(null);
        return;
      }

      console.log("Sending apply request with campaignId:", campaignId);
      console.log("Authorization header present:", !!token);
      console.log("Stored user role:", userRole);
      console.log("Stored user email:", userEmail);

      await API.post("/application/apply", {
        campaignId: campaignId,
      });
      
      alert("Applied successfully! We'll review your application soon.");
      setApplyingCampaignId(null);
    } catch (err) {
      console.error("Apply error details:", err);
      console.error("Response status:", err.response?.status);
      console.error("Response data:", err.response?.data);
      
      let errorMessage = "Failed to apply for campaign";
      
      // Check for "already applied" error first
      if (err.response?.status === 409 || 
          err.response?.data?.message?.toLowerCase().includes("already applied") ||
          err.response?.data?.message?.toLowerCase().includes("already exists")) {
        errorMessage = "You have already applied to this campaign";
      } else if (err.response?.status === 403) {
        const userRole = localStorage.getItem("userRole");
        if (userRole !== "CREATOR") {
          errorMessage = `You are logged in as ${userRole}, but only CREATOR role can apply for campaigns. Please logout and login as a CREATOR.`;
        } else {
          errorMessage = "Permission denied. Make sure your creator profile is set up.";
        }
      } else if (err.response?.status === 400) {
        errorMessage = err.response?.data?.message || "Invalid request. Make sure your creator profile is set up";
      } else if (err.response?.status === 404) {
        errorMessage = "Campaign not found";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      alert(`Error: ${errorMessage}`);
      setApplyingCampaignId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ 
            fontSize: "48px", 
            marginBottom: "16px",
            animation: "spin 1s linear infinite"
          }}>
            ⏳
          </div>
          <p style={{ fontSize: "18px", color: "#666", fontWeight: "500" }}>
            Loading campaigns...
          </p>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto", minHeight: "100vh" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "36px", fontWeight: "700", margin: "0 0 8px 0", color: "#1f2937" }}>
          Campaigns
        </h1>
        <p style={{ fontSize: "14px", color: "#6b7280", margin: "0" }}>
          {userRole === "BRAND" ? "Manage your campaigns and applicants" : "Discover and apply to campaigns"}
        </p>
      </div>

      {error && (
        <div
          style={{
            color: "#991b1b",
            marginBottom: "24px",
            padding: "16px",
            backgroundColor: "#fee2e2",
            border: "1px solid #fca5a5",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span style={{ fontSize: "20px" }}>⚠️</span>
          <span style={{ fontWeight: "500" }}>{error}</span>
        </div>
      )}

      {campaigns.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 24px",
            backgroundColor: "#f9fafb",
            borderRadius: "12px",
            border: "2px dashed #e5e7eb",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎯</div>
          <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
            {userRole === "BRAND" ? "No campaigns yet" : "No campaigns available"}
          </h2>
          <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}>
            {userRole === "BRAND" ? "Create your first campaign to get started" : "Check back soon for new opportunities"}
          </p>
          {userRole === "BRAND" && (
            <button
              onClick={() => navigate("/create-campaign")}
              style={{
                backgroundColor: "#059669",
                color: "white",
                padding: "12px 24px",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#047857"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#059669"}
            >
              Create Campaign
            </button>
          )}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "24px",
          }}
        >
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#ffffff",
                transition: "all 0.2s",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 10px 15px rgba(0,0,0,0.1)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  marginBottom: "12px",
                  color: "#1f2937",
                }}
              >
                {campaign.title}
              </h2>

              <p
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  marginBottom: "16px",
                  flex: 1,
                  lineHeight: "1.5",
                }}
              >
                {campaign.description}
              </p>

              <div style={{ marginBottom: "16px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {campaign.niche && (
                  <span
                    style={{
                      display: "inline-block",
                      backgroundColor: "#e0e7ff",
                      color: "#4f46e5",
                      padding: "6px 14px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {campaign.niche}
                  </span>
                )}
                {campaign.budget && (
                  <span
                    style={{
                      display: "inline-block",
                      backgroundColor: "#dcfce7",
                      color: "#166534",
                      padding: "6px 14px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    ${campaign.budget.toLocaleString()}
                  </span>
                )}
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "auto" }}>
                {userRole === "CREATOR" && (
                  <button
                    onClick={() => handleApply(campaign.id)}
                    disabled={applyingCampaignId === campaign.id}
                    style={{
                      flex: 1,
                      backgroundColor:
                        applyingCampaignId === campaign.id ? "#d1d5db" : "#3b82f6",
                      color: "white",
                      padding: "12px 16px",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor:
                        applyingCampaignId === campaign.id ? "not-allowed" : "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (applyingCampaignId !== campaign.id) {
                        e.target.style.backgroundColor = "#2563eb";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (applyingCampaignId !== campaign.id) {
                        e.target.style.backgroundColor = "#3b82f6";
                      }
                    }}
                  >
                    {applyingCampaignId === campaign.id ? "Applying..." : "Apply Now"}
                  </button>
                )}

                {userRole === "BRAND" && (
                  <button
                    onClick={() => navigate(`/campaign/${campaign.id}/applications`)}
                    style={{
                      flex: 1,
                      backgroundColor: "#8b5cf6",
                      color: "white",
                      padding: "12px 16px",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#7c3aed";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#8b5cf6";
                    }}
                  >
                    View Applicants
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Campaigns;
