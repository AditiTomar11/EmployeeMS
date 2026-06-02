import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../utils/axios";

export default function MarkAttendance() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    employee: "",
    date: new Date().toISOString().split("T")[0],
    status: "present",
    checkIn: "",
    checkOut: "",
    remarks: "",
  });

  useEffect(() => {
    axiosInstance.get("/employees").then((res) =>
      setEmployees(res.data.employees.filter((e) => e.status === "active"))
    );
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axiosInstance.post("/attendance", form);
      navigate("/attendance");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Mark Attendance</h1>
        </div>
        <Link to="/attendance" className="btn btn-ghost">← Back</Link>
      </div>

      <div className="card" style={{ maxWidth: 560 }}>
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
              <label>Date</label>
              <input name="date" type="date" value={form.date} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="half-day">Half Day</option>
                <option value="leave">Leave</option>
              </select>
            </div>
            <div className="form-group">
              <label>Check In</label>
              <input name="checkIn" type="time" value={form.checkIn} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Check Out</label>
              <input name="checkOut" type="time" value={form.checkOut} onChange={handleChange} />
            </div>
            <div className="form-group full">
              <label>Remarks</label>
              <textarea name="remarks" value={form.remarks} onChange={handleChange} rows={2} style={{ resize: "vertical" }} />
            </div>
            <div className="form-actions">
              <Link to="/attendance" className="btn btn-ghost">Cancel</Link>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Saving..." : "Mark Attendance"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}