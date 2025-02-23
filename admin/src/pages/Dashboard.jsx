import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { FaUsers, FaTrophy, FaChartBar, FaMoneyBillWave, FaUserShield } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
    const [admin, setAdmin] = useState(null);
    const [telegramLink, setTelegramLink] = useState("");
    const [whatsappLink, setWhatsappLink] = useState("");
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [currentField, setCurrentField] = useState("");
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError("");

            try {
                const token = localStorage.getItem("authToken"); // ✅ Get token from localStorage
                if (!token) {
                    setError("Unauthorized: No admin token found.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get("https://backend.prepaidtaskskill.in/api/admin/users", {
                    headers: {
                        Authorization: `Bearer ${token}`, // ✅ Send token in Authorization header
                    },
                });

                setUsers(response.data);
                console.log(response.data);
            } catch (error) {
                setError(error.response?.data?.message || "Failed to fetch users. Try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

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
            } catch (error) {
                setErrorMessage("Failed to load matches. Please try again.");
            }
        };

        fetchMatches();
    }, []);



    useEffect(() => {
        const fetchContactInfo = async () => {
            try {
                const authToken = localStorage.getItem("authToken");
                const response = await axios.get("https://backend.prepaidtaskskill.in/api/contact", {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                setTelegramLink(response.data.telegramLink || "");
                setWhatsappLink(response.data.whatsappLink || "");
            } catch (error) {
                console.error("Error fetching contact info", error);
            }
        };

        const token = localStorage.getItem("authToken");
        if (token) {
            const decoded = jwtDecode(token);
            setAdmin(decoded);
        }
        fetchContactInfo();
    }, []);

    const updateContact = async () => {
        setLoading(true);
        try {
            const authToken = localStorage.getItem("authToken");
            await axios.put("https://backend.prepaidtaskskill.in/api/contact", {
                ...(currentField === "telegram" && { telegramLink }),
                ...(currentField === "whatsapp" && { whatsappLink }),
            }, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            alert(`${currentField === "telegram" ? "Telegram" : "WhatsApp"} link updated successfully!`);
            setShowModal(false);
        } catch (error) {
            console.error("Error updating contact info", error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6 text-white flex flex-col items-center">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-6xl mb-8 p-6 bg-black/50 backdrop-blur-lg border border-yellow-500/50 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center md:justify-between"
            >
                <div className="flex items-center space-x-4">
                    <FaUserShield className="text-6xl text-yellow-400" />
                    <div>
                        <h2 className="text-3xl font-bold text-yellow-300">Welcome, {admin?.username || "Admin"}</h2>
                        <p className="text-gray-400">{admin?.email}</p>
                        <span className="text-yellow-500 font-semibold">{admin?.role?.toUpperCase()}</span>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
                <StatCard title="Total Users" value={users?.length} icon={<FaUsers />} />
                <StatCard title="Total Matches" value={matches?.length} icon={<FaTrophy />} />
                <StatCard title="Revenue" value="$4,56,789" icon={<FaMoneyBillWave />} />
                <StatCard title="Active Players" value="8,947" icon={<FaChartBar />} />
            </div>

            <div className="mt-8 w-full max-w-6xl p-6 bg-black/50 backdrop-blur-lg border border-yellow-500/50 rounded-2xl shadow-lg text-center">
                <h3 className="text-2xl font-bold text-yellow-300 mb-4">Contact Admin</h3>
                {telegramLink ? (
                    <div className="flex items-center space-x-4">
                        <input type="text" value={telegramLink} disabled className="p-2 rounded-lg bg-gray-800 text-white border border-gray-600 w-full" />
                        <button onClick={() => { setCurrentField("telegram"); setShowModal(true); }} className="px-4 py-2 bg-yellow-500 text-black rounded-lg">Update Telegram Link</button>
                    </div>
                ) : (
                    <button onClick={() => { setCurrentField("telegram"); setShowModal(true); }} className="px-4 py-2 bg-yellow-500 text-black rounded-lg">Add Telegram Link</button>
                )}
                <div className="flex items-center space-x-4 mt-4">
                    <input
                        type="text"
                        placeholder="Enter WhatsApp link"
                        value={whatsappLink}
                        onChange={(e) => setWhatsappLink(e.target.value)}
                        disabled={whatsappLink !== ""}
                        className="p-2 rounded-lg bg-gray-800 text-white border border-gray-600 w-full"
                    />
                    <button onClick={() => { setCurrentField("whatsapp"); setShowModal(true); }} className="px-4 py-2 bg-yellow-500 text-black rounded-lg">{whatsappLink ? "Update" : "Add"} WhatsApp Link</button>
                </div>
            </div>

            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                    >
                        <div className="bg-gray-900 p-6 rounded-lg shadow-xl w-96">
                            <h2 className="text-xl font-bold text-yellow-300 mb-4">Update {currentField === "telegram" ? "Telegram" : "WhatsApp"} Link</h2>
                            <input
                                type="text"
                                value={currentField === "telegram" ? telegramLink : whatsappLink}
                                onChange={(e) => currentField === "telegram" ? setTelegramLink(e.target.value) : setWhatsappLink(e.target.value)}
                                className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-600"
                            />
                            <div className="flex justify-end mt-4">
                                <button onClick={() => setShowModal(false)} className="px-4 py-2 mr-2 bg-gray-600 rounded-lg">Cancel</button>
                                <button onClick={updateContact} className="px-4 py-2 bg-yellow-500 text-black rounded-lg">Update</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const StatCard = ({ title, value, icon }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="p-6 bg-black/50 border border-yellow-500/50 backdrop-blur-lg rounded-2xl shadow-xl flex flex-col items-center text-center"
        >
            <div className="text-5xl text-yellow-400 mb-4">{icon}</div>
            <h3 className="text-xl font-semibold text-yellow-300">{title}</h3>
            <p className="text-2xl font-bold text-white">{value}</p>
        </motion.div>
    );
};

export default Dashboard;
