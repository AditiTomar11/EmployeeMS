import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axios";

export default function AttendanceList() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");

  const fetchRecords = async () => {
    try {
      const params = filterDate ? `?date=${filterDate}` : "";
      const res = await axiosInstance.get(`/attendance${params}`);
      setRecords(res.data.records);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecords(); }, [filterDate]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this record?")) return;
    try {
      await axiosInstance.delete(`/attendance/${id}`);
      setRecords((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  const statusBadge = (status) => {
    const map = { present: "badge-success", absent: "badge-danger", "half-day": "badge-warning", leave: "badge-info" };
    return <span className={`badge ${map[status] || "badge-info"}`}>{status}</span>;
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Attendance</h1>
          <p className="page-subtitle">{records.length} records</p>
        </div>
        <Link to="/attendance/mark" className="btn btn-primary">+ Mark Attendance</Link>
      </div>

      <div className="card">
        <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Filter by Date</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              style={{ width: "auto" }}
            />
          </div>
          {filterDate && (
            <button className="btn btn-ghost btn-sm" style={{ marginTop: 18 }} onClick={() => setFilterDate("")}>
              Clear
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : records.length === 0 ? (
          <div className="empty-state"><p>No attendance records found.</p></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Remarks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r._id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{r.employee?.name || "—"}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{r.employee?.employeeId}</div>
                    </td>
                    <td>{new Date(r.date).toLocaleDateString("en-IN")}</td>
                    <td>{statusBadge(r.status)}</td>
                    <td style={{ color: "var(--text-muted)", fontSize: 13 }}>{r.checkIn || "—"}</td>
                    <td style={{ color: "var(--text-muted)", fontSize: 13 }}>{r.checkOut || "—"}</td>
                    <td style={{ color: "var(--text-muted)", fontSize: 13 }}>{r.remarks || "—"}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}