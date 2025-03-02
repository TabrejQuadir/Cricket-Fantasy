const mongoose = require("mongoose");

const investmentPlanSchema = new mongoose.Schema({
    planName: { type: String, required: true },
    amount: { type: Number, required: true }, // Amount invested
    purchaseDate: { type: Date, default: Date.now },
    expiryDate: { type: Date, required: true }, // When the plan expires
    status: { type: String, enum: ["Pending", "Active", "Expired", "Rejected"], default: "Pending" },
    paymentScreenshot: { type: String, required: true },
});

const matchInvestmentSchema = new mongoose.Schema({
    matchId: { type: mongoose.Schema.Types.ObjectId, ref: "Match" },
    amount: { type: Number, required: true },
    investmentDate: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    whatsappNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    balance: { type: Number, default: 0 }, // Wallet balance
    vipLevel: { type: String, enum: ["Bronze", "Vip Level-1", "Vip Level-2", "Vip Level-3", "Vip Level-4",], default: "Bronze" },
    qrCode: { type: String, default: "" },
    investmentPlan: { type: investmentPlanSchema, default: null },
    matchInvestments: [matchInvestmentSchema], 
    firstTimeFreeInvestment: { type: Boolean, default: true }, 
    isRestricted: { type: Boolean, default: false }, 
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
