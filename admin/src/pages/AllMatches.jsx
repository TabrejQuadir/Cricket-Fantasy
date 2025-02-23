import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaClock, FaUsers, FaTrophy, FaCheckCircle, FaTimes } from "react-icons/fa";
import axios from "axios";

const AllMatches = () => {
    const [matches, setMatches] = useState([]);
    const [filteredMatches, setFilteredMatches] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [matchStatus, setMatchStatus] = useState("Upcoming"); // Default filter to "Upcoming"

    // ✅ Fetch Matches from Backend
    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await axios.get("https://backend.prepaidtaskskill.in/api/matches/upcoming-matches", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                });
                setMatches(response.data);
                setFilteredMatches(response.data.filter((match) => match.status === matchStatus));
            } catch (error) {
                setErrorMessage("Failed to load matches. Please try again.");
            }
        };

        fetchMatches();
    }, [matchStatus]); // Trigger fetch when matchStatus changes

    // ✅ Mark Match as Completed
    const handleMarkCompleted = async (matchId) => {
        try {
            const response = await axios.put(
                `https://backend.prepaidtaskskill.in/api/admin/mark-match/${matchId}`,
                {},
                { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
            );

            if (response.data.success) {
                setSuccessMessage("Match marked as completed.");
                setMatches((prevMatches) =>
                    prevMatches.map((match) =>
                        match._id === matchId ? { ...match, status: "Completed" } : match
                    )
                );
                setFilteredMatches((prevMatches) =>
                    prevMatches.map((match) =>
                        match._id === matchId ? { ...match, status: "Completed" } : match
                    )
                );
                setTimeout(() => setSuccessMessage(""), 3000);
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Failed to mark match as completed.");
            setTimeout(() => setErrorMessage(""), 3000);
        }
    };

    // ✅ Handle Filter Change (Upcoming/Completed)
    const handleFilterChange = (status) => {
        setMatchStatus(status);
        setFilteredMatches(matches.filter((match) => match.status === status));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6 ">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full  p-6 bg-black backdrop-blur-2xl rounded-3xl border border-yellow-500/40 shadow-lg text-white"
            >
                {/* 📌 Page Title */}
                <h1 className="text-3xl font-extrabold text-yellow-400 mb-6 text-center flex items-center justify-center">
                    <FaTrophy className="mr-3 text-4xl animate-pulse" />
                    All Matches
                </h1>

                {/* 📌 Filter Buttons */}
                <div className="flex justify-center mb-6">
                    <button
                        onClick={() => handleFilterChange("Upcoming")}
                        className={`px-6 py-2 rounded-xl mr-4 text-white cursor-pointer ${
                            matchStatus === "Upcoming" ? "bg-yellow-600" : "bg-gray-700"
                        }`}
                    >
                        Upcoming Matches
                    </button>
                    <button
                        onClick={() => handleFilterChange("Completed")}
                        className={`px-6 py-2 rounded-xl text-white cursor-pointer ${
                            matchStatus === "Completed" ? "bg-yellow-600" : "bg-gray-700"
                        }`}
                    >
                        Completed Matches
                    </button>
                </div>

                {/* 📌 Success & Error Messages */}
                {successMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="p-3 mb-4 text-center text-yellow-300 bg-yellow-800/40 border border-yellow-400 rounded-lg"
                    >
                        {successMessage}
                    </motion.div>
                )}
                {errorMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="p-3 mb-4 text-center text-red-300 bg-red-800/40 border border-red-400 rounded-lg"
                    >
                        {errorMessage}
                    </motion.div>
                )}

                {/* 📌 Matches Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse border border-yellow-500/40">
                        <thead>
                            <tr className="bg-yellow-600 text-black">
                                <th className="p-3 border border-yellow-500/40">Category</th>
                                <th className="p-3 border border-yellow-500/40">Teams</th>
                                <th className="p-3 border border-yellow-500/40">Date & Time</th>
                                <th className="p-3 border border-yellow-500/40">Price/Team</th>
                                <th className="p-3 border border-yellow-500/40">Min - Max Winning</th>
                                <th className="p-3 border border-yellow-500/40">Final Winning</th>
                                <th className="p-3 border border-yellow-500/40">Status</th>
                                <th className="p-3 border border-yellow-500/40">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMatches.length > 0 ? (
                                filteredMatches.map((match) => (
                                    <tr key={match._id} className="border-b border-yellow-500/30 text-center">
                                        <td className="p-3">{match.category}</td>
                                        <td className="p-3">{match.team1} VS {match.team2}</td>
                                        <td className="p-3">
                                            <FaCalendarAlt className="inline-block mr-2 text-yellow-300" />
                                            {new Date(match.matchDate).toDateString()}<br />
                                            <FaClock className="inline-block mr-2 text-yellow-300" />
                                            {match.matchTime}
                                        </td>
                                        <td className="p-3">₹{match.pricePerTeam}</td>
                                        <td className="p-3">₹{match.minWinning} - ₹{match.maxWinning}</td>
                                        <td className="p-3">{match.finalWinning ? `₹${match.finalWinning}` : "Not Set"}</td>
                                        <td className="p-3">{match.status === "Completed" ? <FaCheckCircle className="text-green-400" /> : <FaTimes className="text-red-400" />}</td>
                                        <td className="p-3">
                                            {match.status === "Upcoming" && (
                                                <button onClick={() => handleMarkCompleted(match._id)} className="px-4 py-2 bg-yellow-500 text-black rounded-xl">
                                                    Mark Completed
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="8" className="text-center text-gray-400 p-4">No matches found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default AllMatches;
