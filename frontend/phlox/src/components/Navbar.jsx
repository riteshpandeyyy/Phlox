import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = localStorage.getItem("userRole");
  const userEmail = localStorage.getItem("userEmail");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getProfilePath = () => {
    return userRole === "CREATOR" ? "/creator-profile" : "/brand-profile";
  };

  const getProfileLabel = () => {
    return userRole === "CREATOR" ? "Creator Profile" : "Brand Profile";
  };

  const navLinkStyle = (path) => ({
    color: isActive(path) ? "#3b82f6" : "#6b7280",
    textDecoration: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s",
    cursor: "pointer",
    backgroundColor: isActive(path) ? "#eff6ff" : "transparent",
    display: "inline-block",
  });

  return (
    <nav
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        padding: "0 24px",
        position: "sticky",
        top: "0",
        zIndex: "1000",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "64px",
        }}
      >
        {/* Logo/Brand */}
        <div
          onClick={() => navigate("/dashboard")}
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#3b82f6",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          🎯 Phlox
        </div>

        {/* Desktop Navigation */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              ...navLinkStyle("/dashboard"),
              border: "none",
              backgroundColor: isActive("/dashboard") ? "#eff6ff" : "transparent",
            }}
            onMouseEnter={(e) => {
              if (!isActive("/dashboard")) {
                e.target.style.backgroundColor = "#f3f4f6";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive("/dashboard")) {
                e.target.style.backgroundColor = "transparent";
              }
            }}
          >
            Home
          </button>

          <button
            onClick={() => navigate("/campaigns")}
            style={{
              ...navLinkStyle("/campaigns"),
              border: "none",
              backgroundColor: isActive("/campaigns") || isActive("/campaign/") ? "#eff6ff" : "transparent",
            }}
            onMouseEnter={(e) => {
              if (!isActive("/campaigns")) {
                e.target.style.backgroundColor = "#f3f4f6";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive("/campaigns")) {
                e.target.style.backgroundColor = "transparent";
              }
            }}
          >
            Campaigns
          </button>

          {userRole === "CREATOR" && (
            <button
              onClick={() => navigate("/my-applications")}
              style={{
                ...navLinkStyle("/my-applications"),
                border: "none",
                backgroundColor: isActive("/my-applications") ? "#eff6ff" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive("/my-applications")) {
                  e.target.style.backgroundColor = "#f3f4f6";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive("/my-applications")) {
                  e.target.style.backgroundColor = "transparent";
                }
              }}
            >
              My Applications
            </button>
          )}

          <button
            onClick={() => navigate(getProfilePath())}
            style={{
              ...navLinkStyle(getProfilePath()),
              border: "none",
              backgroundColor: isActive(getProfilePath()) ? "#eff6ff" : "transparent",
            }}
            onMouseEnter={(e) => {
              if (!isActive(getProfilePath())) {
                e.target.style.backgroundColor = "#f3f4f6";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(getProfilePath())) {
                e.target.style.backgroundColor = "transparent";
              }
            }}
          >
            {getProfileLabel()}
          </button>

          {/* User Info & Logout */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginLeft: "16px",
              paddingLeft: "16px",
              borderLeft: "1px solid #e5e7eb",
            }}
          >
            <div style={{ fontSize: "13px" }}>
              <p style={{ margin: "0", color: "#6b7280" }}>
                {userEmail}
              </p>
              <p
                style={{
                  margin: "0",
                  fontWeight: "600",
                  color: "#3b82f6",
                  fontSize: "12px",
                }}
              >
                {userRole}
              </p>
            </div>

            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "#ef4444",
                color: "white",
                padding: "8px 14px",
                border: "none",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#dc2626")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#ef4444")}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
