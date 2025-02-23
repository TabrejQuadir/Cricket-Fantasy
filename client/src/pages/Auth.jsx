import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import bgImage from "../assets/bg.jpg";
import { useAuth } from "../context/AuthContext";

export default function Auth() {
    const { isAuthenticated, login, register } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
        whatsappNumber: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        if (!formData.email || !formData.password || (!isLogin && (!formData.username || !formData.whatsappNumber))) {
            setError("Please fill in all fields.");
            setLoading(false);
            return;
        }

        if (!isLogin && !/^\d{10}$/.test(formData.whatsappNumber)) {
            setError("Please enter a valid 10-digit WhatsApp number.");
            setLoading(false);
            return;
        }

        try {
            if (isLogin) {
                const result = await login({ email: formData.email, password: formData.password });

                if (result.success) {
                    navigate("/");
                } else {
                    setError(result.message || "Invalid email or password.");
                }
            } else {
                const result = await register(formData);

                if (result.success) {
                    setSuccess(result.message);
                    setTimeout(() => {
                        setIsLogin(true);
                        setSuccess("");
                    }, 2000);
                } else {
                    setError(result.message || "Registration failed.");
                }
            }
        } catch (error) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen w-full flex items-center justify-center p-4 overflow-hidden"
            style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
            <div className="w-full max-w-md backdrop-blur-lg bg-black/30 border border-[#FDC700]/50 rounded-3xl p-8">
                <div className="flex justify-center mb-8">
                    <img
                        className="size-10 md:size-14 drop-shadow-lg"
                        src="https://png.pngtree.com/png-vector/20250125/ourmid/pngtree-a-3d-logo-design-of-professional-cricket-league-at-the-center-png-image_15336326.png"
                        alt="Logo"
                    />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    {success && <p className="text-green-500 text-sm text-center">{success}</p>}

                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 rounded-xl bg-gray-900/50 border border-[#FDC700]/50 text-white placeholder:text-gray-400 focus:outline-none focus:border-[#FDC700]"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />

                    {!isLogin && (
                        <>
                            <input
                                type="text"
                                placeholder="Username"
                                className="w-full p-3 rounded-xl bg-gray-900/50 border border-[#FDC700]/50 text-white placeholder:text-gray-400 focus:outline-none focus:border-[#FDC700]"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />

                            <input
                                type="tel"
                                placeholder="WhatsApp Number (10 Digits)"
                                className="w-full p-3 rounded-xl bg-gray-900/50 border border-[#FDC700]/50 text-white placeholder:text-gray-400 focus:outline-none focus:border-[#FDC700]"
                                value={formData.whatsappNumber}
                                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                                maxLength={10}
                            />
                        </>
                    )}

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 rounded-xl bg-gray-900/50 border border-[#FDC700]/50 text-white placeholder:text-gray-400 focus:outline-none focus:border-[#FDC700]"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className={`relative w-full p-3 rounded-xl ${
                            loading
                                ? "opacity-50 cursor-not-allowed"
                                : "bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
                        } text-white font-semibold cursor-pointer transition-all duration-300`}
                    >
                        {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                    <span>or continue with</span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                    <button
                        className="p-3 rounded-xl bg-gray-900/50 border border-gray-800 text-white flex items-center justify-center hover:bg-gray-800/50 transition-colors duration-300"
                        onClick={() => setShowModal(true)}
                    >
                        <FaGoogle className="mr-2" /> Google
                    </button>
                    <button
                        className="p-3 rounded-xl bg-gray-900/50 border border-gray-800 text-white flex items-center justify-center hover:bg-gray-800/50 transition-colors duration-300"
                        onClick={() => setShowModal(true)}
                    >
                        <FaFacebook className="mr-2" /> Facebook
                    </button>
                </div>

                <div className="mt-6 text-center text-sm text-gray-400">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError("");
                            setSuccess("");
                        }}
                        className="ml-2 text-pink-500 hover:text-pink-400 cursor-pointer transition-colors duration-300"
                    >
                        {isLogin ? "Sign Up" : "Sign In"}
                    </button>
                </div>
            </div>
        </div>
    );
}
