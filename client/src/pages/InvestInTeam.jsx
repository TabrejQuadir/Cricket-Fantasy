import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const InvestInTeam = () => {
  const { matchId } = useParams();
  const { user, setUser } = useAuth();
  const [match, setMatch] = useState(null);
  const [amount, setAmount] = useState(""); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [daysLeft, setDaysLeft] = useState(null);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        if (!matchId) {
          setError("Invalid match ID.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`https://backend.prepaidtaskskill.in/api/matches/${matchId}`);
        setMatch(response.data);
      } catch (error) {
        setError("Failed to load match details.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [matchId]);

  useEffect(() => {
    if (user?.investmentPlan?.expiryDate) {
      const expiry = new Date(user.investmentPlan.expiryDate);
      const today = new Date();
      const diffTime = expiry - today;
      setDaysLeft(Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }
  }, [user]);

  // ✅ Handle Investment
  const handleConfirmSelection = async () => {
    setError(null);
    setSuccess(null);

    if (!user) {
      setError("User not found. Please log in first.");
      return;
    }

    const pricePerTeam = match?.pricePerTeam;
    if (!amount || isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (amount < pricePerTeam) {
      setError(`Minimum investment is ₹${pricePerTeam}.`);
      return;
    }

    if (amount % pricePerTeam !== 0) {
      setError(`Investment must be a multiple of ₹${pricePerTeam}.`);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://backend.prepaidtaskskill.in/api/matches/invest-match",
        {
          userId: user._id,
          matchId,
          amount: parseFloat(amount),
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        }
      );

      if (response.data.success) {
        setSuccess(`Investment of ₹${amount} was successful!`);
        setUser({ ...user, balance: response.data.remainingBalance });
      } else {
        setError(response.data.message || "Failed to make the investment.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Auto-hide messages after 3 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="w-12 h-12 border-4 border-yellow-500 border-dotted rounded-full animate-spin"></div>
      </div>
    );

  if (error) return (
    <div className="h-screen flex justify-center items-center">
      <p className="text-center text-red-500 font-semibold text-xl">{error}</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto mt-24 p-8 bg-black/40 backdrop-blur-3xl border border-yellow-500/40 rounded-3xl shadow-[0px_0px_50px_rgba(253,199,0,0.5)] text-white relative">
      {/* User Balance & Expiry Date */}
      <div className="absolute top-0 left-0 right-0 flex justify-between p-4 text-gray-300 text-sm font-semibold">
        <span>💰 Balance: ₹{user.balance.toFixed(2)}</span>
        <span>📅 Plan Expires in: {daysLeft > 0 ? `${daysLeft} Days` : "Expired"}</span>
      </div>

      <h2 className="text-4xl font-extrabold text-yellow-400 mb-6 text-center tracking-wide">🏏 Invest in Match</h2>

      <div className="text-center mb-6">
        <p className="text-gray-300 text-lg">
          Match: <span className="text-yellow-400 font-bold">{match.team1} vs {match.team2}</span>
        </p>
        <p className="text-gray-400">
          📅 {new Date(match.matchDate).toLocaleDateString()} | ⏰ {match.matchTime}
        </p>
        <p className="text-white">
          Minimum Investment: <span className="text-yellow-500 font-bold">₹{match.pricePerTeam}</span>
        </p>
      </div>

      {/* Winning Probability */}
      <div className="text-center text-md text-gray-400 mb-6">
        Winning Probability:
        <span className="text-[#FDC700] font-bold ml-1">
          {match?.minWinning ? `${match.minWinning}x` : "N/A"} - {match?.maxWinning ? `${match.maxWinning}x` : "N/A"}
        </span>
      </div>

      {/* Amount Input */}
      <div className="mt-6">
        <label className="text-sm font-semibold text-gray-300">Investment Amount (₹)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 bg-gray-900/40 border border-yellow-500/40 text-white rounded-xl focus:ring-2 focus:ring-yellow-500 placeholder-gray-400"
          placeholder="Enter amount"
        />
      </div>

      {/* Confirm Button */}
      <div className="mt-8 flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleConfirmSelection}
          className="px-8 py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-700 text-black shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
        >
          Confirm Investment 🚀
        </motion.button>
      </div>

      {/* Success & Error Messages */}
      {error && (
        <div className="absolute bottom-4 left-0 right-0 bg-red-500 text-white text-center py-2 rounded-lg shadow-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="absolute bottom-4 left-0 right-0 bg-green-500 text-white text-center py-2 rounded-lg shadow-lg">
          {success}
        </div>
      )}
    </div>
  );
};

export default InvestInTeam;
