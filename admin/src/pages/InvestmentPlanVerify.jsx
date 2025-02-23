import React, { useState, useEffect } from "react";
import { FaSearch, FaCheckCircle, FaTimesCircle, FaEye, FaSort, FaIdBadge, FaUser, FaPhone, FaFileImage } from "react-icons/fa";
import axios from "axios";
import { motion } from "framer-motion";

const InvestmentPlanVerify = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("newToOld");

    useEffect(() => {
        fetchPendingPlans();
    }, []);

    const fetchPendingPlans = async () => {
        try {
            const response = await axios.get("https://backend.prepaidtaskskill.in/api/admin/pending-plans", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Ensure to add the token if necessary
                },
            });
            // Filter users with investmentPlan status of 'Pending'
            const filteredUsers = response.data.filter(user => user.investmentPlan?.status === 'Pending');
            setUsers(filteredUsers);
        } catch (error) {
            console.error("Error fetching pending plans:", error);
        }
    };

    console.log(users);

    // Handle Verification (Approve or Reject)
    const handleVerification = async (userId, action) => {
        console.log(userId, action);
        try {
            const response = await axios.put(
                `https://backend.prepaidtaskskill.in/api/admin/${action}-plan/${userId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                }
            );
            console.log("Response:", response.data);
            alert(response.data.message);
            fetchPendingPlans(); // Refresh the list after approval/rejection
        } catch (error) {
            console.error("Error verifying plan:", error);
        }
    };

    // Handle Search
    const filteredUsers = users?.filter(
        (user) =>
        (user?.username?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
            user?.id?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
            user?.phone?.includes(searchQuery))
    );

    // Sort Users by Date (New to Old / Old to New)
    const sortedUsers = [...filteredUsers].sort((a, b) => {
        return sortOrder === "newToOld"
            ? new Date(b.createdAt) - new Date(a.createdAt)
            : new Date(a.createdAt) - new Date(b.createdAt);
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-4xl mx-auto"
            >
                {/* Page Title */}
                <h1 className="text-3xl font-extrabold text-yellow-400 mb-6 text-center flex items-center justify-center">
                    <FaIdBadge className="mr-3 text-4xl" />
                    Investment Plan Verification
                </h1>

                {/* Search & Sort */}
                <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Search Bar */}
                    <div className="relative w-full md:w-2/3">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by Name, ID, Phone..."
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-900/50 border border-yellow-500/50 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Sort Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSortOrder(sortOrder === "newToOld" ? "oldToNew" : "newToOld")}
                        className="flex items-center px-4 py-3 rounded-xl bg-yellow-500 text-black font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                        <FaSort className="mr-2 text-xl" /> {sortOrder === "newToOld" ? "Old to New" : "New to Old"}
                    </motion.button>
                </div>

                {/* User Verification List */}
                <div className="space-y-6">
                    {sortedUsers.map((user) => (
                        <motion.div
                            key={user.id}
                            className="p-5 bg-black/50 backdrop-blur-2xl rounded-2xl border border-yellow-500/40 shadow-md text-white"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* User Info */}
                            <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
                                <div className="mb-3 md:mb-0">
                                    <p className="text-lg font-semibold flex items-center">
                                        <FaUser className="text-yellow-300 mr-2" /> {user.username}
                                    </p>
                                    <p className="text-sm text-gray-400 flex items-center">
                                        <FaIdBadge className="text-yellow-300 mr-1" /> {user._id}
                                    </p>
                                    <p className="text-sm text-gray-400 flex items-center">
                                        <FaPhone className="text-yellow-300 mr-1" /> {user.whatsappNumber}
                                    </p>
                                    <p className="text-sm text-gray-400 flex items-center">
                                        <FaFileImage className="text-yellow-300 mr-1" /> Plan: {user.investmentPlan.planName}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 w-full md:w-auto">
                                    {/* View Payment Proof Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedUser(user)}
                                        className="px-4 py-2 flex items-center justify-center rounded-lg bg-yellow-500 text-black font-semibold shadow-md hover:shadow-lg transition-all w-full md:w-auto cursor-pointer"
                                    >
                                        <FaEye className="mr-2 text-lg" /> See Payment
                                    </motion.button>

                                    {/* Approve Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleVerification(user._id, "approve")}
                                        className="px-4 py-2 flex items-center justify-center rounded-lg bg-green-500 text-black font-semibold shadow-md hover:shadow-lg transition-all w-full md:w-auto cursor-pointer"
                                    >
                                        <FaCheckCircle className="mr-2 text-lg" /> Approve
                                    </motion.button>

                                    {/* Reject Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleVerification(user._id, "reject")}
                                        className="px-4 py-2 flex items-center justify-center rounded-lg bg-red-500 text-white font-semibold shadow-md hover:shadow-lg transition-all w-full md:w-auto cursor-pointer"
                                    >
                                        <FaTimesCircle className="mr-2 text-lg" /> Reject
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Payment Proof Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="p-6 bg-gray-900 rounded-lg shadow-lg border border-yellow-500"
                    >
                        <h2 className="text-xl font-bold text-yellow-400 mb-4 text-center">Payment Proof</h2>
                        <img
                            src={`${selectedUser.investmentPlan.paymentScreenshot}`}
                            alt={`Payment proof for ${selectedUser.name}`}
                            className="rounded-lg shadow-lg w-full max-w-xs mx-auto"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "path/to/fallback-image.jpg";
                            }}
                        />
                        <div className="text-center mt-4">
                            <motion.button
                                onClick={() => setSelectedUser(null)}
                                className="px-6 py-2 rounded-lg bg-red-500 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                            >
                                Close
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default InvestmentPlanVerify;
