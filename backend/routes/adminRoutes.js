const express = require("express");
const { createMatch, markMatchAsCompleted, getPendingInvestments, getPendingPlans, approveInvestmentPlan, rejectInvestmentPlan,updateVipLevel, getAdminUserInvestmentHistory, getAllUsers, registerAdmin, loginAdmin, uploadQr, getQrCode, deleteQrCode, getSingleUser, searchUsers, applyMultiplier, getMatchInvestments, getAllRestrictedUsers, restrictUser, unrestrictUser } = require("../controllers/adminController");
const { isAdmin } = require("../middilware/authMiddilware");
const { uploadQrCode  } = require("../middilware/multerMiddilware"); // Import QR code upload middleware
const router = express.Router();

// 📌 Admin Registration
router.post("/register", registerAdmin);

// 📌 Admin Login
router.post("/login", loginAdmin);

// 📌 Admin Gets a Single User by ID
router.get("/user/:userId", isAdmin, getSingleUser);

// 📌 Admin Searches Users by Query
router.get("/users/search", isAdmin, searchUsers);

// 📌 Admin Gets All Users
router.get("/users", isAdmin, getAllUsers);

// 📌 Admin Creates a Match
router.post("/create-match", isAdmin, createMatch);

// 📌 Admin Marks Match as Completed
router.put("/mark-match/:matchId", isAdmin, markMatchAsCompleted);

// 📌 Admin Uploads QR Code (Protected Route)
router.post("/upload-qr", isAdmin, uploadQrCode.single("qrCodes"), uploadQr);
// 📌 Get QR Code (Public Route - No Authentication Required)
router.get("/get-qr", getQrCode);

// 📌 Admin Deletes QR Code (Protected Route)
router.delete("/delete-qr", isAdmin, deleteQrCode);

// 📌 Admin Views Pending Investment Plans
router.get("/pending-plans", isAdmin, getPendingPlans);

// 📌 Admin Approves an Investment Plan
router.put("/approve-plan/:userId", isAdmin, approveInvestmentPlan);

// 📌 Admin Rejects an Investment Plan
router.put("/reject-plan/:userId", isAdmin, rejectInvestmentPlan);

// 📌 Admin Updates Vip Level Of User
router.put("/update-vip-level", isAdmin, updateVipLevel);

// 📌 Admin Views Pending Match Investments
router.get("/pending-investments", isAdmin, getPendingInvestments);

// 📌 Admin Views a Single User's Match Investment History
router.get("/match-investment-history/:userId", isAdmin, getAdminUserInvestmentHistory);

// Apply multiplier to all users who invested in a match
router.post("/apply-multiplier", isAdmin, applyMultiplier);

// ✅ Fetch all investments in a match (Admin Only)
router.get("/match-investments/:matchId", isAdmin, getMatchInvestments);

// 📌 6️⃣ Admin Gets All Restricted Users
router.get("/restricted-users", isAdmin, getAllRestrictedUsers);

// 📌 7️⃣ Admin Restricts a User
router.put("/restrict-user/:userId", isAdmin, restrictUser);

// 📌 7️⃣ Admin Unrestricts a User
router.put("/unrestrict-user/:userId", isAdmin, unrestrictUser);

module.exports = router;
