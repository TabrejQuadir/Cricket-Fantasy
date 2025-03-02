import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaUserCircle, FaEnvelope, FaPhone, FaCrown, FaStar, FaGem, FaSearch, FaSortAmountDown, FaSortAmountUp, FaExclamationTriangle, FaLock } from "react-icons/fa";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError("");

            try {
                const token = localStorage.getItem("authToken");
                if (!token) {
                    setError("Unauthorized: No admin token found.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get("https://backend.prepaidtaskskill.in/api/admin/users", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUsers(response.data);
                console.log(response.data);
            } catch (error) {
                setError(error.response?.data?.message || "Failed to fetch users. Try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.whatsappNumber.includes(search)
    );

    const sortedUsers = [...filteredUsers].sort((a, b) =>
        sortOrder === "newest" ? b._id.localeCompare(a._id) : a._id.localeCompare(b._id)
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 sm:p-6 text-white">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
                <div className="relative w-full sm:w-2/3 lg:w-1/2">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400" />
                    <input
                        type="text"
                        placeholder="Search users by name, email, or phone..."
                        className="w-full bg-gray-800/40 text-white p-3 pl-10 rounded-xl border border-yellow-500/40 focus:ring-2 focus:ring-yellow-500 outline-none transition"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <button
                    onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
                    className="flex items-center bg-yellow-500/40 hover:bg-yellow-500/60 text-white px-4 py-2 rounded-xl shadow-md transition-all"
                >
                    {sortOrder === "newest" ? <FaSortAmountDown className="mr-2" /> : <FaSortAmountUp className="mr-2" />}
                    {sortOrder === "newest" ? "Newest First" : "Oldest First"}
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="p-4 sm:p-6 bg-black/50 backdrop-blur-2xl rounded-3xl shadow-[0_0_40px_rgba(253,199,0,0.5)]"
            >
                {loading ? (
                    <p className="text-center text-yellow-400 text-lg">Loading users...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : sortedUsers.length > 0 ? (
                    <ul className="space-y-6">
                        {sortedUsers.map((user, index) => (
                            <motion.li
                                key={user._id}
                                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,215,0,0.1)" }}
                                className={`p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between border border-gray-700 transition-all duration-300 ${
                                    index % 2 === 0 ? "bg-gray-800/40" : "bg-gray-700/30"
                                }`}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center space-x-0 sm:space-x-4">
                                    <FaUserCircle className="text-4xl sm:text-5xl text-yellow-400 mx-auto sm:mx-0" />
                                    <div className="text-center sm:text-left ml-4">
                                        <h2 className="text-lg sm:text-xl font-semibold">#{user._id} - {user.username}</h2>
                                        <div className="flex items-center justify-center sm:justify-start text-yellow-300 text-sm mt-1">
                                            <FaEnvelope className="mr-2" />
                                            <span>{user.email}</span>
                                        </div>
                                        <div className="flex items-center justify-center sm:justify-start text-yellow-300 text-sm mt-1">
                                            <FaPhone className="mr-2" />
                                            <span>{user.whatsappNumber}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                    <PlanBadge plan={user.investmentPlan?.planName} status={user.investmentPlan?.status} />
                                    <VipBadge vipLevel={user.vipLevel} />
                                    {user.isRestricted && <RestrictedBadge />}
                                </div>
                            </motion.li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-400">No users found.</p>
                )}
            </motion.div>
        </div>
    );
};

const PlanBadge = ({ plan, status }) => {
    if (!plan) return <span className="text-gray-400 text-sm italic">No Active Plan</span>;

    const planColors = {
        Basic: "bg-gray-500",
        Premium: "bg-blue-500",
        Elite: "bg-yellow-500",
    };

    return (
        <span className={`flex items-center px-4 py-2 rounded-xl font-semibold shadow-md ${status === "pending" ? "bg-gray-700 text-white" : planColors[plan] || "bg-gray-700"}`}>
            {status === "pending" ? <FaExclamationTriangle className="mr-2" /> : <FaCrown className="mr-2" />} {status === "pending" ? "Pending Approval" : plan}
        </span>
    );
};

const VipBadge = ({ vipLevel }) => {
    if (!vipLevel) return null;
    
    const vipColors = {
        Bronze: "bg-orange-600",
        Silver: "bg-gray-500",
        Gold: "bg-yellow-500",
        Platinum: "bg-blue-500",
    };

    return <span className={`px-4 py-2 rounded-xl font-semibold ${vipColors[vipLevel] || "bg-gray-700"}`}>{vipLevel} VIP</span>;
};

const RestrictedBadge = () => (
    <span className="flex items-center px-4 py-2 rounded-xl bg-red-600 text-white">
        <FaLock className="mr-2" /> Restricted
    </span>
);

export default Users;
