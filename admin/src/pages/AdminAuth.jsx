import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield, FaLock, FaEnvelope, FaPhone } from "react-icons/fa";
import axios from "axios";

const AdminAuth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        whatsappNumber: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // 📌 Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
    
        // 🔹 Send only required fields based on login or register mode
        const requestData = isLogin
            ? { email: formData.email, password: formData.password }
            : formData;
    
        console.log("🔍 Sending data:", requestData); // ✅ Debugging
    
        try {
            const response = await axios.post(
                `https://backend.prepaidtaskskill.in/api/admin/${isLogin ? "login" : "register"}`,
                requestData,
                { headers: { "Content-Type": "application/json" } }
            );
    
            console.log("✅ API Response:", response.data); // ✅ Debugging
    
            if (response.data.success) {
                localStorage.setItem("authToken", response.data.token);
                navigate("/dashboard");
            } else {
                setError(response.data.message || "Something went wrong");
            }
        } catch (error) {
            console.error("❌ API Error:", error.response?.data);
            setError(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-6">
            <div className="w-full max-w-md bg-black/40 border border-yellow-500/40 p-8 rounded-2xl backdrop-blur-xl shadow-lg">
                <h2 className="text-center text-2xl font-bold text-yellow-400 mb-6">
                    {isLogin ? "Admin Login" : "Register Admin"}
                </h2>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="relative">
                            <FaUserShield className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400" />
                            <input
                                type="text"
                                placeholder="Username"
                                className="w-full p-3 pl-10 bg-gray-800/40 border border-yellow-500/40 text-white rounded-xl focus:ring-2 focus:ring-yellow-500"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                            />
                        </div>
                    )}

                    <div className="relative">
                        <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400" />
                        <input
                            type="email"
                            placeholder="Admin Email"
                            className="w-full p-3 pl-10 bg-gray-800/40 border border-yellow-500/40 text-white rounded-xl focus:ring-2 focus:ring-yellow-500"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    {!isLogin && (
                        <div className="relative">
                            <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400" />
                            <input
                                type="tel"
                                placeholder="WhatsApp Number (10 Digits)"
                                className="w-full p-3 pl-10 bg-gray-800/40 border border-yellow-500/40 text-white rounded-xl focus:ring-2 focus:ring-yellow-500"
                                value={formData.whatsappNumber}
                                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                                required
                                maxLength={10}
                            />
                        </div>
                    )}

                    <div className="relative">
                        <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400" />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full p-3 pl-10 bg-gray-800/40 border border-yellow-500/40 text-white rounded-xl focus:ring-2 focus:ring-yellow-500"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full p-3 rounded-xl font-semibold transition-all ${
                            loading
                                ? "bg-yellow-500/40 cursor-not-allowed"
                                : "bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800"
                        } text-black`}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : isLogin ? "Login as Admin" : "Register Admin"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-400 mt-4">
                    {isLogin ? "Don't have an admin account?" : "Already an admin?"}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="ml-2 text-yellow-400 hover:text-yellow-300"
                    >
                        {isLogin ? "Register" : "Login"}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AdminAuth;
