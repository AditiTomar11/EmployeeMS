import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosInstance from "../../utils/axios";

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const [empRes, deptRes] = await Promise.all([
        axiosInstance.get(`/employees/${id}`),
        axiosInstance.get("/departments"),
      ]);
      const emp = empRes.data.employee;
      setForm({
        employeeId: emp.employeeId,
        name: emp.name,
        email: emp.email,
        password: "", // blank = don't change
        phone: emp.phone || "",
        department: emp.department?._id || "",
        designation: emp.designation,
        gender: emp.gender || "",
        dateOfBirth: emp.dateOfBirth ? emp.dateOfBirth.split("T")[0] : "",
        joiningDate: emp.joiningDate ? emp.joiningDate.split("T")[0] : "",
        salary: emp.salary || "",
        status: emp.status,
      });
      setDepartments(deptRes.data.departments);
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axiosInstance.put(`/employees/${id}`, form);
      navigate("/employees");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!form) return <div className="loading">Loading employee...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Employee</h1>
          <p className="page-subtitle">{form.name}</p>
        </div>
        <Link to="/employees" className="btn btn-ghost">← Back</Link>
      </div>

      <div className="card">
        {error && <div className="error-msg" style={{ marginBottom: 16 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Employee ID</label>
              <input name="employeeId" value={form.employeeId} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>New Password (leave blank to keep current)</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Leave blank to keep current" />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Department</label>
              <select name="department" value={form.department} onChange={handleChange} required>
                <option value="">Select department</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Designation</label>
              <input name="designation" value={form.designation} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange}>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Joining Date</label>
              <input name="joiningDate" type="date" value={form.joiningDate} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Salary (₹)</label>
              <input name="salary" type="number" value={form.salary} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="form-actions">
              <Link to="/employees" className="btn btn-ghost">Cancel</Link>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}