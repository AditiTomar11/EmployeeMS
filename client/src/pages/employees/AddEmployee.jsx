import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../utils/axios";

export default function AddEmployee() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    employeeId: "", name: "", email: "", password: "", phone: "",
    department: "", designation: "", gender: "",
    dateOfBirth: "", joiningDate: "", salary: "", status: "active",
  });

  useEffect(() => {
    axiosInstance.get("/departments").then((res) => setDepartments(res.data.departments));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axiosInstance.post("/employees", form);
      navigate("/employees");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Add Employee</h1>
          <p className="page-subtitle">Employee will use their email & password to log in</p>
        </div>
        <Link to="/employees" className="btn btn-ghost">← Back</Link>
      </div>

      <div className="card">
        {error && <div className="error-msg" style={{ marginBottom: 16 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Employee ID</label>
              <input name="employeeId" value={form.employeeId} onChange={handleChange} placeholder="EMP001" required />
            </div>
            <div className="form-group">
              <label>Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@company.com" required />
            </div>
            <div className="form-group">
              <label>Password (employee will use this to login)</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 9999999999" />
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
              <input name="designation" value={form.designation} onChange={handleChange} placeholder="Software Engineer" required />
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
              <input name="salary" type="number" value={form.salary} onChange={handleChange} placeholder="50000" />
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
                {loading ? "Adding..." : "Add Employee"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}