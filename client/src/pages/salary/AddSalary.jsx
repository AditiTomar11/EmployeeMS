import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../utils/axios";

export default function AddSalary() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    employee: "", basicSalary: "", allowances: "0",
    deductions: "0", month: new Date().getMonth() + 1,
    year: new Date().getFullYear(), status: "pending",
  });

  useEffect(() => {
    axiosInstance.get("/employees").then((res) => setEmployees(res.data.employees));
  }, []);

  const net = (Number(form.basicSalary) || 0) + (Number(form.allowances) || 0) - (Number(form.deductions) || 0);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axiosInstance.post("/salary", form);
      navigate("/salary");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add salary record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Add Salary Record</h1>
        </div>
        <Link to="/salary" className="btn btn-ghost">← Back</Link>
      </div>

      <div className="card">
        {error && <div className="error-msg" style={{ marginBottom: 16 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full">
              <label>Employee</label>
              <select name="employee" value={form.employee} onChange={handleChange} required>
                <option value="">Select employee</option>
                {employees.map((e) => (
                  <option key={e._id} value={e._id}>{e.name} ({e.employeeId})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Month</label>
              <select name="month" value={form.month} onChange={handleChange}>
                {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m, i) => (
                  <option key={i} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Year</label>
              <input name="year" type="number" value={form.year} onChange={handleChange} min="2000" max="2100" required />
            </div>
            <div className="form-group">
              <label>Basic Salary (₹)</label>
              <input name="basicSalary" type="number" value={form.basicSalary} onChange={handleChange} placeholder="50000" required />
            </div>
            <div className="form-group">
              <label>Allowances (₹)</label>
              <input name="allowances" type="number" value={form.allowances} onChange={handleChange} placeholder="0" />
            </div>
            <div className="form-group">
              <label>Deductions (₹)</label>
              <input name="deductions" type="number" value={form.deductions} onChange={handleChange} placeholder="0" />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            {form.basicSalary && (
              <div className="form-group full">
                <div style={{ background: "var(--accent-soft)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 16px" }}>
                  <span style={{ color: "var(--text-muted)", fontSize: 13 }}>Net Salary: </span>
                  <span style={{ fontFamily: "Syne", fontSize: 20, fontWeight: 700, color: "var(--accent)" }}>
                    ₹{net.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <div className="form-actions">
              <Link to="/salary" className="btn btn-ghost">Cancel</Link>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Adding..." : "Add Record"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}