const Match = require("../models/Match");
const User = require("../models/UserSchema");

// 📌 Get Upcoming Matches
exports.getUpcomingMatches = async (req, res) => {
    try {
        const matches = await Match.find().sort({ matchDate: 1 });
        res.json(matches);
    } catch (error) {
        res.status(500).json({ message: "Error fetching matches", error });
    }
};

//Get Match 
exports.getMatch = async (req, res) => {
    try {
        const match = await Match.findById(req.params.matchId);
        if (!match) return res.status(404).json({ message: "Match not found" });
        res.json(match);
    } catch (error) {
        res.status(500).json({ message: "Error fetching match", error });
    }
};

// 📌 User Invests in a Match
exports.investInMatch = async (req, res) => {
    const { userId, matchId, amount } = req.body;
    console.log("Incoming request:", { userId, matchId, amount });

    try {
        // Find the user
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check if the user has an active investment plan
        if (!user.investmentPlan || user.investmentPlan.status !== "Active") {
            return res.status(400).json({ message: "You need an active investment plan to invest." });
        }

        // Find the match
        const match = await Match.findById(matchId);
        if (!match) return res.status(404).json({ message: "Match not found" });

        // ✅ Check if the user is a first-time investor (use `user.firstTimeFreeInvestment`)
        if (user.firstTimeFreeInvestment) {
            // ✅ First-time users can only invest ₹100
            if (amount !== 100) {
                return res.status(400).json({
                    message: "As a first-time investor, you can only invest exactly ₹100."
                });
            }
            // ✅ After first investment, reset first-time flag
            user.firstTimeFreeInvestment = false;
        } else {
            // ✅ Old users must invest in multiples of match.pricePerTeam
            if (amount % match.pricePerTeam !== 0) {
                return res.status(400).json({
                    message: `Investment amount must be in multiples of ₹${match.pricePerTeam}.`
                });
            }
        }

        // ✅ Check if the user has enough balance
        if (user.balance < amount) {
            return res.status(400).json({ message: "Insufficient balance. Please add funds to invest." });
        }

        // ✅ Deduct balance from user (both first-time and old users)
        user.balance -= amount;

        // ✅ Log investment details
        const newInvestment = {
            matchId,
            amount, // ✅ Store exact amount invested
            investmentDate: new Date(),
        };

        user.matchInvestments.push(newInvestment);
        await user.save();

        res.json({
            success: true,
            message: user.firstTimeFreeInvestment
                ? "Your first-time investment of ₹100 has been successfully processed!"
                : `Investment of ₹${amount} processed successfully.`,
            remainingBalance: user.balance,
            investment: newInvestment
        });

    } catch (error) {
        console.error("Error processing investment:", error);
        res.status(500).json({ message: "Something went wrong", error });
    }
};


// 📌 Get User's Investment History
exports.getInvestmentHistory = async (req, res) => {
    const { userId } = req.params;

    try {
        // Find the user
        const user = await User.findById(userId).populate("matchInvestments.matchId", "team1 team2 matchDate matchTime category pricePerTeam status minWinning maxWinning finalWinning");
        if (!user) return res.status(404).json({ message: "User not found" });

        // Return the user's match investment history
        res.json({
            success: true,
            investments: user.matchInvestments
        });

    } catch (error) {
        console.error("Error fetching investment history:", error);
        res.status(500).json({ message: "Something went wrong", error });
    }
};
