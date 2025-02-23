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
      setError("Failed to fetch investment history. Please try again.");
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

  return (
    <div className="max-w-5xl mx-auto mt-10 p-8 bg-black/40 backdrop-blur-3xl border border-yellow-500/40 rounded-3xl shadow-[0px_0px_50px_rgba(253,199,0,0.5)] text-white">
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
          className="w-full p-3 bg-gray-800/40 border border-yellow-500/40 text-white rounded-xl focus:ring-2 focus:ring-yellow-500"
          placeholder="Enter User ID"
        />
        <button
          onClick={handleSearchClick}
          className="mt-4 px-8 py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-700 text-black shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
        >
          Search User Investments
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center min-h-screen bg-black">
          <div className="w-12 h-12 border-4 border-yellow-500 border-dotted rounded-full animate-spin"></div>
        </div>
      )}

      {successMessage && <p className="text-center text-green-500">{successMessage}</p>}

      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Display investments if fetched, else show a message for no investments */}
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
      ) : (
        <p className="text-center text-gray-400 mt-8">No investment history found.</p>
      )}
    </div>
  );
};

export default SingleUserMatchInvestmentHistory;
