import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaIdBadge, FaPhone, FaCalendarAlt, FaClock, FaEye, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

// Sample Data (Replace with API data)
const samplePurchases = [
    { id: "USR12345", name: "John Doe", phone: "+91 9876543210", plan: "Premium", teams: 5, team1: "Team A", team2: "Team B", date: "2024-02-15", time: "8:00 PM", paymentImage: "https://via.placeholder.com/400" },
    { id: "USR67890", name: "Alice Smith", phone: "+91 9823123456", plan: "Basic", teams: 10, team1: "Team C", team2: "Team D", date: "2024-02-17", time: "6:30 PM", paymentImage: "https://via.placeholder.com/400" }
];

const TeamPurchaseVerify = () => {
    const [purchases, setPurchases] = useState(samplePurchases);
    const [selectedImage, setSelectedImage] = useState(null);

    // Handle Verification (Approve or Reject)
    const handleVerification = (userId) => {
        setPurchases(purchases.filter(purchase => purchase.id !== userId));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-5xl mx-auto"
            >
                {/* Page Title */}
                <h1 className="text-3xl font-extrabold text-yellow-400 mb-6 text-center flex items-center justify-center">
                    <FaUsers className="mr-3 text-4xl" />
                    Team Purchase Verification
                </h1>

                {/* Purchase Requests List */}
                <div className="space-y-6">
                    {purchases.map((purchase) => (
                        <motion.div
                            key={purchase.id}
                            className="p-5 bg-black/50 backdrop-blur-2xl rounded-2xl border border-yellow-500/40 shadow-md text-white"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* User & Match Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* User Details */}
                                <div className="space-y-2">
                                    <p className="text-lg font-semibold">
                                        <FaUsers className="inline text-yellow-300 mr-2" /> {purchase.name}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        <FaIdBadge className="inline text-yellow-300 mr-1" /> {purchase.id}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        <FaPhone className="inline text-yellow-300 mr-1" /> {purchase.phone}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        <FaUsers className="inline text-yellow-300 mr-1" /> Teams: {purchase.teams}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        <FaUsers className="inline text-yellow-300 mr-1" /> Plan: {purchase.plan}
                                    </p>
                                </div>

                                {/* Match Details */}
                                <div className="space-y-2">
                                    <p className="text-lg font-semibold">
                                        <FaUsers className="inline text-yellow-300 mr-2" /> {purchase.team1} vs {purchase.team2}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        <FaCalendarAlt className="inline text-yellow-300 mr-2" /> {purchase.date}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        <FaClock className="inline text-yellow-300 mr-2" /> {purchase.time}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col md:flex-row justify-between mt-4 space-y-3 md:space-y-0 md:space-x-3">
                                {/* View Payment Proof Button */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedImage(purchase.paymentImage)}
                                    className="w-full md:w-auto px-4 py-2 flex items-center justify-center rounded-lg bg-yellow-500 text-black font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer"
                                >
                                    <FaEye className="mr-2 text-lg" /> See Payment
                                </motion.button>

                                {/* Approve Button */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleVerification(purchase.id)}
                                    className="w-full md:w-auto px-4 py-2 flex items-center justify-center rounded-lg bg-green-500 text-black font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer"
                                >
                                    <FaCheckCircle className="mr-2 text-lg" /> Approve
                                </motion.button>

                                {/* Reject Button */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleVerification(purchase.id)}
                                    className="w-full md:w-auto px-4 py-2 flex items-center justify-center rounded-lg bg-red-500 text-white font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer"
                                >
                                    <FaTimesCircle className="mr-2 text-lg" /> Reject
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Payment Proof Modal */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="p-6 bg-gray-900 rounded-lg shadow-lg border border-yellow-500 w-full max-w-sm"
                    >
                        <h2 className="text-xl font-bold text-yellow-400 mb-4 text-center">Payment Proof</h2>
                        
                        {/* Payment Image */}
                        <img src={selectedImage} alt="Payment Proof" className="rounded-lg shadow-lg w-full" />
                        
                        {/* Close Button */}
                        <div className="text-center mt-4">
                            <motion.button
                                onClick={() => setSelectedImage(null)}
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

export default TeamPurchaseVerify;
