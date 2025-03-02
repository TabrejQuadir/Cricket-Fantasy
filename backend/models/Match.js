const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
    team1: { type: String, required: true }, // First team
    team2: { type: String, required: true }, // Second team
    matchDate: { type: Date, required: true }, // Match date
    matchTime: { type: String, required: true }, // Match time (e.g., 10:30 AM or 22:30)
    category: { type: String, required: true }, // Match category (e.g., IPL, World Cup, etc.)
    pricePerTeam: { type: Number, required: true }, // Price per team
    minWinning: { type: Number, required: true }, // Minimum winning amount
    maxWinning: { type: Number, required: true }, // Maximum winning amount
    minTeamsPerUser: { type: Number, default: 1 }, // Minimum teams per user
    status: { type: String, enum: ["Upcoming", "Completed"], default: "Upcoming" }, // Match status
    finalWinning: { type: Number, default: null } // Final Winning after multiplier
});

const Match = mongoose.model("Match", matchSchema);
module.exports = Match;
