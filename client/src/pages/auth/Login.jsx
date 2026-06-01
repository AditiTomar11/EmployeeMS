import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password, role);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: "rgba(0,0,0,0.3)", border: "1px solid rgba(74,222,128,0.15)",
    borderRadius: 8, padding: "11px 14px", color: "#fff", fontSize: 14,
    fontFamily: "'DM Sans', sans-serif", outline: "none", width: "100%", boxSizing: "border-box",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 80% 20%, #0a162a 0%, #05080d 60%, #000 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden",
    }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15, pointerEvents: "none" }} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        {[...Array(8)].map((_, i) => (
          <path key={i} d={`M${1100 + i * 40},0 Q${900 + i * 20},450 ${1300 + i * 30},900`} stroke="#4a94de" strokeWidth="1" fill="none" />
        ))}
      </svg>

      <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 42, fontWeight: 800, color: "#fff", marginBottom: 8, letterSpacing: -1 }}>EmployeeMS</h1>
      <p style={{ color: "#6b7280", fontSize: 15, marginBottom: 40 }}>Manage employees smarter &amp; faster</p>

      <div style={{
        background: "rgba(10, 13, 42, 0.85)", border: "1px solid rgba(74, 126, 222, 0.2)",
        borderRadius: 16, padding: "36px 40px", width: "100%", maxWidth: 420, backdropFilter: "blur(12px)",
      }}>
        {!role ? (
          <>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: 28 }}>Login As</h2>
            <div style={{ display: "flex", gap: 16 }}>
              <button onClick={() => setRole("employee")} style={{
                flex: 1, padding: "14px", borderRadius: 10, border: "none",
                background: "#2563eb", color: "#fff", fontSize: 15, fontWeight: 600,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              }}>Employee</button>
              <button onClick={() => setRole("admin")} style={{
                flex: 1, padding: "14px", borderRadius: 10, border: "none",
                background: "#16a34a", color: "#fff", fontSize: 15, fontWeight: 600,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              }}>Admin</button>
            </div>
            <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#6b7280" }}>
              New admin?{" "}
              <Link to="/signup" style={{ color: "#4ade80", fontWeight: 600, textDecoration: "none" }}>Create an account</Link>
            </p>
          </>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <button onClick={() => { setRole(null); setError(""); }} style={{
                background: "transparent", border: "none", color: "#6b7280", cursor: "pointer", fontSize: 18, padding: 0,
              }}>←</button>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: "#fff", margin: 0 }}>
                {role === "admin" ? "Admin Login" : "Employee Login"}
              </h2>
              <span style={{
                marginLeft: "auto",
                background: role === "admin" ? "rgba(22,163,74,0.2)" : "rgba(37,99,235,0.2)",
                color: role === "admin" ? "#4ade80" : "#60a5fa",
                padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, textTransform: "uppercase",
              }}>{role}</span>
            </div>

            {error && (
              <div style={{
                background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)",
                color: "#f87171", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16,
              }}>{error}</div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.5px" }}>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required style={inputStyle} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.5px" }}>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required style={inputStyle} />
              </div>
              <button type="submit" disabled={loading} style={{
                marginTop: 8, padding: "13px", borderRadius: 10, border: "none",
                background: role === "admin" ? "#16a34a" : "#2563eb",
                color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", opacity: loading ? 0.7 : 1,
              }}>{loading ? "Signing in..." : "Sign In"}</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}