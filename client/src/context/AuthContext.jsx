import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const lastUserData = useRef(null); // ✅ Store last fetched data without causing re-renders
    const API_BASE_URL = "https://backend.prepaidtaskskill.in/api/auth";
    

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            fetchUserProfile(token);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUserProfile = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) return;
    
        try {
            const response = await axios.get(`${API_BASE_URL}/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            const newUserData = response.data;
    
            // ✅ Compare new data with the last stored data
            if (JSON.stringify(lastUserData.current) !== JSON.stringify(newUserData)) {
                setUser(newUserData);
                lastUserData.current = newUserData; // Update stored data
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error("Error fetching user profile:", error.response?.data || error);
            if (error.response?.status === 401) logout();
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchUserProfile(); // Initial fetch
        const interval = setInterval(fetchUserProfile, 10000); // Check every 10 seconds
    
        return () => clearInterval(interval); // Cleanup on unmount
    }, []);
    

    const register = async (userData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/register`, userData);
            return { success: true, message: response.data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Registration failed" };
        }
    };

    const login = async (credentials) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/login`, credentials);
            const { token, user } = response.data;

            localStorage.setItem("authToken", token);
            setUser(user);
            setIsAuthenticated(true);
            await fetchUserProfile(token);

            return { success: true, message: "Login successful" };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Login failed" };
        }
    };
    
    const logout = async () => {
        try {
            await axios.post(`${API_BASE_URL}/logout`);
        } catch (error) {
            console.error("Logout error:", error.response?.data || error);
        }

        localStorage.removeItem("authToken");
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, setUser, loading, login, register, logout, fetchUserProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
