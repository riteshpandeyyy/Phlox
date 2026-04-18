import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

function CampaignApplications() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, [campaignId]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch applications for this campaign
      const response = await API.get(`/application/campaign/${campaignId}`);
      setApplications(response.data);
      
      // Try to fetch campaign details (optional)
      try {
        const campaignRes = await API.get(`/campaign/${campaignId}`);
        setCampaign(campaignRes.data);
      } catch {
        // Campaign endpoint might not exist or user doesn't have access
      }
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.status === 403
          ? "You don't have access to this campaign's applications"
          : err.response?.status === 404
          ? "Campaign not found"
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

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await API.patch("/application/status", {
        applicationId: applicationId,
        status: newStatus,
      });
      
      // Refresh applications
      fetchApplications();
      alert(`Application ${newStatus.toLowerCase()}!`);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update application status";
      alert(`Error: ${errorMessage}`);
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
            Loading applications...
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
          Campaign Applicants
        </h1>
        {campaign && (
          <p style={{ color: "#6b7280", fontSize: "14px", margin: "0" }}>
            {campaign.title}
          </p>
        )}
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
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
          <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
            No applications yet
          </h2>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            Applicants will appear here once creators start applying
          </p>
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
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 10px 15px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "6px", color: "#1f2937" }}>
                    {app.creator?.user?.name || "Creator"}
                  </h3>
                  <p style={{ color: "#6b7280", fontSize: "13px", margin: "0" }}>
                    {app.creator?.user?.email}
                  </p>
                </div>

                <span
                  style={{
                    display: "inline-block",
                    backgroundColor: getStatusColor(app.status),
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                >
                  {app.status === "PENDING" && "⏳"}
                  {app.status === "ACCEPTED" && "✓"}
                  {app.status === "REJECTED" && "✕"}
                  {" "}{app.status}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                {app.creator?.niche && (
                  <div>
                    <p style={{ fontSize: "12px", color: "#6b7280", fontWeight: "600", margin: "0 0 4px 0" }}>
                      Niche
                    </p>
                    <p style={{ fontSize: "14px", color: "#1f2937", margin: "0", fontWeight: "500" }}>
                      {app.creator.niche}
                    </p>
                  </div>
                )}
                {app.creator?.followers && (
                  <div>
                    <p style={{ fontSize: "12px", color: "#6b7280", fontWeight: "600", margin: "0 0 4px 0" }}>
                      Followers
                    </p>
                    <p style={{ fontSize: "14px", color: "#1f2937", margin: "0", fontWeight: "500" }}>
                      {app.creator.followers.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {app.status === "PENDING" && (
                <div style={{ display: "flex", gap: "12px", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #e5e7eb" }}>
                  <button
                    onClick={() => handleStatusUpdate(app.id, "ACCEPTED")}
                    style={{
                      flex: 1,
                      backgroundColor: "#22c55e",
                      color: "white",
                      padding: "12px 16px",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#16a34a")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "#22c55e")}
                  >
                    ✓ Accept
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(app.id, "REJECTED")}
                    style={{
                      flex: 1,
                      backgroundColor: "#ef4444",
                      color: "white",
                      padding: "12px 16px",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#dc2626")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "#ef4444")}
                  >
                    ✕ Reject
                  </button>
                </div>
              )}

              <p style={{ fontSize: "12px", color: "#9ca3af", margin: "12px 0 0 0" }}>
                Applied: {new Date(app.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CampaignApplications;
