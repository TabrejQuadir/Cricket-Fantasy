import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle, FaClock, FaEye, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const WithDrawBalance = () => {
  const navigate = useNavigate();
  const [withdrawRequests, setWithdrawRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  // ✅ Fetch all withdrawal requests for admin
  useEffect(() => {
    const fetchWithdrawRequests = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("https://backend.prepaidtaskskill.in/api/withdrawals/admin/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWithdrawRequests(response.data.withdrawalRequests);
      } catch (error) {
        setErrorMessage("Failed to fetch withdrawal requests.");
      } finally {
        setLoading(false);
      }
    };
    fetchWithdrawRequests();
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
        `https://backend.prepaidtaskskill.in/api/withdrawals/admin/${requestId}/update-status`,
        { requestId, status, reason: status === "Rejected" ? rejectReason : undefined },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setWithdrawRequests((prev) => prev.filter((request) => request._id !== requestId));
      alert("Withdrawal request updated successfully!");
      setSelectedRequest(null);
      setRejectReason(""); // Reset rejection reason
    } catch (error) {
      // ✅ Extract message from the backend response
      const errorMessage = error.response?.data?.message || "Failed to update withdrawal request.";
      alert(errorMessage);
    }
  };


  if (loading) return <div className="text-center text-yellow-500 mt-10">Loading withdrawals...</div>;
  if (errorMessage) return <div className="text-center text-red-500 mt-10">{errorMessage}</div>;

  return (
    <>
      <div className="max-w-5xl mx-auto mt-12 p-6 bg-black/50 backdrop-blur-3xl border border-yellow-500/50 rounded-3xl shadow-2xl text-white transition-all">
        {/* 🔙 Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className="text-2xl text-white hover:text-yellow-500 transition-all" />
          </motion.div>
          <h2 className="text-3xl font-extrabold text-yellow-400 tracking-wide">
            📜 Withdrawal Requests
          </h2>
        </div>

        {/* ✅ Table Container (Only Key Details) */}

        <div className="overflow-x-auto bg-gray-900/60 backdrop-blur-lg rounded-lg border border-yellow-500/40 shadow-xl">
          <table className="w-full text-left border-collapse">
            {/* 🔹 Table Head */}
            <thead>
              <tr className="border-b border-yellow-500 text-yellow-300 text-sm md:text-base bg-gray-800/80">
                <th className="p-4 uppercase tracking-wide">User</th>
                <th className="p-4 uppercase tracking-wide">Amount</th>
                <th className="p-4 uppercase tracking-wide">Status</th>
                <th className="p-4 uppercase tracking-wide text-center">Actions</th>
              </tr>
            </thead>

            {/* 🔹 Table Body */}
            <tbody>
              {withdrawRequests.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-gray-400 py-6 text-lg">
                    🚫 No withdrawal requests found.
                  </td>
                </tr>
              ) : (
                withdrawRequests.map((request) => (
                  <motion.tr
                    key={request._id}
                    className="border-b border-yellow-500/30 text-sm md:text-base bg-gray-800/60 hover:bg-gray-700/70 transition-all"
                  >
                    {/* 🔹 User Email */}
                    <td className="p-4 text-white font-medium">{request?.userId?.email || "N/A"}</td>

                    {/* 🔹 Amount */}
                    <td className="p-4 text-yellow-400 font-bold text-lg">
                      ₹{request?.amount}
                    </td>

                    {/* 🔹 Status */}
                    <td className="p-4">
                      {request?.status === "Pending" ? (
                        <span className="text-yellow-400 flex items-center gap-2 font-medium">
                          <FaClock /> Pending
                        </span>
                      ) : request.status === "Approved" ? (
                        <span className="text-green-400 flex items-center gap-2 font-medium">
                          <FaCheckCircle /> Approved
                        </span>
                      ) : (
                        <span className="text-red-400 flex items-center gap-2 font-medium">
                          <FaTimesCircle /> Rejected
                        </span>
                      )}
                    </td>

                    {/* 🔹 Action Button */}
                    <td className="p-4 text-center">
                      <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0px 0px 10px rgba(0, 123, 255, 0.6)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedRequest(request)}
                        className="px-3 py-2 flex items-center gap-2 text-sm md:text-base font-semibold rounded-xl 
               bg-[#ffa500]/80 text-white shadow-xl hover:bg-[#ffa500]/90 
               transition-all duration-300 transform hover:shadow-[#ffa500]/50 cursor-pointer"
                      >
                        <FaEye className="text-lg" /> View Details
                      </motion.button>
                    </td>

                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>



      </div>

      {/* ✅ Smooth Animated Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="relative p-6 bg-gray-900/80 backdrop-blur-lg border border-yellow-500/50 rounded-2xl shadow-2xl text-white w-full max-w-lg"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* ✨ Title */}
              <h3 className="text-3xl font-bold mb-4 text-yellow-400 drop-shadow-lg">
                Withdrawal Details
              </h3>

              {/* 🔹 User Info */}
              <div className="space-y-2">
                <p><span className="text-yellow-300">👤 User:</span> {selectedRequest?.userId?.email || "N/A"}</p>
                <p><span className="text-yellow-300">💰 Balance:</span> ₹{selectedRequest?.userId?.balance}</p>
                <p><span className="text-yellow-300">💵 Amount:</span> ₹{selectedRequest?.amount}</p>
                <p><span className="text-yellow-300">🌍 Currency:</span> {selectedRequest?.currency}</p>
                <p><span className="text-yellow-300">🏦 Bank:</span> {selectedRequest?.bankDetails?.bankName || "N/A"}</p>
                <p><span className="text-yellow-300">🔢 Account No.:</span> {selectedRequest?.bankDetails?.accountNumber || "N/A"}</p>
                <p><span className="text-yellow-300">🏛️IFSC/Branch Code:</span> {selectedRequest?.bankDetails?.branchCode || "N/A"}</p>
                <p><span className="text-yellow-300">🏛️ Status:</span> {selectedRequest?.status}</p>

                {/* 📅 Show RequestedAt for All Requests */}
                <p className="text-gray-300">
                  📅 <span className="text-yellow-400">Requested At:</span> {new Date(selectedRequest?.requestedAt).toLocaleString()}
                </p>

                {/* ✅ Show ReviewedAt for Approved & Rejected Requests */}
                {selectedRequest?.status !== "Pending" && (
                  <p className="text-gray-300">
                    ⏳ <span className="text-yellow-400">Reviewed At:</span> {selectedRequest?.reviewedAt ? new Date(selectedRequest?.reviewedAt).toLocaleString() : "N/A"}
                  </p>
                )}
              </div>

              {/* ❌ Show Rejection Reason If Status is Rejected */}
              {selectedRequest?.status === "Rejected" && (
                <p className="mt-4 text-red-400 font-semibold">
                  🚫 <span className="text-white">Rejection Reason:</span> {selectedRequest?.reason || "Not provided"}
                </p>
              )}

              {/* 🔹 Reject Reason Input (Only if Pending) */}
              {selectedRequest.status === "Pending" && (
                <>
                  <p className="text-gray-300 mt-4">✍️ Enter rejection reason:</p>
                  <input
                    type="text"
                    className="w-full p-2 bg-gray-800/70 border border-yellow-500/50 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 focus:outline-none mb-4 transition-all"
                    placeholder="Enter reason..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                </>
              )}

              {/* 🔘 Show Buttons Only for Pending Requests */}
              {selectedRequest.status === "Pending" && (
                <div className="flex justify-between mt-6">
                  <motion.button
                    onClick={() => handleAction(selectedRequest._id, "Approved")}
                    className="px-5 py-2.5 font-semibold bg-green-600/80 text-white rounded-xl hover:bg-green-700 shadow-md transition-all transform hover:scale-102 cursor-pointer hover:shadow-green-500/40"
                  >
                    ✅ Approve
                  </motion.button>

                  <motion.button
                    onClick={() => handleAction(selectedRequest._id, "Rejected")}
                    className="px-5 py-2.5 font-semibold bg-red-600/80 text-white rounded-xl hover:bg-red-700 shadow-md transition-all transform hover:scale-102 cursor-pointer hover:shadow-red-500/40"
                  >
                    ❌ Reject
                  </motion.button>
                </div>
              )}

              {/* 🛑 Close Button - Always Visible */}
              <div className="absolute top-6 right-6">
                <motion.button
                  onClick={() => setSelectedRequest(null)}
                  className="px-5 py-2 font-semibold bg-gray-700/80 text-white rounded-xl hover:bg-gray-800 shadow-md transition-all transform hover:scale-102 cursor-pointer"
                >
                  ❎ Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>



  );
};

export default WithDrawBalance;
