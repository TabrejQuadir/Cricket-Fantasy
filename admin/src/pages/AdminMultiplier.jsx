import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminMultiplier = () => {
    const [matches, setMatches] = useState([]);
    const [matchId, setMatchId] = useState("");
    const [multiplier, setMultiplier] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        // Fetch upcoming matches
        const fetchMatches = async () => {
            try {
                const response = await axios.get("https://backend.prepaidtaskskill.in/api/matches/upcoming-matches");
                const upcomingMatches = response.data.filter(match => match.status === "Upcoming");
                setMatches(upcomingMatches);
            } catch (error) {
                console.error("Error fetching matches:", error);
            }
        };
        fetchMatches();
    }, []);

    const handleApplyMultiplier = async () => {
        if (!matchId || !multiplier || multiplier <= 0) {
            setMessage({ type: "error", text: "Please select a match and enter a valid multiplier." });
            return;
        }
        setLoading(true);
        setMessage(null);
        try {
            const token = localStorage.getItem("authToken"); // Admin token
            const response = await axios.post("https://backend.prepaidtaskskill.in/api/admin/apply-multiplier", 
                { matchId, multiplier },
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );
            setMessage({ type: "success", text: response.data.message });
        } catch (error) {
            setMessage({ type: "error", text: error.response?.data?.message || "Something went wrong." });
        }
        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-black text-yellow-400 rounded-lg shadow-2xl border border-yellow-500 mt-10">
            <h2 className="text-3xl font-extrabold mb-6 text-center uppercase tracking-wide">Apply Multiplier</h2>
            {message && (
                <div className={`p-3 mb-4 rounded text-center ${message.type === "error" ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}>{message.text}</div>
            )}
            <div className="mb-6">
                <label className="block text-lg font-semibold mb-2">Select Match</label>
                <select className="w-full p-3 bg-gray-900 border border-yellow-500 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400" value={matchId} onChange={(e) => setMatchId(e.target.value)}>
                    <option value="">-- Select a Match --</option>
                    {matches.map((match) => (
                        <option key={match._id} value={match._id}>
                            {match.team1} vs {match.team2} ({match.matchTime})
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-6">
                <label className="block text-lg font-semibold mb-2">Multiplier</label>
                <input
                    type="number"
                    className="w-full p-3 bg-gray-900 border border-yellow-500 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    value={multiplier}
                    onChange={(e) => setMultiplier(e.target.value)}
                    placeholder="Enter multiplier (e.g., 5)"
                />
            </div>
            <button 
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-md transition duration-200 ease-in-out disabled:bg-gray-500"
                onClick={handleApplyMultiplier} 
                disabled={loading}
            >
                {loading ? "Applying..." : "Apply Multiplier"}
            </button>
        </div>
    );
};

export default AdminMultiplier;