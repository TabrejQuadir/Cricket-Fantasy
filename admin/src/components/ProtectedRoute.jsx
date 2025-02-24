import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = () => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
        console.warn("⚠️ No token found! Redirecting to /auth");
        return <Navigate to="/auth" replace />;
    }

    try {
        const decodedToken = jwtDecode(authToken);
        if (decodedToken.role !== "admin") {
            console.warn("⚠️ User is NOT an admin! Redirecting to /auth");
            return <Navigate to="/auth" replace />;
        }
    } catch (error) {
        console.error("❌ Invalid token! Redirecting to /auth", error);
        return <Navigate to="/auth" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
