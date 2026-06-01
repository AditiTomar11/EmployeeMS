import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axios";

export default function DepartmentList() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchDepartments = async () => {
    try {
      const res = await axiosInstance.get("/departments");
      setDepartments(res.data.departments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDepartments(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (editId) {
        await axiosInstance.put(`/departments/${editId}`, form);
      } else {
        await axiosInstance.post("/departments", form);
      }
      setForm({ name: "", description: "" });
      setEditId(null);
      fetchDepartments();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (dept) => {
    setEditId(dept._id);
    setForm({ name: dept.name, description: dept.description || "" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this department?")) return;
    try {
      await axiosInstance.delete(`/departments/${id}`);
      setDepartments((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ name: "", description: "" });
    setError("");
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Departments</h1>
          <p className="page-subtitle">{departments.length} departments</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24 }}>
        {/* Add / Edit Form */}
        <div className="card" style={{ height: "fit-content" }}>
          <h3 style={{ fontFamily: "Syne", marginBottom: 16, fontSize: 15 }}>
            {editId ? "Edit Department" : "Add Department"}
          </h3>
          {error && <div className="error-msg" style={{ marginBottom: 12 }}>{error}</div>}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="form-group">
              <label>Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Engineering"
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description..."
                rows={3}
                style={{ resize: "vertical" }}
              />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {editId && (
                <button type="button" className="btn btn-ghost" onClick={handleCancel}>
                  Cancel
                </button>
              )}
              <button type="submit" className="btn btn-primary" disabled={submitting} style={{ flex: 1 }}>
                {submitting ? "Saving..." : editId ? "Save Changes" : "Add Department"}
              </button>
            </div>
          </form>
        </div>

        {/* Department List */}
        <div className="card">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : departments.length === 0 ? (
            <div className="empty-state"><p>No departments yet. Add one.</p></div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((dept) => (
                    <tr key={dept._id}>
                      <td style={{ fontWeight: 500 }}>{dept.name}</td>
                      <td style={{ color: "var(--text-muted)", fontSize: 13 }}>
                        {dept.description || "—"}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(dept)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(dept._id)}>Delete</button>
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
    </div>
  );
}