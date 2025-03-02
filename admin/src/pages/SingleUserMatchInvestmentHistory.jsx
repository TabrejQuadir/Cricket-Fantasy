import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SingleUserMatchInvestmentHistory = () => {
  const [userId, setUserId] = useState("");
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
  };

  const fetchUserInvestmentHistory = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const response = await axios.get(
        `https://backend.prepaidtaskskill.in/api/admin/match-investment-history/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Ensure the admin is authenticated
          },
        }
      );

      if (response.data.success) {
        setInvestments(response.data.investments);
        setSuccessMessage("Investment history fetched successfully!");
      }
    } catch (error) {
      console.error("Error fetching investment history:", error);

      if (error.response) {
        if (error.response.status === 404) {
          setError("User not found or has no investment history.");
        } else {
          setError(error.response.data.message || "An error occurred.");
        }
      } else if (error.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearchClick = () => {
    if (userId.trim()) {
      fetchUserInvestmentHistory();
    } else {
      setError("Please enter a valid user ID.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-8 bg-black/40 backdrop-blur-3xl border border-yellow-500/40 rounded-3xl shadow-[0px_0px_50px_rgba(253,199,0,0.5)] text-white relative">
      <h2 className="text-4xl font-extrabold text-yellow-400 mb-6 text-center tracking-wide">
        📜 Admin - View User's Match Investment History
      </h2>

      <div className="mb-6">
        <label htmlFor="userId" className="text-lg font-semibold text-gray-300">
          Enter User ID:
        </label>
        <input
          type="text"
          id="userId"
          value={userId}
          onChange={handleUserIdChange}
          onKeyDown={handleKeyPress}
          className="w-full p-3 bg-gray-800/40 border border-yellow-500/40 text-white rounded-xl focus:ring-2 focus:ring-yellow-500 placeholder-gray-400"
          placeholder="Enter User ID"
        />
        <button
          onClick={handleSearchClick}
          disabled={loading}
          className={`mt-4 px-8 py-3 text-lg font-semibold rounded-xl text-black shadow-md transition-all duration-300 cursor-pointer ${loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-yellow-500 to-yellow-700 hover:shadow-xl"
            }`}
        >
          {loading ? "Searching..." : "Search User Investments"}
        </button>
      </div>

      {loading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-12 h-12 border-4 border-yellow-500 border-dotted rounded-full animate-spin"></div>
        </div>
      )}

      {successMessage && <p className="text-center text-green-500">{successMessage}</p>}

      {investments.length > 0 ? (
        <div className="overflow-x-auto mt-8">
          <table className="min-w-full bg-black/50 text-white border-collapse">
            <thead>
              <tr>
                <th className="p-3 border-b border-yellow-500">Match</th>
                <th className="p-3 border-b border-yellow-500">Amount Invested</th>
                <th className="p-3 border-b border-yellow-500">Investment Date</th>
              </tr>
            </thead>
            <tbody>
              {investments.map((investment) => (
                <tr key={investment._id} className="border-b border-yellow-500">
                  <td className="p-3">{investment.matchId.team1} vs {investment.matchId.team2}</td>
                  <td className="p-3">₹{investment.amount}</td>
                  <td className="p-3">
                    {new Date(investment.investmentDate).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : error && (
        <p className="text-center text-red-400 mt-8">{error}</p>
      )}

    </div>
  );
};

export default SingleUserMatchInvestmentHistory;
