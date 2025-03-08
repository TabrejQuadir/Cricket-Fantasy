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
        const currentTime = Date.now() / 1000; // Convert to seconds

        if (decodedToken.exp < currentTime) {
            console.warn("⏳ Token expired! Removing token and redirecting to /auth");
            localStorage.removeItem("authToken"); // ✅ Remove expired token
            return <Navigate to="/auth" replace />;
        }

        if (decodedToken.role !== "admin") {
            console.warn("⚠️ User is NOT an admin! Removing token and redirecting to /auth");
            localStorage.removeItem("authToken"); // ✅ Remove unauthorized token
            return <Navigate to="/auth" replace />;
        }
    } catch (error) {
        console.error("❌ Invalid token! Removing token and redirecting to /auth", error);
        localStorage.removeItem("authToken"); // ✅ Remove corrupted/invalid token
        return <Navigate to="/auth" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
