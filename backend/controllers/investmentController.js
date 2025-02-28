const User = require("../models/UserSchema");

// 📌 User Buys an Investment Plan
exports.buyInvestmentPlan = async (req, res) => {
    const { userId, planName, amount, expiryDate } = req.body;

    try {
        // ✅ Validate required fields
        if (!userId || !planName || !amount || !expiryDate) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // ✅ Fetch user from database
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // ✅ Ensure the user does not have an active investment plan
        if (user.investmentPlan && user.investmentPlan.status === "Active") {
            return res.status(400).json({ message: "You already have an active investment plan." });
        }

        // ✅ Handle missing payment screenshot
        if (!req.file || !req.file.path) {
            return res.status(400).json({ message: "Payment screenshot is required." });
        }

        // ✅ Check if this is the first-time investment
        const isFirstTime = user.firstTimeFreeInvestment === null;

        // ✅ Store the new investment plan request
        user.investmentPlan = {
            planName,
            amount,
            expiryDate,
            status: "Pending",
            paymentScreenshot: req.file.path, // Store the screenshot path
        };

        // ✅ Update first-time free investment status
        if (isFirstTime) {
            user.firstTimeFreeInvestment = true;
        }

        await user.save();

        res.json({
            success: true,
            firstTimeFreeInvestment: user.firstTimeFreeInvestment,
            message: "Plan purchase request sent. Waiting for admin approval."
        });

    } catch (error) {
        console.error("Error buying investment plan:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};
