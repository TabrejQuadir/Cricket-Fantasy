import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaArrowLeft, FaCheckCircle, FaClock, FaTimesCircle, FaImage, FaSpinner } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const DepositHistory = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [deposits, setDeposits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchDeposits = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const response = await axios.get("https://backend.prepaidtaskskill.in/api/balance/user-deposit-history", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setDeposits(response.data.depositHistory);
            } catch (error) {
                setErrorMessage("Failed to fetch deposit history.");
            } finally {
                setLoading(false);
            }
        };

        fetchDeposits();
    }, []);

    return (
        <div className="max-w-5xl mx-auto mt-24 p-6 bg-black/40 backdrop-blur-3xl border border-yellow-500/40 rounded-3xl shadow-lg text-white">
            {/* 🔙 Back Button */}
            <div className="flex items-center gap-4 mb-6">
                <FaArrowLeft
                    className="text-xl cursor-pointer hover:text-yellow-500 transition-all"
                    onClick={() => navigate(-1)}
                />
                <h2 className="text-3xl font-extrabold text-yellow-400">📜 Deposit History</h2>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-10">
                    <FaSpinner className="animate-spin text-yellow-400 text-3xl" />
                </div>
            ) : errorMessage ? (
                <p className="text-center text-red-400">{errorMessage}</p>
            ) : deposits.length === 0 ? (
                <p className="text-center text-gray-400">No deposit history found.</p>
            ) : (
                <>
                    {/* ✅ TABLE FOR LARGE SCREENS */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse rounded-lg overflow-hidden shadow-lg">
                            <thead className="bg-yellow-500 text-black uppercase text-sm">
                                <tr>
                                    <th className="py-3 px-4">Amount</th>
                                    <th className="py-3 px-4">Date</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4">Screenshot</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deposits.map((deposit, index) => (
                                    <tr
                                        key={deposit._id}
                                        className={`border-b border-yellow-500/40 ${index % 2 === 0 ? "bg-gray-900/50" : "bg-gray-800/50"
                                            }`}
                                    >
                                        <td className="py-4 px-4 text-yellow-400 font-bold">₹{deposit.amount}</td>
                                        <td className="py-4 px-4 text-gray-300">
                                            {new Date(deposit.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-4">
                                            {deposit.status === "Pending" ? (
                                                <span className="text-yellow-400 flex items-center gap-2">
                                                    <FaClock /> Pending
                                                </span>
                                            ) : deposit.status === "Approved" ? (
                                                <span className="text-green-400 flex items-center gap-2">
                                                    <FaCheckCircle /> Approved
                                                </span>
                                            ) : (
                                                <span className="text-red-400 flex items-center gap-2">
                                                    <FaTimesCircle /> Rejected
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4">
                                            {deposit.paymentScreenshot ? (
                                                <a
                                                    href={`${deposit.paymentScreenshot}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-yellow-400 flex items-center gap-2 hover:underline"
                                                >
                                                    <FaImage /> View Screenshot
                                                </a>
                                            ) : (
                                                <span className="text-gray-400">No Screenshot</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ✅ CARD VIEW FOR MOBILE SCREENS */}
                    <div className="md:hidden">
                        {deposits.map((deposit) => (
                            <div
                                key={deposit._id}
                                className="mb-6 p-4 bg-black/40 backdrop-blur-lg border border-yellow-500/40 rounded-xl shadow-xl transition-transform transform hover:scale-[1.02]"
                            >
                                {/* Amount */}
                                <p className="text-xl font-extrabold text-yellow-400">₹{deposit.amount}</p>
                                <p className="text-gray-300 text-xs italic">{new Date(deposit.createdAt).toLocaleDateString()}</p>

                                {/* Status Badge */}
                                <div className="mt-3">
                                    {deposit.status === "Pending" ? (
                                        <span className="inline-flex items-center gap-2 text-yellow-500 bg-yellow-500/10 px-3 py-1 text-xs font-bold uppercase rounded-full">
                                            <FaClock /> Pending
                                        </span>
                                    ) : deposit.status === "Approved" ? (
                                        <span className="inline-flex items-center gap-2 text-green-400 bg-green-500/10 px-3 py-1 text-xs font-bold uppercase rounded-full">
                                            <FaCheckCircle /> Approved
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-2 text-red-400 bg-red-500/10 px-3 py-1 text-xs font-bold uppercase rounded-full">
                                            <FaTimesCircle /> Rejected
                                        </span>
                                    )}
                                </div>

                                {/* Screenshot Link */}
                                {deposit.paymentScreenshot ? (
                                    <a
                                        href={`${deposit.paymentScreenshot}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-3 inline-flex items-center gap-2 text-yellow-400 font-semibold transition-all hover:underline hover:scale-105"
                                    >
                                        <FaImage className="text-lg" /> View Screenshot
                                    </a>
                                ) : (
                                    <p className="text-gray-400 mt-2 text-sm">No Screenshot</p>
                                )}
                            </div>
                        ))}
                    </div>

                </>
            )}
        </div>
    );
};

export default DepositHistory;
