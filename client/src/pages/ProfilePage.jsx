import { useEffect } from "react";
import { FaIdCard, FaEnvelope, FaCrown, FaSignOutAlt, FaClock, FaMoneyBillWave } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/auth");
        }
    }, [user, navigate]);

    if (!user) {
        return <p className="text-center text-gray-300 text-lg">Redirecting...</p>;
    }

    const handleLogout = async () => {
        await logout();
        navigate("/auth");
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white px-4 py-8 md:px-6 lg:px-8" style={{ paddingTop: "90px" }}>
            {/* Profile Box - Responsive Width */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-5xl bg-black/40 backdrop-blur-3xl rounded-3xl border border-yellow-500/40 shadow-[0px_0px_30px_rgba(253,199,0,0.5)] overflow-hidden mb-6"
            >
                {/* Responsive Layout for Avatar and Info */}
                <div className="flex flex-col md:flex-row">
                    {/* Left Side - User Avatar */}
                    <div className="w-full md:w-1/3 flex items-center justify-center bg-slate-300 border-b md:border-b-0 md:border-r border-yellow-500/40 p-4 md:p-8">
                        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-[6px] border-yellow-400 shadow-xl">
                            <img
                                src={`https://i.pravatar.cc/200?u=${user.email}`}
                                alt="User Avatar"
                                className="w-full h-full object-cover rounded-full"
                                onError={(e) => (e.target.src = "/default-avatar.png")}
                            />
                        </div>
                    </div>

                    {/* Right Side - User Info */}
                    <div className="w-full md:w-2/3 p-4 md:p-8 flex flex-col justify-center space-y-2 md:space-y-4">
                        <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-700 text-transparent bg-clip-text">
                            {user.username || "Guest User"}
                        </h2>

                        {/* Restriction Message */}

                        {user.isRestricted && (
                            <p className="text-red-500 text-lg font-semibold">⚠️ You are restricted for 30 days ⚠️</p>
                        )}
                        <p className="text-gray-300 text-sm md:text-base flex items-center space-x-2">
                            <FaIdCard className="text-yellow-300" />
                            <span>Id: {user._id}</span>
                        </p>
                        <p className="text-gray-300 text-sm md:text-base flex items-center space-x-2">
                            <FaEnvelope className="text-yellow-300" />
                            <span>Email: {user.email}</span>
                        </p>
                        <p className="text-gray-300 text-sm md:text-base flex items-center space-x-2">
                            <FaCrown className="text-yellow-300" />
                            <span>VIP Level: {user.vipLevel || "N/A"}</span>
                        </p>
                        <p className="text-gray-300 text-sm md:text-base flex items-center space-x-2">
                            <FaMoneyBillWave className="text-yellow-300" />
                            <span>Balance: ₹{user.balance || "0.00"}</span>
                        </p>
                        {user?.investmentPlan?.status === "Active" ? (
                            <p className="text-gray-300 text-sm md:text-base flex items-center space-x-2">
                                <FaClock className="text-yellow-300" />
                                <span>Active Plan: <span className="text-yellow-400 font-bold">{user?.investmentPlan?.planName}</span></span>
                                <span className="ml-2">| Expires: <span className="text-yellow-400">{new Date(user?.investmentPlan?.expiryDate).toDateString()}</span></span>
                            </p>
                        ) : (
                            <p className="text-gray-400 text-sm md:text-base">No active plan. Choose an investment plan to get started.</p>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Actions - Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/deposit")}
                    disabled={user?.isRestricted}
                    className={`w-full py-3 text-sm md:text-lg font-semibold rounded-xl ${user?.isRestricted
                        ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-500 to-green-700 text-black shadow-lg hover:shadow-xl transition-all cursor-pointer"
                        }`}
                >
                    Deposit 💰
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/withdraw")}
                    disabled={user?.isRestricted}
                    className={`w-full py-3 text-sm md:text-lg font-semibold rounded-xl ${user?.isRestricted
                        ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer"
                        }`}
                >
                    Withdraw 💵
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/add-bank-account")}
                    disabled={user?.isRestricted}
                    className={`w-full py-3 text-sm md:text-lg font-semibold rounded-xl ${user?.isRestricted
                        ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-indigo-500 to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer"
                        }`}
                >
                    Add Bank Account 🏦
                </motion.button>

                {user && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/deposit-history")}
                        disabled={user?.isRestricted || false}
                        className={`w-full py-3 text-sm md:text-lg font-semibold rounded-xl ${user?.isRestricted
                            ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                            : "bg-gradient-to-r from-yellow-500 to-yellow-700 text-black shadow-lg hover:shadow-xl transition-all cursor-pointer"
                            }`}
                    >
                        Deposit History 📜
                    </motion.button>
                )}

                {user && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/withdraw-history")}
                        disabled={user?.isRestricted || false}
                        className={`w-full py-3 text-sm md:text-lg font-semibold rounded-xl ${user?.isRestricted
                            ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                            : "bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer"
                            }`}
                    >
                        Withdraw History 📑
                    </motion.button>
                )}

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className={`w-full py-3 text-sm md:text-lg font-semibold rounded-xl  bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer
                        `}
                >
                    Logout 🚪
                </motion.button>
            </div>
        </div>
    );
}