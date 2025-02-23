import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// ✅ Protected Route Component
const ProtectedRoute = () => {
    // 🔹 Check if admin is logged in (token exists)
    const authToken = localStorage.getItem("authToken");

    return authToken ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
