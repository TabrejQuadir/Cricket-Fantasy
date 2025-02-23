const User = require("../models/UserSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
    try {
        const { username, email, whatsappNumber, password } = req.body;

        if (!username || !email || !whatsappNumber || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists (by email or phone number)
        const existingUser = await User.findOne({ $or: [{ email }, { whatsappNumber }] });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email or whatsappNumber already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            email,
            whatsappNumber,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Create a token
        const token = jwt.sign(
            {
                userId: user._id,
                username: user.username,
                balance: user.balance,
                whatsappNumber: user.whatsappNumber,
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                whatsappNumber: user.whatsappNumber,
                balance: user.balance,
                vipLevel: user.vipLevel,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

exports.logoutUser = (req, res) => {
    res.clearCookie("authToken"); // If using cookies
    res.json({ message: "Logged out successfully" });
};

// ✅ Get User Profile (Protected)
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Profile error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};


