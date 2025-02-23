const express = require("express");
const multer = require("multer");
const { getUpcomingMatches, investInMatch, getInvestmentHistory, getMatch } = require("../controllers/matchController");
const { isAuthenticated } = require("../middilware/authMiddilware");

const router = express.Router();

// 📌 Get Upcoming Matches
router.get("/upcoming-matches", getUpcomingMatches);

//Get Single Match
router.get("/:matchId", getMatch);

// 📌 User Invests in a Match
router.post("/invest-match", isAuthenticated, investInMatch);

// 📌 Get User's Match Investment History
router.get("/match-investment-history/:userId", isAuthenticated, getInvestmentHistory);


module.exports = router;
