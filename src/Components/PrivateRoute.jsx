import React from 'react'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("valid")

  return isAuthenticated ? children : <Navigate to="/adminlogin" />
}

export default PrivateRoute