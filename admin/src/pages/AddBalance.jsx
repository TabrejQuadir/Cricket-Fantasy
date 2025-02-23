import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaSearch, FaMoneyBillWave, FaUser } from "react-icons/fa";

const AddBalance = () => {
  const [userId, setUserId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Auto-hide messages after 3 seconds
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  // ✅ Fetch users for real-time search
  useEffect(() => {
    const fetchUsers = async () => {
      if (searchQuery.length < 3) {
        setUsers([]);
        return;
      }
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `https://backend.prepaidtaskskill.in/api/admin/users/search?query=${searchQuery}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers(response.data.users);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, [searchQuery]);

  // ✅ Handle Add Balance Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError("Please select a user.");
      return;
    }
    if (!amount || amount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        "https://backend.prepaidtaskskill.in/api/balance/admin-add-balance",
        { userId, amount: parseFloat(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(response.data.message);
      setUserId("");
      setSearchQuery("");
      setUsers([]);
      setAmount("");
    } catch (err) {
      setError(err.response?.data?.message || "Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-20 p-6 bg-black/40 backdrop-blur-3xl border border-yellow-500/40 rounded-3xl shadow-lg text-white text-center">
      <h2 className="text-3xl font-extrabold text-yellow-400 mb-6">
        💰 Add Balance to User
      </h2>

      {/* ✅ User Search Input */}
      <div className="relative mb-6">
        <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
          <FaUser className="text-yellow-400" />
          Search User (Email )
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 bg-gray-900/40 border border-yellow-500/40 text-white rounded-xl focus:ring-2 focus:ring-yellow-500 placeholder-gray-400 mt-2"
          placeholder="Type at least 3 characters..."
        />
        {users.length > 0 && (
          <div className="absolute top-16 left-0 w-full bg-gray-900 border border-yellow-500 rounded-xl shadow-lg max-h-40 overflow-y-auto z-50">
            {users.map((user) => (
              <div
                key={user._id}
                className="p-3 cursor-pointer hover:bg-gray-700 flex items-center gap-2"
                onClick={() => {
                  setUserId(user._id);
                  setSearchQuery(user.username || user.email);
                  setUsers([]);
                }}
              >
                <FaUser className="text-yellow-300" />
                <span>{user.username || user.email}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ Amount Input */}
      <div className="mb-6">
        <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
          <FaMoneyBillWave className="text-yellow-400" />
          Enter Amount (₹)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 bg-gray-900/40 border border-yellow-500/40 text-white rounded-xl focus:ring-2 focus:ring-yellow-500 placeholder-gray-400 mt-2"
          placeholder="Enter amount"
        />
      </div>

      {/* ✅ Confirm Add Balance Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSubmit}
        className="px-6 py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-700 text-black shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer w-full"
        disabled={loading}
      >
        {loading ? "Processing..." : "Add Balance 🚀"}
      </motion.button>

      {/* ✅ Success & Error Messages (Auto-hide in 3s) */}
      {message && <p className="mt-4 text-green-400">{message}</p>}
      {error && <p className="mt-4 text-red-400">{error}</p>}
    </div>
  );
};

export default AddBalance;
