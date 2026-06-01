import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../utils/axios";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }
    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }
    setLoading(true);
    try {
      await axiosInstance.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: "admin",
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: "rgba(0,0,0,0.3)",
    border: "1px solid rgba(74,222,128,0.15)",
    borderRadius: 8,
    padding: "11px 14px",
    color: "#fff",
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };

  const labelStyle = {
    fontSize: 11,
    fontWeight: 600,
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 80% 20%, #0a102a 0%, #05070d 60%, #000 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15, pointerEvents: "none" }} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        {[...Array(8)].map((_, i) => (
          <path key={i} d={`M${1100 + i * 40},0 Q${900 + i * 20},450 ${1300 + i * 30},900`} stroke="#4a6fde" strokeWidth="1" fill="none" />
        ))}
      </svg>

      <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 42, fontWeight: 800, color: "#fff", marginBottom: 8, letterSpacing: -1 }}>
        EmployeeMS
      </h1>
      <p style={{ color: "#6b7280", fontSize: 15, marginBottom: 40 }}>Create your admin account</p>

      <div style={{
        background: "rgba(10, 21, 42, 0.85)",
        border: "1px solid rgba(74, 118, 222, 0.2)",
        borderRadius: 16,
        padding: "36px 40px",
        width: "100%",
        maxWidth: 420,
        backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, color: "#fff", margin: 0 }}>
            Admin Sign Up
          </h2>
          <span style={{
            marginLeft: "auto",
            background: "rgba(22,163,74,0.2)",
            color: "#4ade80",
            padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, textTransform: "uppercase",
          }}>
            Admin
          </span>
        </div>

        {error && (
          <div style={{
            background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)",
            color: "#f87171", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={labelStyle}>Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required style={inputStyle} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={labelStyle}>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="admin@company.com" required style={inputStyle} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={labelStyle}>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" required style={inputStyle} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={labelStyle}>Confirm Password</label>
            <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" required style={inputStyle} />
          </div>

          <button type="submit" disabled={loading} style={{
            marginTop: 8, padding: "13px", borderRadius: 10, border: "none",
            background: "#16a34a", color: "#fff", fontSize: 15, fontWeight: 600,
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif", opacity: loading ? 0.7 : 1,
          }}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#6b7280" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#4ade80", fontWeight: 600, textDecoration: "none" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}