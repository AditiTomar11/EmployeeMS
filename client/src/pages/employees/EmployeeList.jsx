import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axios";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchEmployees = async () => {
    try {
      const res = await axiosInstance.get("/employees");
      setEmployees(res.data.employees);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this employee?")) return;
    try {
      await axiosInstance.delete(`/employees/${id}`);
      setEmployees((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      e.designation.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">{employees.length} total employees</p>
        </div>
        <Link to="/employees/add" className="btn btn-primary">+ Add Employee</Link>
      </div>

      <div className="card">
        <input
          type="text"
          placeholder="Search by name, ID, or designation..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: 16, maxWidth: 360 }}
        />

        {loading ? (
          <div className="loading">Loading employees...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <p>No employees found.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp) => (
                  <tr key={emp._id}>
                    <td style={{ color: "var(--text-muted)", fontSize: 12 }}>{emp.employeeId}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{emp.name}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{emp.email}</div>
                    </td>
                    <td>{emp.department?.name || "—"}</td>
                    <td>{emp.designation}</td>
                    <td>
                      <span className={`badge ${emp.status === "active" ? "badge-success" : "badge-danger"}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <Link to={`/employees/edit/${emp._id}`} className="btn btn-ghost btn-sm">Edit</Link>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(emp._id)}>Delete</button>
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