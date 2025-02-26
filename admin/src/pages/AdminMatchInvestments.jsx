import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaRupeeSign, FaChartLine, FaUsers, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminMatchInvestments = () => {
  const [matches, setMatches] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState("");
  const [investments, setInvestments] = useState([]);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // ✅ Fetch all upcoming matches
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get("https://backend.prepaidtaskskill.in/api/matches/upcoming-matches", {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        setMatches(response.data);
      } catch (error) {
        setErrorMessage("Failed to load matches. Please try again.");
      }
    };

    fetchMatches();
  }, []);

  // ✅ Fetch investments for selected match
  useEffect(() => {
    if (!selectedMatchId) return;

    const fetchInvestments = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://backend.prepaidtaskskill.in/api/admin/match-investments/${selectedMatchId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });

        setInvestments(response.data.investments);

        // Calculate total investment
        const total = response.data.investments.reduce((sum, inv) => sum + inv.amount, 0);
        setTotalInvestment(total);
      } catch (error) {
        setErrorMessage("Failed to load investments.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, [selectedMatchId]);

  return (
    <div className="max-w-6xl mx-auto mt-24 p-6 bg-black/40 backdrop-blur-3xl border border-yellow-500/40 rounded-3xl shadow-lg text-white">
      {/* 🔙 Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <FaArrowLeft className="text-xl cursor-pointer hover:text-yellow-500 transition-all" onClick={() => navigate(-1)} />
        <h2 className="text-3xl font-extrabold text-yellow-400">📜 Match Investments</h2>
      </div>

      {/* Match Dropdown */}
      <div className="mb-6">
        <label className="text-sm font-semibold text-gray-300">Select Match</label>
        <select
          value={selectedMatchId}
          onChange={(e) => setSelectedMatchId(e.target.value)}
          className="w-full p-3 bg-gray-900/40 border border-yellow-500/40 text-white rounded-xl focus:ring-2 focus:ring-yellow-500"
        >
          <option value="">Choose a match</option>
          {matches.map((match) => (
            <option key={match._id} value={match._id}>
              {match.team1} vs {match.team2} - {new Date(match.matchDate).toLocaleDateString()}
            </option>
          ))}
        </select>
      </div>

      {/* Investment Table */}
      {loading ? (
        <p className="text-center text-yellow-400">Loading investments...</p>
      ) : investments.length === 0 ? (
        <p className="text-center text-gray-400">No investments found for this match.</p>
      ) : (
        <>
          <div className="text-right text-yellow-300 font-semibold text-lg mb-4">
            Total Investment: <FaRupeeSign className="inline" /> {totalInvestment}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-yellow-500 text-yellow-300">
                  <th className="p-3">User</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Investment Date</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((investment) => (
                  <tr key={investment._id} className="border-b border-yellow-500/30">
                    <td className="p-3">{investment?.email || "Unknown User"}</td>
                    <td className="p-3 text-yellow-400 font-bold">₹{investment.amount}</td>
                    <td className="p-3">{new Date(investment.investmentDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Error Message */}
      {errorMessage && <p className="text-center text-red-400">{errorMessage}</p>}
    </div>
  );
};

export default AdminMatchInvestments;
