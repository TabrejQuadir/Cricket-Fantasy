const Match = require("../models/Match");
const User = require("../models/UserSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose')


// 📌 Register Admin
exports.registerAdmin = async (req, res) => {
    const { username, email, whatsappNumber, password } = req.body;

    try {
        // ✅ Check if any admin already exists
        const existingAdmin = await User.findOne({ role: "admin" });
        if (existingAdmin) {
            return res.status(400).json({ message: "An admin already exists. Only one admin is allowed." });
        }

        // ✅ Check if email already exists (for other users, if applicable)
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists." });
        }

        if (!/^\d{10}$/.test(whatsappNumber)) {
            return res.status(400).json({ message: "Invalid WhatsApp number. Must be 10 digits." });
        }

        // ✅ Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new User({
            username,
            email,
            whatsappNumber,
            password: hashedPassword,
            role: "admin" // ✅ Set Role as Admin
        });

        await newAdmin.save();
        res.status(201).json({ success: true, message: "Admin registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error registering admin", error });
    }
};

// 📌 Admin Login (remains the same)
exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // ✅ Check if admin exists
        const admin = await User.findOne({ email, role: "admin" });
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        // ✅ Compare Password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid password" });

        // ✅ Generate JWT Token
        const token = jwt.sign({
            id: admin._id,
            username: admin.username,
            email: admin.email,
            role: admin.role,
        }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({
            success: true,
            token,
            admin: {
                username: admin.username,
                email: admin.email,
                role: admin.role,
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
};

// 📌 Admin Gets All Users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find(
            { role: "user" }, // ✅ Filter: Only fetch users (exclude admins)
            "username email whatsappNumber balance investmentPlan role vipLevel isRestricted createdAt" // ✅ Select specific fields (Exclude password)
        );

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
};

// 📌 Admin Creates a Match
exports.createMatch = async (req, res) => {
    let { team1, team2, matchDate, matchTime, category, pricePerTeam, minWinning, maxWinning, minTeamsPerUser } = req.body;

    try {
        // Ensure the matchDate is parsed as a valid Date object
        matchDate = new Date(matchDate);

        // Create new match document
        const newMatch = new Match({
            team1,
            team2,
            matchDate,  // Store only the date and updated time
            matchTime,  // Store the time separately as string
            category,
            pricePerTeam,
            minWinning,
            maxWinning,
            minTeamsPerUser
        });

        // Save the match
        await newMatch.save();

        res.json({ success: true, message: "Match created successfully", match: newMatch });
    } catch (error) {
        console.error("Error creating match:", error);
        res.status(500).json({ message: "Error creating match", error });
    }
};

// 📌 Admin Marks a Match as Completed
exports.markMatchAsCompleted = async (req, res) => {
    try {
        const match = await Match.findById(req.params.matchId);
        if (!match) return res.status(404).json({ message: "Match not found" });

        match.status = "Completed";
        await match.save();
        res.json({ success: true, message: "Match marked as completed." });
    } catch (error) {
        res.status(500).json({ message: "Error updating match status", error });
    }
};

const cloudinary = require("cloudinary").v2;

exports.uploadQr = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const admin = await User.findById(req.user.id);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // 📌 Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            folder: "qrCodes",
        });

        // ✅ Save the Cloudinary URL in the database
        admin.qrCode = uploadResult.secure_url;
        await admin.save();

        res.json({ success: true, message: "QR Code uploaded successfully", qrCode: admin.qrCode });
    } catch (error) {
        console.error("Error uploading QR Code:", error);
        res.status(500).json({ message: "Error uploading QR Code", error });
    }
};


// 📌 Get QR Code (Admin Only)
exports.getQrCode = async (req, res) => {
    try {
        // Fetch the admin by their role "admin"
        const admin = await User.findOne({ role: "admin", qrCode: { $ne: "" } });

        if (!admin || !admin.qrCode) {
            return res.status(404).json({ message: "QR Code not found" });
        }

        res.json({ success: true, qrCode: admin.qrCode });
    } catch (error) {
        console.error("Error fetching QR Code:", error);
        res.status(500).json({ message: "Error fetching QR Code", error });
    }
};

// 📌 Admin Deletes QR Code (Protected Route)
exports.deleteQrCode = async (req, res) => {
    try {
        // Find the admin user based on the authenticated user ID
        const admin = await User.findById(req.user.id);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // Check if there's a QR code to delete
        if (admin.qrCode) {
            // Resolve the absolute path of the QR code image
            const filePath = path.resolve(__dirname, '..', 'uploads', 'qrCodes', admin.qrCode.split('/').pop());

            // Check if the file exists and delete it
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            } else {
                console.log('QR code file not found');
            }
        }

        // Clear the qrCode field in the database
        admin.qrCode = "";
        await admin.save();

        // Send success response
        res.json({ success: true, message: "QR Code deleted successfully" });
    } catch (error) {
        console.error("Error deleting QR Code:", error);
        res.status(500).json({ message: "Error deleting QR Code", error });
    }
};




// 📌 Admin Gets Pending Investment Plans
exports.getPendingPlans = async (req, res) => {
    try {
        const users = await User.find({ "investmentPlan.status": "Pending" }, "username email whatsappNumber investmentPlan");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching pending plans", error });
    }
};



// 📌 Admin Approves Investment Plan
exports.approveInvestmentPlan = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!user.investmentPlan || user.investmentPlan.status !== "Pending") {
            return res.status(400).json({ message: "No pending investment plan found." });
        }

        // ✅ Update purchaseDate to the exact approval time
        user.investmentPlan.purchaseDate = new Date();
        user.investmentPlan.status = "Active"; // Mark the plan as active

        // ✅ If the user has firstTimeFreeInvestment = true, add 100 balance
        if (user.firstTimeFreeInvestment === true) {
            user.balance += 100;
        }

        await user.save();

        res.json({ success: true, message: "Investment plan approved successfully." });
    } catch (error) {
        console.error("Error approving investment plan:", error);
        res.status(500).json({ message: "Something went wrong", error });
    }
};



// 📌 Admin Rejects an Investment Plan
exports.rejectInvestmentPlan = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user || !user.investmentPlan) return res.status(404).json({ message: "User or investment plan not found." });

        user.investmentPlan = null;
        await user.save();
        res.json({ success: true, message: "Investment plan rejected." });
    } catch (error) {
        res.status(500).json({ message: "Error rejecting plan", error });
    }
};

// 📌 Admin Updates Vip Level Of User
exports.updateVipLevel = async (req, res) => {
    const { userId, vipLevel } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.vipLevel = vipLevel;
        await user.save();

        res.json({ success: true, message: "VIP level updated successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error updating VIP level", error });
    }
};


// 📌 Admin Gets Pending Match Investments
exports.getPendingInvestments = async (req, res) => {
    try {
        const users = await User.find({ "matchInvestments.status": "Pending" }, "username email matchInvestments");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching pending investments", error });
    }
};

// 📌 Admin Get Single User's Match Investment History
exports.getAdminUserInvestmentHistory = async (req, res) => {
    const { userId } = req.params;

    try {
        // Check if the user exists
        const user = await User.findById(userId).populate("matchInvestments.matchId", "team1 team2 matchDate matchTime category pricePerTeam status");
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check if the current user is an admin (can be added as middleware `isAdmin`)
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Only admins can view user history." });
        }

        // Return the user's match investment history
        res.json({
            success: true,
            investments: user.matchInvestments
        });

    } catch (error) {
        console.error("Error fetching user investment history:", error);
        res.status(500).json({ message: "Something went wrong", error });
    }
};


// ✅ Get a Single User by ID (Admin Only)
exports.getSingleUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find user by ID
        const user = await User.findById(userId).select("-password"); // Exclude password from response
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Search Users by Query (Admin Only)
exports.searchUsers = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim().length < 3) {
            return res.status(400).json({ message: "Search query must be at least 3 characters long." });
        }

        // Search users by username or email (case-insensitive)
        const users = await User.find({
            $or: [
                { email: { $regex: query, $options: "i" } }
            ]
        }).select("-password"); // Exclude password for security

        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Apply Multiplier to a Match (Admin Only)
exports.applyMultiplier = async (req, res) => {
    try {

        const { matchId, multiplier } = req.body;

        if (!matchId || !multiplier || multiplier <= 0) {
            return res.status(400).json({ message: "Invalid matchId or multiplier" });
        }

        // ✅ Convert matchId to ObjectId
        const matchObjectId = new mongoose.Types.ObjectId(matchId);

        // ✅ Check if match exists
        const match = await Match.findById(matchObjectId);
        if (!match) {
            return res.status(404).json({ message: "Match not found" });
        }

        // ✅ If match is "Upcoming", update it to "Completed"
        if (match.status === "Upcoming") {
            match.status = "Completed";
        } else if (match.status === "Completed") {
            return res.status(400).json({ message: "Multiplier already applied. Match is completed." });
        }

        // ✅ Calculate finalWinning
        match.finalWinning = multiplier;
        await match.save();

        // ✅ Find all users who invested in the match
        const users = await User.find({ "matchInvestments.matchId": matchObjectId });

        if (!users.length) {
            return res.status(404).json({ message: "No investments found for this match" });
        }

        // ✅ Update user balances based on their investment
        for (let user of users) {
            let totalInvestment = 0;

            user.matchInvestments.forEach((investment) => {
                if (investment.matchId.toString() === matchId) {
                    totalInvestment += investment.amount;
                }
            });

            if (totalInvestment > 0) {
                user.balance += totalInvestment * multiplier;
                await user.save();
             }
        }

        res.status(200).json({ message: `Multiplier applied successfully. Match finalWinning set to ${multiplier}.` });
    } catch (error) {
        console.error("❌ Error Applying Multiplier:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 📌 Get All Investments for a Specific Match (Admin Only)
exports.getMatchInvestments = async (req, res) => {
    const { matchId } = req.params;

    try {
        // ✅ Step 1: Validate match existence
        const match = await Match.findById(matchId);
        if (!match) {
            return res.status(404).json({ message: "Match not found." });
        }

        // ✅ Step 2: Find all users who invested in the match
        const users = await User.find({ "matchInvestments.matchId": matchId });

        if (!users.length) {
            return res.status(404).json({ message: "No investments found for this match." });
        }

        // ✅ Step 3: Extract investment details
        const investments = users.flatMap((user) =>
            user.matchInvestments
                .filter((investment) => investment.matchId.toString() === matchId)
                .map((investment) => ({
                    userId: user._id,
                    email: user.email,
                    username: user.username || "Unknown",
                    amount: investment.amount,
                    investmentDate: investment.investmentDate,
                }))
        );

        // ✅ Step 4: Return formatted response
        res.status(200).json({
            success: true,
            match: {
                matchId: match._id,
                team1: match.team1,
                team2: match.team2,
                matchDate: match.matchDate,
                matchTime: match.matchTime,
                category: match.category,
                pricePerTeam: match.pricePerTeam,
                minWinning: match.minWinning,
                maxWinning: match.maxWinning,
                status: match.status,
            },
            investments,
        });

    } catch (error) {
        console.error("❌ Error fetching match investments:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// 📌 Admin Gets All Restricted Users
exports.getAllRestrictedUsers = async (req, res) => {
    try {
        const users = await User.find({ isRestricted: true });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching restricted users", error });
    }
};

// 📌 Admin Restricted Users
exports.restrictUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        user.isRestricted = true;
        await user.save();
        res.json({ message: "User restricted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error restricting user", error });
    }
};

// 📌 Admin Unrestrict Users
exports.unrestrictUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        user.isRestricted = false;
        await user.save();
        res.json({ message: "User unrestricted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error unrestricting user", error });
    }
};

