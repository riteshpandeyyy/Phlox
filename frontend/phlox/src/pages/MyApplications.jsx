import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function MyApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get("/application/creator");
      setApplications(response.data);
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.status === 403
          ? "You don't have permission to view applications"
          : err.response?.status === 404
          ? "No applications found"
          : "Failed to load applications";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "#f97316"; // orange
      case "ACCEPTED":
        return "#22c55e"; // green
      case "REJECTED":
        return "#ef4444"; // red
      default:
        return "#6b7280"; // gray
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return "⏳";
      case "ACCEPTED":
        return "✓";
      case "REJECTED":
        return "✕";
      default:
        return "•";
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
            Loading your applications...
          </p>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto", minHeight: "100vh" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "700", margin: "0 0 8px 0", color: "#1f2937" }}>
          My Applications
        </h1>
        <p style={{ color: "#6b7280", fontSize: "14px", margin: "0" }}>
          Track your campaign applications and their status
        </p>
      </div>

      {error && (
        <div
          style={{
            color: "#991b1b",
            padding: "16px",
            backgroundColor: "#fee2e2",
            border: "1px solid #fca5a5",
            borderRadius: "8px",
            marginBottom: "24px",
            display: "flex",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "20px" }}>⚠️</span>
          <span style={{ fontWeight: "500" }}>{error}</span>
        </div>
      )}

      {applications.length === 0 ? (
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
          <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
            You haven't applied to any campaigns yet
          </h2>
          <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}>
            Start exploring campaigns and submit your applications
          </p>
          <button
            onClick={() => navigate("/campaigns")}
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              padding: "12px 24px",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#2563eb")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#3b82f6")}
          >
            Find Campaigns
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {applications.map((app) => (
            <div
              key={app.id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                backgroundColor: "#ffffff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 10px 15px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)";
              }}
            >
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "18px", fontWeight: "700", margin: "0 0 8px 0", color: "#1f2937" }}>
                  {app.campaign?.title || "Campaign"}
                </h3>
                {app.campaign?.description && (
                  <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 12px 0", lineHeight: "1.4" }}>
                    {app.campaign.description.substring(0, 120)}
                    {app.campaign.description.length > 120 ? "..." : ""}
                  </p>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", fontSize: "13px" }}>
                  {app.campaign?.niche && (
                    <p style={{ margin: "0", color: "#6b7280" }}>
                      <span style={{ fontWeight: "600" }}>Niche:</span> {app.campaign.niche}
                    </p>
                  )}
                  {app.campaign?.budget && (
                    <p style={{ margin: "0", color: "#6b7280" }}>
                      <span style={{ fontWeight: "600" }}>Budget:</span> ${app.campaign.budget.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              <div style={{ textAlign: "right", minWidth: "160px", marginLeft: "24px" }}>
                <span
                  style={{
                    display: "inline-block",
                    backgroundColor: getStatusColor(app.status),
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "600",
                    marginBottom: "12px",
                  }}
                >
                  {app.status === "PENDING" && "⏳"}
                  {app.status === "ACCEPTED" && "✓"}
                  {app.status === "REJECTED" && "✕"}
                  {" "}{app.status}
                </span>
                <p style={{ fontSize: "12px", color: "#9ca3af", margin: "8px 0 0 0" }}>
                  Applied: {new Date(app.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyApplications;
