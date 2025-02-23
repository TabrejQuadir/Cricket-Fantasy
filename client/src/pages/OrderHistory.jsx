import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const OrderHistory = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate= useNavigate();
  const prevUserRef = useRef(null); // ✅ Track previous user state

  useEffect(() => {
    const fetchInvestmentHistory = async () => {
      try {
        if (!user) {
          setError("User not logged in.");
          setLoading(false);
          navigate("/auth");
          return;
        }

        // ✅ Prevent API call if the user hasn't changed
        if (prevUserRef.current && prevUserRef.current._id === user._id) return;
        prevUserRef.current = user; // Update previous user reference

        const response = await axios.get(
          `https://backend.prepaidtaskskill.in/api/matches/match-investment-history/${user._id}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
          }
        );
        setInvestments(response.data.investments);
      } catch (error) {
        console.error("Error fetching investment history:", error);
        setError("Failed to fetch investment history.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvestmentHistory();
  }, [user]); // ✅ Now runs only when the user actually changes


  // 🎯 Loading Effect
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="w-10 h-10 border-4 border-yellow-500 border-dotted rounded-full animate-spin"></div>
      </div>
    );

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto mt-20 p-6 sm:p-8 bg-black/40 backdrop-blur-3xl border border-yellow-500/40 rounded-3xl shadow-[0px_0px_50px_rgba(253,199,0,0.5)] text-white">
      <h2 className="text-4xl font-extrabold text-yellow-400 mb-6 text-center tracking-wide">
        🏏 Match Investment History
      </h2>

      {investments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {investments.map((investment) => (
            <motion.div
              key={investment._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="p-6 bg-gray-900/80 backdrop-blur-xl rounded-xl border border-yellow-500 shadow-lg hover:shadow-yellow-500/60 transition-all duration-500 transform hover:-translate-y-2"
            >
              {/* Team Logos & Names */}
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-gray-200 rounded-full text-gray-900 font-bold text-xl md:text-2xl shadow-md">
                    {investment.matchId.team1.charAt(0)}
                  </div>
                  <p className="mt-2 text-lg font-semibold">{investment.matchId.team1}</p>
                </div>

                <p className="text-xl md:text-2xl font-bold text-yellow-500">VS</p>

                <div className="text-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-gray-200 rounded-full text-gray-900 font-bold text-xl md:text-2xl shadow-md">
                    {investment.matchId.team2.charAt(0)}
                  </div>
                  <p className="mt-2 text-lg font-semibold">{investment.matchId.team2}</p>
                </div>
              </div>

              {/* Match Details */}
              <div className="mt-4 text-center text-gray-400 text-sm md:text-base">
                <p>
                  <span className="font-semibold text-yellow-400">{investment.matchId.category}</span> -{" "}
                  {new Date(investment.matchId.matchDate).toLocaleDateString()} at {investment.matchId.matchTime}
                </p>
                <p className="mt-1">
                  💵 Price Per Team: <span className="font-semibold text-yellow-500">₹{investment.matchId.pricePerTeam}</span>
                </p>
                <p className="mt-1">
                  🎯 Min - Max Winning: <span className="font-semibold text-yellow-500">{investment.matchId.minWinning}x - {investment.matchId.maxWinning}x</span>
                </p>
                {investment.matchId.status === "Completed" && (
                  <p className="mt-1">
                    🏆 Final Winning: <span className="font-semibold text-yellow-500">{investment.matchId.finalWinning}x</span>
                  </p>
                )}
              </div>

              {/* Investment Details */}
              <div className="mt-4 flex justify-between items-center">
                <p className="text-lg font-semibold text-yellow-500">💰 Invested: ₹{investment.amount}</p>
                <span
                  className={`px-4 py-1 rounded-lg text-sm font-bold ${investment.matchId.status === "Upcoming"
                      ? "bg-blue-600 text-white"
                      : "bg-green-600 text-black"
                    }`}
                >
                  {investment.matchId.status}
                </span>
              </div>

              {/* Investment Date */}
              <p className="text-center text-gray-400 mt-2 text-sm">
                📅 Invested On: {new Date(investment.investmentDate).toLocaleString()}
              </p>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">No investments found.</p>
      )}
    </div>
  );
};

export default OrderHistory;
