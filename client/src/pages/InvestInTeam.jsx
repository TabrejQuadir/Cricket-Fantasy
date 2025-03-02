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
  const [potentialEarnings, setPotentialEarnings] = useState(0);
  const [maxPotentialEarnings, setMaxPotentialEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [daysLeft, setDaysLeft] = useState(null);
  const [isFirstTimeFree, setIsFirstTimeFree] = useState(false);

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

    // Check if the user qualifies for a free investment
    setIsFirstTimeFree(user?.firstTimeFreeInvestment || false);
  }, [user]);

  // ✅ Calculate potential earnings when amount changes
  useEffect(() => {
    const investmentAmount = isFirstTimeFree ? 100 : amount;

    if (match?.minWinning && investmentAmount > 0) {
      setPotentialEarnings(investmentAmount * match.minWinning);
      setMaxPotentialEarnings(investmentAmount * match.maxWinning);
    } else {
      setPotentialEarnings(0);
      setMaxPotentialEarnings(0);
    }
  }, [amount, match, isFirstTimeFree]);

  // ✅ Handle Investment
  const handleConfirmSelection = async () => {
    setError(null);
    setSuccess(null);

    if (!user) {
      setError("User not found. Please log in first.");
      return;
    }

    const pricePerTeam = match?.pricePerTeam;
    const investmentAmount = isFirstTimeFree ? 100 : parseFloat(amount);

    if (!investmentAmount || isNaN(investmentAmount) || investmentAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (!isFirstTimeFree) {
      if (investmentAmount < pricePerTeam) {
        setError(`Minimum investment is ₹${pricePerTeam}.`);
        return;
      }

      if (investmentAmount % pricePerTeam !== 0) {
        setError(`Investment must be a multiple of ₹${pricePerTeam}.`);
        return;
      }
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://backend.prepaidtaskskill.in/api/matches/invest-match",
        {
          userId: user._id,
          matchId,
          amount: investmentAmount,
          isFreeInvestment: isFirstTimeFree,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        }
      );

      if (response.data.success) {
        setSuccess(`Investment of ₹${investmentAmount} was successful!`);
        setUser({ ...user, balance: response.data.remainingBalance, firstTimeFreeInvestment: false });
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

  if (success) return (
    <div className="h-screen flex justify-center items-center">
      <p className="text-center text-green-500 font-semibold text-xl">{success}</p>
    </div>
  );

  return (
    <div className="flex justify-center items-center min-h-screen px-4 sm:px-6 bg-black text-white ">
      <div className="max-w-4xl w-full p-6 sm:p-10 bg-black/40 backdrop-blur-xl border border-yellow-500/40 shadow-lg shadow-yellow-500/50 rounded-lg space-y-6 relative">

        {/* Balance & Plan Expiry */}
        <div className="flex flex-col sm:flex-row justify-between text-gray-300 text-sm font-semibold">
          <span>💰 Balance: ₹{user.balance.toFixed(2)}</span>
          <span>📅 Plan Expires in: {daysLeft > 0 ? `${daysLeft} Days` : "Expired"}</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-yellow-400 text-center">🏏 Invest in Match</h2>

        <div className="text-center">
          <p className="text-gray-300 text-lg">
            Match: <span className="text-yellow-400 font-bold">{match?.team1} vs {match?.team2}</span>
          </p>
          <p className="text-gray-400">📅 {new Date(match?.matchDate).toLocaleDateString()} | ⏰ {match?.matchTime}</p>
          <p className="text-white">
            Price Per Team: <span className="text-yellow-500 font-bold">₹{match?.pricePerTeam}</span>
          </p>
          <p className="text-white">
            Minimum Investment:
            <span className="text-yellow-500 font-bold">
              ₹{match?.minTeamsPerUser ? match.pricePerTeam * match.minTeamsPerUser : match?.pricePerTeam}
            </span>
          </p>
        </div>

        {/* Special Message for First-Time Users */}
        {isFirstTimeFree && (
          <div className="p-4 bg-gradient-to-r from-green-500 to-green-700 text-white text-center font-semibold rounded-xl shadow-md shadow-green-500/40 border border-green-300 animate-shine">
            🎁 As a First-Time Investor, You Can Invest ₹100 Only! No Risk, Just Rewards!
          </div>
        )}

        {/* Winning Probability */}
        <div className="text-center text-md text-gray-400 mb-6">
          Winning Probability:
          <span className="text-[#FDC700] font-bold ml-1">
            {match?.minWinning ? `${match.minWinning}x` : "N/A"} - {match?.maxWinning ? `${match.maxWinning}x` : "N/A"}
          </span>
        </div>

        {/* Investment Amount */}
        <div className="mt-4">
          <label className="text-sm font-semibold text-gray-300">Investment Amount (₹)</label>
          <input
            type="number"
            value={isFirstTimeFree ? 100 : amount}
            onChange={(e) => {
              if (!isFirstTimeFree) {
                const inputAmount = e.target.value === "" ? "" : parseInt(e.target.value, 10);
                setAmount(inputAmount);
                setError(""); // Clear error while typing
              }
            }}
            onBlur={() => {
              if (!isFirstTimeFree && amount) {
                const minInvestment = match.pricePerTeam * match.minTeamsPerUser;

                if (amount < minInvestment) {
                  setError(`Minimum investment is ₹${minInvestment}`);
                } else if (amount % match.pricePerTeam !== 0) {
                  setError(`Investment should be a multiple of ₹${match.pricePerTeam}`);
                } else {
                  setError(""); // Clear error if valid
                }
              }
            }}
            className={`w-full p-3 border ${error ? "border-red-500" : "border-yellow-500/40"} 
  text-white rounded-xl focus:ring-2 ${isFirstTimeFree ? "bg-gray-900/20 text-yellow-400 cursor-not-allowed" : "bg-gray-900/40 focus:ring-yellow-500"} 
  placeholder-gray-400`}
            placeholder="Enter amount"
            disabled={isFirstTimeFree}
          />

          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <p className="text-center text-lg text-yellow-400">
          💰 Potential Earnings: <span className="font-bold">₹{potentialEarnings.toFixed(2)} - ₹{maxPotentialEarnings.toFixed(2)}</span>
        </p>

        <div className="mt-6 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleConfirmSelection}
            className="px-6 py-3 w-full sm:w-auto text-lg font-semibold rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-700 text-black shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            Confirm Investment 🚀
          </motion.button>
        </div>
      </div>
    </div>

  );
};

export default InvestInTeam;
