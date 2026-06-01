import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axios";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function SalaryList() {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get("/salary").then((res) => {
      setSalaries(res.data.salaries);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this salary record?")) return;
    try {
      await axiosInstance.delete(`/salary/${id}`);
      setSalaries((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const markPaid = async (id) => {
    try {
      const res = await axiosInstance.put(`/salary/${id}`, {
        status: "paid",
        payDate: new Date(),
      });
      setSalaries((prev) => prev.map((s) => s._id === id ? res.data.salary : s));
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Salary</h1>
          <p className="page-subtitle">{salaries.length} records</p>
        </div>
        <Link to="/salary/add" className="btn btn-primary">+ Add Record</Link>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : salaries.length === 0 ? (
          <div className="empty-state"><p>No salary records yet.</p></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Month/Year</th>
                  <th>Basic</th>
                  <th>Allowances</th>
                  <th>Deductions</th>
                  <th>Net Salary</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {salaries.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{s.employee?.name || "—"}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.employee?.employeeId}</div>
                    </td>
                    <td>{MONTHS[(s.month || 1) - 1]} {s.year}</td>
                    <td>₹{s.basicSalary?.toLocaleString()}</td>
                    <td style={{ color: "var(--success)" }}>+₹{s.allowances?.toLocaleString()}</td>
                    <td style={{ color: "var(--danger)" }}>-₹{s.deductions?.toLocaleString()}</td>
                    <td style={{ fontWeight: 600 }}>₹{s.netSalary?.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${s.status === "paid" ? "badge-success" : "badge-warning"}`}>
                        {s.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        {s.status === "pending" && (
                          <button className="btn btn-ghost btn-sm" onClick={() => markPaid(s._id)}>
                            Mark Paid
                          </button>
                        )}
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s._id)}>
                          Delete
                        </button>
                      </div>
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