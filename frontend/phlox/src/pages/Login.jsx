import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { setToken } from "../utils/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      // Save token, role, and email to localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userRole", res.data.role);
      localStorage.setItem("userEmail", res.data.email);
      
      console.log("Login successful! Role:", res.data.role, "Email:", res.data.email);
      alert(`Login successful! You are logged in as: ${res.data.role}`);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Invalid credentials");
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "24px" }}>
      <div style={{ maxWidth: "400px", margin: "0 auto", marginTop: "100px" }}>
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "32px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h1 style={{ fontSize: "28px", fontWeight: "700", margin: "0 0 8px 0", color: "#1f2937" }}>
              Welcome Back
            </h1>
            <p style={{ fontSize: "14px", color: "#6b7280", margin: "0" }}>
              Sign in to your Phlox account
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "14px",
                  color: "#374151",
                  backgroundColor: "#ffffff",
                  boxSizing: "border-box",
                }}
                required
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "14px",
                  color: "#374151",
                  backgroundColor: "#ffffff",
                  boxSizing: "border-box",
                }}
                required
              />
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                backgroundColor: "#3b82f6",
                color: "white",
                padding: "12px 16px",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#2563eb")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#3b82f6")}
            >
              Sign In
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <p style={{ fontSize: "14px", color: "#6b7280", margin: "0" }}>
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{
                  color: "#3b82f6",
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;