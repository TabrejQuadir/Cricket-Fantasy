const express = require("express");
const { uploadScreenshot } = require("../middilware/multerMiddilware"); // ✅ Import multer middleware
const { addBalanceRequest, approveBalanceRequest, adminAddBalance, getAllBalanceRequests, getUserDepositHistory } = require("../controllers/balanceController");
const { isAuthenticated } = require("../middilware/authMiddilware");
const  {isAdmin} = require("../middilware/authMiddilware");

const router = express.Router();

// ✅ User submits a balance request with a payment screenshot
router.post("/add-balance", isAuthenticated, uploadScreenshot.single("paymentScreenshot"), addBalanceRequest);

// ✅ Admin approves/rejects a balance request
router.post("/approve-balance", isAdmin, approveBalanceRequest);

// ✅ Admin manually adds balance to a user
router.post("/admin-add-balance", isAdmin, adminAddBalance);

// 📌 4️⃣ Admin Gets All Balance Requests
router.get("/all-balance-requests", isAdmin, getAllBalanceRequests);

// 📌 5️⃣ User Gets Their Deposit History
router.get("/user-deposit-history", isAuthenticated, getUserDepositHistory);

module.exports = router;
