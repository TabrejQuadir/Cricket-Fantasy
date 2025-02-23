import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaArrowLeft, FaCheckCircle, FaClock, FaTimesCircle, FaImage } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const BalancePaymentVerify = () => {
    const [balanceRequests, setBalanceRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rejectReason, setRejectReason] = useState("");
    const [selectedRequest, setSelectedRequest] = useState(null);
    const navigate = useNavigate();

    // ✅ Fetch All Deposit Requests (Admin Only)
    useEffect(() => {
        const fetchBalanceRequests = async () => {
            try {
                const token = localStorage.getItem("authToken");

                const response = await axios.get("https://backend.prepaidtaskskill.in/api/balance/all-balance-requests", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setBalanceRequests(response.data.balanceRequests);
            } catch (error) {
                setError("Failed to load balance requests. Admin access required.");
            } finally {
                setLoading(false);
            }
        };

        fetchBalanceRequests();
    }, []);

    // ✅ Handle Approve or Reject Action
    const handleAction = async (requestId, status) => {
        if (status === "Rejected" && !rejectReason) {
            alert("Please enter a rejection reason.");
            return;
        }

        try {
            const token = localStorage.getItem("authToken");

            const response = await axios.post(
                "https://backend.prepaidtaskskill.in/api/balance/approve-balance",
                { requestId, status, reason: status === "Rejected" ? rejectReason : undefined },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // ✅ Update UI after approval/rejection
            setBalanceRequests((prev) => prev.filter((request) => request._id !== requestId));

            alert(response.data.message);
            setSelectedRequest(null);
            setRejectReason("");
        } catch (error) {
            alert("Failed to update balance request. Admin access required.");
        }
    };

    return (
        <div className="max-w-5xl mx-auto mt-24 p-6 bg-black/40 backdrop-blur-3xl border border-yellow-500/40 rounded-3xl shadow-lg text-white">
            {/* 🔙 Back Button */}
            <div className="flex items-center gap-4 mb-6">
                <FaArrowLeft
                    className="text-xl cursor-pointer hover:text-yellow-500 transition-all"
                    onClick={() => navigate(-1)}
                />
                <h2 className="text-3xl font-extrabold text-yellow-400">📜 Deposit Requests</h2>
            </div>

            {loading ? (
                <p className="text-center text-yellow-400">Loading deposit requests...</p>
            ) : error ? (
                <p className="text-center text-red-400">{error}</p>
            ) : balanceRequests.length === 0 ? (
                <p className="text-center text-gray-400">No pending deposit requests.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse rounded-lg overflow-hidden shadow-lg">
                        {/* Table Header */}
                        <thead className="bg-yellow-500 text-black uppercase text-sm">
                            <tr>
                                <th className="py-3 px-4">User</th>
                                <th className="py-3 px-4">Amount</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4">Balance</th>
                                <th className="py-3 px-4">Screenshot</th>
                                <th className="py-3 px-4">Action</th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody>
                            {balanceRequests.map((request, index) => (
                                <tr
                                    key={request._id}
                                    className={`border-b border-yellow-500/40 ${
                                        index % 2 === 0 ? "bg-gray-900/50" : "bg-gray-800/50"
                                    }`}
                                >
                                    <td className="py-4 px-4 text-yellow-300 font-bold">
                                        {request.userId.username} <br />
                                        <span className="text-gray-400 text-sm">{request.userId.email}</span>
                                    </td>
                                    <td className="py-4 px-4 text-yellow-400 font-bold">₹{request.amount}</td>
                                    <td className="py-4 px-4">
                                        {request.status === "Pending" ? (
                                            <span className="text-yellow-400 flex items-center gap-2">
                                                <FaClock /> Pending
                                            </span>
                                        ) : request.status === "Approved" ? (
                                            <span className="text-green-400 flex items-center gap-2">
                                                <FaCheckCircle /> Approved
                                            </span>
                                        ) : (
                                            <span className="text-red-400 flex items-center gap-2">
                                                <FaTimesCircle /> Rejected
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-4 px-4 text-gray-300">₹{request.userId.balance}</td>
                                    <td className="py-4 px-4">
                                        {request.paymentScreenshot ? (
                                            <a
                                                href={`${request.paymentScreenshot}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-yellow-400 flex items-center gap-2 hover:underline"
                                            >
                                                <FaImage /> View Screenshot
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">No Screenshot</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-4">
                                        {request.status === "Pending" && (
                                            <div className="flex gap-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleAction(request._id, "Approved")}
                                                    className="px-4 py-2 text-sm font-semibold rounded-xl bg-green-600 text-white shadow-md hover:bg-green-700 transition-all"
                                                >
                                                    ✅ Approve
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setSelectedRequest(request)}
                                                    className="px-4 py-2 text-sm font-semibold rounded-xl bg-red-600 text-white shadow-md hover:bg-red-700 transition-all"
                                                >
                                                    ❌ Reject
                                                </motion.button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ✅ Rejection Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md">
                    <div className="p-6 bg-gray-900 border border-yellow-500/40 rounded-xl shadow-lg text-center text-white max-w-md">
                        <h3 className="text-xl font-bold mb-4">Reject Deposit Request</h3>
                        <p className="text-gray-400 mb-3">Enter the reason for rejection:</p>
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-800 border border-yellow-500/40 rounded-xl text-white focus:outline-none mb-4"
                            placeholder="Enter reason"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAction(selectedRequest._id, "Rejected")}
                            className="px-4 py-2 text-sm font-semibold rounded-xl bg-red-600 text-white shadow-md hover:bg-red-700 transition-all"
                        >
                            ❌ Reject
                        </motion.button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BalancePaymentVerify;
