const mongoose = require("mongoose");

const balanceRequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    paymentScreenshot: { type: String, required: true }, // Image URL
    reviewedAt: { type: Date }, // When admin reviews
    reason: { type: String }, // Reason for rejection
    createdAt: { type: Date, default: Date.now } // Request time
});

module.exports = mongoose.model("BalanceRequest", balanceRequestSchema);
