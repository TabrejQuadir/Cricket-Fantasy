const BalanceRequest = require("../models/BalanceRequest");
const User = require("../models/UserSchema");

// 📌 1️⃣ User Requests to Add Balance
exports.addBalanceRequest = async (req, res) => {
    const { userId, amount } = req.body;

    try {
        // ✅ Validate input
        if (!userId || !amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid request. Provide a valid amount." });
        }

        // ✅ Ensure payment screenshot is uploaded
        if (!req.file || !req.file.path) {
            return res.status(400).json({ message: "Payment screenshot is required." });
        }

        // ✅ Create a new balance request
        const balanceRequest = new BalanceRequest({
            userId,
            amount,
            paymentScreenshot: req.file.path, // ✅ Store screenshot URL
        });

        await balanceRequest.save();
        res.json({ success: true, message: "Balance request submitted. Waiting for admin approval." });
    } catch (error) {
        console.error("Error submitting balance request:", error);
        res.status(500).json({ message: "Server error." });
    }
};

// 📌 2️⃣ Admin Approves or Rejects Balance Request
exports.approveBalanceRequest = async (req, res) => {
    const { requestId, status, reason } = req.body;

    try {
        // ✅ Step 1: Fetch the balance request
        const balanceRequest = await BalanceRequest.findById(requestId);
        if (!balanceRequest) {
            return res.status(404).json({ message: "Balance request not found." });
        }

        // ✅ Step 2: Fetch the user associated with the request
        const user = await User.findById(balanceRequest.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // ✅ Step 3: Validate status
        if (!["Approved", "Rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status. Must be 'Approved' or 'Rejected'." });
        }

        // ✅ Step 4: Approve or Reject Request
        if (status === "Approved") {
            user.balance += balanceRequest.amount; // ✅ Add balance to user
            await user.save();
        } else if (status === "Rejected") {
            if (!reason || reason.trim() === "") {
                return res.status(400).json({ message: "Rejection reason is required." });
            }
            balanceRequest.reason = reason;
        }

        // ✅ Step 5: Update request status
        balanceRequest.status = status;
        balanceRequest.reviewedAt = new Date();
        await balanceRequest.save();

        res.json({ success: true, message: "Balance request updated successfully." });
    } catch (error) {
        console.error("Error approving balance request:", error);
        res.status(500).json({ message: "Server error." });
    }
};

// 📌 3️⃣ Admin Directly Adds Balance to a User
exports.adminAddBalance = async (req, res) => {
    const { userId, amount } = req.body;

    try {
        // ✅ Validate input
        if (!userId || !amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid request. Provide a valid user ID and amount." });
        }

        // ✅ Fetch the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // ✅ Add balance
        user.balance += amount;
        await user.save();

        res.json({
            success: true,
            message: `₹${amount} added to user balance.`,
            newBalance: user.balance,
        });
    } catch (error) {
        console.error("Error adding balance:", error);
        res.status(500).json({ message: "Server error." });
    }
};

// 📌 4️⃣ Admin Gets All Balance Requests
exports.getAllBalanceRequests = async (req, res) => {
    try {
        // ✅ Fetch all balance requests & populate user details (username, email)
        const balanceRequests = await BalanceRequest.find()
            .populate("userId", "username email balance") // Fetch user details
            .sort({ createdAt: -1 }); // Sort by latest requests

        res.json({ success: true, balanceRequests });
    } catch (error) {
        console.error("Error fetching balance requests:", error);
        res.status(500).json({ message: "Server error." });
    }
};

// 📌 5️⃣ User Gets Their Deposit History
// ✅ Get User Deposit History
exports.getUserDepositHistory = async (req, res) => {
    try {
      // ✅ Fetch all deposit requests for the logged-in user
      const depositHistory = await BalanceRequest.find({ userId: req.user._id })
        .sort({ createdAt: -1 });
  
      res.status(200).json({ success: true, depositHistory });
    } catch (error) {
      console.error("Error fetching deposit history:", error);
      res.status(500).json({ message: "Server error. Please try again." });
    }
  };
