require("dotenv").config(); // Load environment variables first
require("./cron/investmentCron"); // Import cron job
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const path = require("path");

// ✅ Import Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const investmentRoutes = require("./routes/investmentRoutes");
const matchRoutes = require("./routes/matchRoutes");
const bankAccountRoutes = require("./routes/bankAcoountRoutes");
const withdrawalRoutes = require("./routes/withdrawalRoutes");
const balanceRoutes = require("./routes/balanceRoutes");
const contactRoutes = require("./routes/contactRoutes");

// ✅ CORS setup
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:5174",
            "https://backend.prepaidtaskskill.in/"
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use(express.json()); // ✅ Parse JSON request body
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use((req, res, next) => {
    console.log(`🔹 Incoming Request: ${req.method} ${req.url}`);
    console.log("🔹 Request Body:", req.body);
    next();
});


// ✅ MongoDB connection
mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    })
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1); // Exit process on database failure
    });

// ✅ Default Route
app.get("/", (req, res) => {
    res.send("Server is running...");
});

// ✅ API Routes
app.use("/api/auth", authRoutes); // Authentication (User & Admin)
app.use("/api/admin", adminRoutes); // Admin Management
app.use("/api/investment", investmentRoutes); // investmentRoutes Management
app.use("/api/matches", matchRoutes); // Match Management
app.use('/api/bank-accounts', bankAccountRoutes); 
app.use('/api/withdrawals', withdrawalRoutes);
app.use("/api/balance", balanceRoutes);
app.use("/api/contact", contactRoutes);

// ✅ Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("❌ Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});
