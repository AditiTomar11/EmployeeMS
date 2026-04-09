import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleLogout = (e) => {
    e.preventDefault();
    axios.get('http://localhost:5000/auth/logout')
      .then(result => {
        if (result.data && result.data.Status === true) {
          localStorage.removeItem("valid");
          navigate('/');
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">

        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">

            <Link to="/dashboard" className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 text-white text-decoration-none">
              <span className="fs-5 fw-bolder">Admin Dashboard</span>
            </Link>

            <ul className="nav nav-pills flex-column mb-auto w-100">

              <li className="w-100">
                <Link to="/dashboard" className="nav-link text-white">
                  Dashboard
                </Link>
              </li>

              <li className="w-100">
                <Link to="/dashboard/employee" className="nav-link text-white">
                  Manage Employees
                </Link>
              </li>

              <li className="w-100">
                <Link to="/dashboard/category" className="nav-link text-white">
                  Category
                </Link>
              </li>

              <li className="w-100">
                <Link to="/dashboard/profile" className="nav-link text-white">
                  Profile
                </Link>
              </li>

              <li className="w-100">
                <Link to="#" onClick={handleLogout} className="nav-link text-white">
                  Logout
                </Link>
              </li>

            </ul>
          </div>
        </div>

        <div className="col p-0 m-0">
          <div className="p-2 shadow text-center">
            <h4>Employee Management System</h4>
          </div>
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;