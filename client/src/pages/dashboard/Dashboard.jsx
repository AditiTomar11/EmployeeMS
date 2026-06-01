import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axios";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState({ employees: 0, departments: 0, salary: 0, attendance: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [emp, dept, sal, att] = await Promise.all([
          axiosInstance.get("/employees"),
          axiosInstance.get("/departments"),
          axiosInstance.get("/salary"),
          axiosInstance.get("/attendance"),
        ]);
        setStats({
          employees: emp.data.employees?.length || 0,
          departments: dept.data.departments?.length || 0,
          salary: sal.data.salaries?.length || 0,
          attendance: att.data.records?.length || 0,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Total Employees", value: stats.employees, icon: "👥", color: "#4f8ef7", bg: "rgba(79,142,247,0.1)" },
    { label: "Departments", value: stats.departments, icon: "🏢", color: "#34d399", bg: "rgba(52,211,153,0.1)" },
    { label: "Salary Records", value: stats.salary, icon: "💰", color: "#fbbf24", bg: "rgba(251,191,36,0.1)" },
    { label: "Attendance Records", value: stats.attendance, icon: "📅", color: "#a78bfa", bg: "rgba(167,139,250,0.1)" },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your organization</p>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading stats...</div>
      ) : (
        <div className="stat-grid">
          {cards.map((card) => (
            <div className="stat-card" key={card.label}>
              <div className="stat-icon" style={{ background: card.bg, color: card.color }}>
                {card.icon}
              </div>
              <div>
                <div className="stat-value">{card.value}</div>
                <div className="stat-label">{card.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <h3 style={{ fontFamily: "Syne", marginBottom: 16, fontSize: 16 }}>Quick Actions</h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link to="/employees/add" className="btn btn-primary">+ Add Employee</Link>
          <Link to="/departments" className="btn btn-ghost">Manage Departments</Link>
          <Link to="/attendance/mark" className="btn btn-ghost">Mark Attendance</Link>
          <Link to="/salary/add" className="btn btn-ghost">Add Salary Record</Link>
        </div>
      </div>
    </div>
  );
}