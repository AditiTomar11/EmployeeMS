import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/layout/Layout";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/dashboard/Dashboard";
import EmployeeList from "./pages/employees/EmployeeList";
import AddEmployee from "./pages/employees/AddEmployee";
import EditEmployee from "./pages/employees/EditEmployee";
import DepartmentList from  "./pages/departments/DepartmentList";
import SalaryList from  "./pages/salary/SalaryList";
import AddSalary from  "./pages/salary/AddSalary";
import AttendanceList from  "./pages/attendance/AttendanceList";
import MarkAttendance from  "./pages/attendance/MarkAttendance";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="employees" element={<EmployeeList />} />
            <Route path="employees/add" element={<AddEmployee />} />
            <Route path="employees/edit/:id" element={<EditEmployee />} />
            <Route path="departments" element={<DepartmentList />} />
            <Route path="salary" element={<SalaryList />} />
            <Route path="salary/add" element={<AddSalary />} />
            <Route path="attendance" element={<AttendanceList />} />
            <Route path="attendance/mark" element={<MarkAttendance />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;