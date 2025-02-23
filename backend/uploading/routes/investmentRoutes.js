const express = require("express");
const { buyInvestmentPlan } = require("../controllers/investmentController");
const { isAuthenticated } = require("../middilware/authMiddilware");
const { uploadScreenshot } = require("../middilware/multerMiddilware"); // Import the upload middleware for handling screenshots

const router = express.Router();

// 📌 User Buys an Investment Plan (Uploads Payment Screenshot)
router.post("/buy-plan", isAuthenticated, uploadScreenshot.single("screenshot"), buyInvestmentPlan);

module.exports = router;
