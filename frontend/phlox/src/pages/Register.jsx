import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CREATOR",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/register", form);
      
      // Save token, role, and email to localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userRole", res.data.role);
      localStorage.setItem("userEmail", res.data.email);
      
      console.log("Registration successful! Role:", res.data.role, "Email:", res.data.email);
      alert(`Registration successful! You are logged in as: ${res.data.role}`);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "24px" }}>
      <div style={{ maxWidth: "400px", margin: "0 auto", marginTop: "50px" }}>
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
              Join Phlox
            </h1>
            <p style={{ fontSize: "14px", color: "#6b7280", margin: "0" }}>
              Create your account to get started
            </p>
          </div>

          <form onSubmit={handleRegister}>
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
                Full Name
              </label>
              <input
                name="name"
                placeholder="Enter your full name"
                onChange={handleChange}
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
                name="email"
                type="email"
                placeholder="Enter your email"
                onChange={handleChange}
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
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Create a password"
                onChange={handleChange}
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
                Account Type
              </label>
              <select
                name="role"
                onChange={handleChange}
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
              >
                <option value="CREATOR">Creator</option>
                <option value="BRAND">Brand</option>
              </select>
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
              Create Account
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <p style={{ fontSize: "14px", color: "#6b7280", margin: "0" }}>
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "#3b82f6",
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;