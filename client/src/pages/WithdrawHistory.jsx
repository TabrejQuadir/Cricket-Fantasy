import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaArrowLeft, FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";

const WithdrawHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Fetch User's Withdrawal Requests
  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("https://backend.prepaidtaskskill.in/api/withdrawals/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setWithdrawals(response.data.requests);
      } catch (error) {
        setErrorMessage("Failed to fetch withdrawal history.");
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawals();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-24 p-6 bg-black/40 backdrop-blur-3xl border border-yellow-500/40 rounded-3xl shadow-lg text-white">
      {/* 🔙 Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <FaArrowLeft
          className="text-xl cursor-pointer hover:text-yellow-500 transition-all"
          onClick={() => navigate(-1)}
        />
        <h2 className="text-3xl font-extrabold text-yellow-400">📜 Withdrawal History</h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <FaSpinner className="animate-spin text-yellow-400 text-3xl" />
        </div>
      ) : errorMessage ? (
        <p className="text-center text-red-400">{errorMessage}</p>
      ) : withdrawals.length === 0 ? (
        <p className="text-center text-gray-400">No withdrawal requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse rounded-lg overflow-hidden shadow-lg">
            {/* Table Header */}
            <thead className="bg-yellow-500 text-black uppercase text-sm">
              <tr>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Currency</th>
                <th className="py-3 px-4">Requested At</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {withdrawals.map((withdrawal, index) => (
                <tr
                  key={withdrawal._id}
                  className={`border-b border-yellow-500/40 ${
                    index % 2 === 0 ? "bg-gray-900/50" : "bg-gray-800/50"
                  }`}
                >
                  <td className="py-4 px-4 text-yellow-400 font-bold">₹{withdrawal.amount}</td>
                  <td className="py-4 px-4 text-gray-300">{withdrawal.currency}</td>
                  <td className="py-4 px-4 text-gray-400">
                    {new Date(withdrawal.requestedAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4">
                    {withdrawal.status === "Pending" ? (
                      <span className="text-yellow-400 flex items-center gap-2">
                        <FaClock /> Pending
                      </span>
                    ) : withdrawal.status === "Approved" ? (
                      <span className="text-green-400 flex items-center gap-2">
                        <FaCheckCircle /> Approved
                      </span>
                    ) : (
                      <span className="text-red-400 flex items-center gap-2">
                        <FaTimesCircle /> Rejected
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WithdrawHistory;
