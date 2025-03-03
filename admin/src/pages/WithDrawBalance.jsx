import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaClock, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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
      await axios.post(
        `https://backend.prepaidtaskskill.in/api/withdrawals/admin/${requestId}/update-status`,
        { requestId, status, reason: status === "Rejected" ? rejectReason : undefined },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setWithdrawRequests((prev) => prev.filter((request) => request._id !== requestId));
      alert("Withdrawal request updated successfully!");
    } catch (error) {
      alert("Failed to update withdrawal request.");
    }
  };

  if (loading) return <div className="text-center text-yellow-500 mt-10">Loading withdrawals...</div>;
  if (errorMessage) return <div className="text-center text-red-500 mt-10">{errorMessage}</div>;

  return (
    <div className="max-w-6xl mx-auto mt-24 p-6 bg-black/40 backdrop-blur-3xl border border-yellow-500/40 rounded-3xl shadow-lg text-white">
      {/* 🔙 Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <FaArrowLeft className="text-xl cursor-pointer hover:text-yellow-500 transition-all" onClick={() => navigate(-1)} />
        <h2 className="text-3xl font-extrabold text-yellow-400">📜 Withdrawal Requests</h2>
      </div>

      {/* ✅ Responsive Table Container */}
      <div className="overflow-x-auto bg-gray-900/50 rounded-lg border border-yellow-500/40 shadow-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-yellow-500 text-yellow-300 text-sm md:text-base">
              <th className="p-3">User</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Currency</th>
              <th className="p-3 hidden md:table-cell">Requested Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {withdrawRequests.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-gray-400 py-4">No withdrawal requests found.</td>
              </tr>
            ) : (
              withdrawRequests.map((request) => (
                <tr key={request._id} className="border-b border-yellow-500/30 text-sm md:text-base">
                  <td className="p-3">{request?.userId?.email || "N/A"}</td>
                  <td className="p-3 text-yellow-400 font-bold">₹{request?.amount}</td>
                  <td className="p-3">{request?.currency}</td>
                  <td className="p-3 hidden md:table-cell">{new Date(request?.requestedAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    {request?.status === "Pending" ? (
                      <span className="text-yellow-400 flex items-center gap-2"><FaClock /> Pending</span>
                    ) : request.status === "Approved" ? (
                      <span className="text-green-400 flex items-center gap-2"><FaCheckCircle /> Approved</span>
                    ) : (
                      <span className="text-red-400 flex items-center gap-2"><FaTimesCircle /> Rejected</span>
                    )}
                  </td>
                  <td className="p-3 flex flex-col md:flex-row gap-2">
                    {request.status === "Pending" && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAction(request._id, "Approved")}
                          className="px-4 py-2 text-xs md:text-sm font-semibold rounded-xl bg-green-600 text-white shadow-md hover:bg-green-700 transition-all"
                        >
                          ✅ Approve
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedRequest(request)}
                          className="px-4 py-2 text-xs md:text-sm font-semibold rounded-xl bg-red-600 text-white shadow-md hover:bg-red-700 transition-all"
                        >
                          ❌ Reject
                        </motion.button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Rejection Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md p-4">
          <div className="p-6 bg-gray-900 border border-yellow-500/40 rounded-xl shadow-lg text-center text-white w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Reject Withdrawal Request</h3>
            <p className="text-gray-400 mb-3">Enter the reason for rejection:</p>
            <input
              type="text"
              className="w-full p-2 bg-gray-800 border border-yellow-500/40 rounded-xl text-white focus:outline-none mb-4"
              placeholder="Enter reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex justify-between">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAction(selectedRequest._id, "Rejected")}
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-red-600 text-white shadow-md hover:bg-red-700 transition-all"
              >
                ❌ Reject
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-gray-600 text-white shadow-md hover:bg-gray-700 transition-all"
              >
                ❌ Cancel
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithDrawBalance;
