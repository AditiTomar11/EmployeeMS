import React, { useEffect, useState } from "react";
import axios from "axios";

const EmployeeDashboard = () => {
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get employee ID from localStorage/session after login
    const empId = localStorage.getItem("employeeId");

    if (!empId) {
      setError("No employee ID found. Please login again.");
      return;
    }

    axios
      .get(`http://localhost:5000/employee/dashboard/${empId}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.Status) {
          setEmployee(res.data.Result);
        } else {
          setError(res.data.Error);
        }
      })
      .catch((err) => setError("API Error: " + err.message));
  }, []);

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  if (!employee) {
    return <div className="text-center mt-10">Loading Dashboard...</div>;
  }

  return (
   <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl text-center font-bold mb-6 font-serif italic">
        EmployeeMS
      </h2>
      <div className="space-y-3">
        <p>
          <span className="font-semibold">Name:</span> {employee.name}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {employee.email}
        </p>
        <p>
          <span className="font-semibold">Address:</span> {employee.address}
        </p>
        <p>
          <span className="font-semibold">Salary:</span> ₹{employee.salary}
        </p>
        <p>
          <span className="font-semibold">Category:</span> {employee.category}
        </p>
      </div>
    </div>
  );
};

export default EmployeeDashboard;

