import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaRupeeSign, FaChartLine, FaUsers, FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminMatchInvestments = () => {
  const [matches, setMatches] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState("");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // ✅ Fetch all upcoming matches
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get(
          "https://backend.prepaidtaskskill.in/api/matches/upcoming-matches",
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
          }
        );
        setMatches(response.data);
      } catch (error) {
        setErrorMessage("Failed to load matches. Please try again.");
      }
    };

    fetchMatches();
  }, []);

  useEffect(() => {
    if (!selectedMatchId) return;

    const fetchInvestments = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await axios.get(
          `https://backend.prepaidtaskskill.in/api/admin/match-investments/${selectedMatchId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
          }
        );

        setInvestments(response.data.investments);
        setSelectedMatch(response.data.match);

        // ✅ Calculate total investment
        const total = response.data.investments.reduce((sum, inv) => sum + inv.amount, 0);
        setTotalInvestment(total);
      } catch (error) {
        console.error("Error fetching investments:", error);

        if (error.response) {
          if (error.response.status === 404) {
            setErrorMessage(error.response.data.message);
          } else {
            setErrorMessage(error.response.data.message || "Failed to load investments.");
          }
        } else {
          setErrorMessage("Network error. Please try again.");
        }
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
        <FaArrowLeft
          className="text-xl cursor-pointer hover:text-yellow-500 transition-all"
          onClick={() => navigate(-1)}
        />
        <h2 className="text-3xl font-extrabold text-yellow-400">📜 Match Investments</h2>
      </div>

      {/* Match Dropdown */}
      <div className="mb-6">
        <label className="text-sm font-semibold text-gray-300">Select Match</label>
        <select
          value={selectedMatchId}
          onChange={(e) => {
            setSelectedMatchId(e.target.value);
            setSelectedMatch(null); // Reset selected match details
          }}
          className="w-full p-3 bg-gray-900/40 border border-yellow-500/40 text-white rounded-xl focus:ring-2 focus:ring-yellow-500 transition-all hover:bg-gray-800"
        >
          <option value="">Choose a match</option>
          {matches.map((match) => (
            <option key={match._id} value={match._id}>
              {match.team1} vs {match.team2} - {new Date(match.matchDate).toLocaleDateString()}
            </option>
          ))}
        </select>
      </div>

      {/* Selected Match Summary */}
      {selectedMatch && (
        <div className="p-4 mb-6 border border-yellow-500 rounded-xl bg-black/40">
          <h3 className="text-lg font-bold text-yellow-300">
            {selectedMatch.team1} 🆚 {selectedMatch.team2}
          </h3>
          <p className="text-sm text-gray-400">
            🗓 {new Date(selectedMatch.matchDate).toLocaleDateString()} | ⏰ {selectedMatch.matchTime}
          </p>
          <p className="text-sm text-gray-400">💰 Price per team: ₹{selectedMatch.pricePerTeam}</p>
        </div>
      )}

      {/* Investment Loader */}
      {loading && (
        <div className="flex justify-center items-center min-h-[150px]">
          <div className="w-12 h-12 border-4 border-yellow-500 border-dotted rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="flex justify-center items-center bg-red-500/20 text-red-400 border border-red-400 rounded-lg p-3 my-4">
          <FaExclamationTriangle className="mr-2" />
          {errorMessage}
        </div>
      )}

      {/* Investment Summary */}
      {investments.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 border border-yellow-500 rounded-xl bg-gray-900/40 text-yellow-300 flex items-center">
              <FaChartLine className="text-2xl mr-2" />
              <div>
                <p className="text-sm">Total Investment</p>
                <p className="text-xl font-bold">₹{totalInvestment}</p>
              </div>
            </div>
            <div className="p-4 border border-yellow-500 rounded-xl bg-gray-900/40 text-yellow-300 flex items-center">
              <FaUsers className="text-2xl mr-2" />
              <div>
                <p className="text-sm">Total Investors</p>
                <p className="text-xl font-bold">{investments.length}</p>
              </div>
            </div>
          </div>

          {/* Investment Table */}
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
    </div>
  );
};

export default AdminMatchInvestments;
