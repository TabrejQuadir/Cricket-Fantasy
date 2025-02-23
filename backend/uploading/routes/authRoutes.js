const express = require("express");
const {
    registerUser,
    loginUser,
    logoutUser,
    getProfile
} = require("../controllers/authController");

const router = express.Router();
const {isAuthenticated} = require("../middilware/authMiddilware"); // ✅ Corrected Import

// Register route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

// Logout route
router.post("/logout", logoutUser);

// Get user profile (Protected)
router.get("/profile", isAuthenticated, getProfile);

module.exports = router;
