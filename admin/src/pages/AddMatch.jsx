import React, { useState } from "react";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt, FaClock, FaFutbol, FaPlusCircle, FaUsers, FaDollarSign, FaTrophy } from "react-icons/fa";
import axios from "axios";

const AddMatch = () => {
    const [matchDetails, setMatchDetails] = useState({
        team1: "",
        team2: "",
        date: new Date(),
        time: "",
        category: "IPL",
        pricePerTeam: "",
        minWinning: "",
        maxWinning: "",
    });

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Handle Input Change
    const handleChange = (e) => {
        setMatchDetails({ ...matchDetails, [e.target.name]: e.target.value });
    };

    // Handle Date Change
    const handleDateChange = (date) => {
        setMatchDetails({ ...matchDetails, date: date });
    };

    // Handle Time Change
    const handleTimeChange = (e) => {
        setMatchDetails({ ...matchDetails, time: e.target.value });
    };

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { team1, team2, date, time, category, pricePerTeam, minWinning, maxWinning } = matchDetails;

        if (!team1 || !team2 || !date || !time || !pricePerTeam || !minWinning || !maxWinning) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            const response = await axios.post("https://backend.prepaidtaskskill.in/api/admin/create-match", {
                team1,
                team2,
                matchDate: date.toISOString(),
                matchTime: time,
                category,
                pricePerTeam,
                minWinning,
                maxWinning,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });

            if (response.data.success) {
                setSuccessMessage(`Match "${team1} vs ${team2}" added successfully!`);
                setMatchDetails({
                    team1: "",
                    team2: "",
                    date: new Date(),
                    time: "",
                    category: "IPL",
                    pricePerTeam: "",
                    minWinning: "",
                    maxWinning: "",
                });
                setTimeout(() => setSuccessMessage(""), 3000);
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Failed to add match. Try again later.");
            setTimeout(() => setErrorMessage(""), 3000);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-4xl p-8 bg-black/40 backdrop-blur-2xl rounded-3xl border border-yellow-500/40 shadow-[0px_0px_40px_rgba(253,199,0,0.5)] text-white"
            >
                <h1 className="text-3xl font-extrabold text-yellow-400 mb-6 text-center flex items-center justify-center">
                    <FaFutbol className="mr-3 text-4xl animate-pulse" />
                    Add Match
                </h1>

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

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-5">
                        <div>
                            <label className="block text-lg text-yellow-300 mb-2">Team 1</label>
                            <div className="flex items-center bg-gray-900/50 p-3 rounded-xl border border-yellow-500/50">
                                <FaUsers className="text-yellow-300 mr-3" />
                                <input
                                    type="text"
                                    name="team1"
                                    placeholder="Enter Team 1 Name"
                                    className="w-full bg-transparent focus:outline-none text-white placeholder-gray-400"
                                    value={matchDetails.team1}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-lg text-yellow-300 mb-2">Team 2</label>
                            <div className="flex items-center bg-gray-900/50 p-3 rounded-xl border border-yellow-500/50">
                                <FaUsers className="text-yellow-300 mr-3" />
                                <input
                                    type="text"
                                    name="team2"
                                    placeholder="Enter Team 2 Name"
                                    className="w-full bg-transparent focus:outline-none text-white placeholder-gray-400"
                                    value={matchDetails.team2}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-lg text-yellow-300 mb-2">Date</label>
                            <div className="flex items-center bg-gray-900/50 p-3 rounded-xl border border-yellow-500/50">
                                <FaCalendarAlt className="text-yellow-300 mr-3" />
                                <DatePicker
                                    selected={matchDetails.date}
                                    onChange={handleDateChange}
                                    className="w-full bg-transparent focus:outline-none text-white"
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="Select Match Date"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-lg text-yellow-300 mb-2">Time (HH:MM AM/PM)</label>
                            <div className="flex items-center bg-gray-900/50 p-3 rounded-xl border border-yellow-500/50">
                                <FaClock className="text-yellow-300 mr-3" />
                                <input
                                    type="text"
                                    name="time"
                                    placeholder="Enter Time (e.g., 10:30 AM)"
                                    className="w-full bg-transparent focus:outline-none text-white placeholder-gray-400"
                                    value={matchDetails.time}
                                    onChange={handleTimeChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-lg text-yellow-300 mb-2">Category</label>
                        <div className="flex items-center bg-gray-900/50 p-3 rounded-xl border border-yellow-500/50">
                            <FaTrophy className="text-yellow-300 mr-3" />
                            <input
                                type="text"
                                value="🏏 IPL"
                                disabled
                                className="w-full bg-transparent text-white cursor-not-allowed"
                            />
                        </div>
                    </div>


                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-lg text-yellow-300 mb-2">Price Per Team</label>
                        <div className="flex items-center bg-gray-900/50 p-3 rounded-xl border border-yellow-500/50">
                            <FaDollarSign className="text-yellow-300 mr-3" />
                            <input
                                type="number"
                                name="pricePerTeam"
                                placeholder="Enter Price Per Team"
                                className="w-full bg-transparent focus:outline-none text-white placeholder-gray-400"
                                value={matchDetails.pricePerTeam}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Minimum and Maximum Winning in a single row */}
                    <div className="col-span-1 md:col-span-2 flex gap-6">
                        <input type="number" name="minWinning" placeholder="Minimum Winning" className="w-1/2 bg-transparent focus:outline-none text-white placeholder-gray-400 border border-yellow-500/50 p-3 rounded-xl" value={matchDetails.minWinning} onChange={handleChange} />
                        <input type="number" name="maxWinning" placeholder="Maximum Winning" className="w-1/2 bg-transparent focus:outline-none text-white placeholder-gray-400 border border-yellow-500/50 p-3 rounded-xl" value={matchDetails.maxWinning} onChange={handleChange} />
                    </div>

                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }} type="submit" className="w-full cursor-pointer col-span-1 md:col-span-2 flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-700 text-black font-semibold shadow-lg hover:shadow-xl transition-all">
                        <FaPlusCircle className="mr-2 text-xl" /> Add Match
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default AddMatch;
