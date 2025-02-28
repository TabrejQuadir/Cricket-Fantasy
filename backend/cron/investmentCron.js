const cron = require("node-cron");
const User = require("../models/UserSchema");

// 🔄 Run every day at midnight (00:00)
cron.schedule("0 0 * * *", async () => {
    try {
        console.log("🔄 Checking expired investment plans...");

        const currentDate = new Date();

        // Find users with an active investment plan that has expired
        const users = await User.find({
            "investmentPlan.status": "Active",
            "investmentPlan.expiryDate": { $lte: currentDate }
        });

        for (let user of users) {
            user.investmentPlan.status = "Expired"; // ✅ Update status to "Expired"
            await user.save();
            console.log(`✅ Investment plan expired for user: ${user.username}`);
        }

        console.log("✅ Investment plan check completed.");
    } catch (error) {
        console.error("❌ Error updating expired plans:", error);
    }
});
