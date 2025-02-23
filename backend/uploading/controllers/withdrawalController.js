const WithdrawalRequest = require("../models/WithDrawRequest");
const User = require("../models/UserSchema");

// POST: Create a withdrawal request
const createWithdrawalRequest = async (req, res) => {
  const { amount, currency, bankName, accountNumber, branchCode } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid withdrawal amount." });
  }

  if (!["INR", "PKR", "RUB"].includes(currency)) {
    return res.status(400).json({
      message: "Invalid currency. Supported currencies are INR, PKR, and RUB.",
    });
  }

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if balance is sufficient
    if (user.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance." });
    }

    // Create a withdrawal request
    const withdrawalRequest = new WithdrawalRequest({
      userId: req.user._id,
      amount,
      currency,
      bankDetails: {
        bankName,
        accountNumber,
        branchCode,
      },
      status: "Pending",
      requestedAt: new Date(),
    });

    await withdrawalRequest.save();

    res.status(201).json({
      message: "Withdrawal request submitted successfully.",
      withdrawalRequest,
    });
  } catch (error) {
    console.error("Error creating withdrawal request:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// GET: Retrieve all withdrawal requests for the logged-in user
const getUserWithdrawalRequests = async (req, res) => {
  try {
    const requests = await WithdrawalRequest.find({
      userId: req.user._id,
    }).sort({ requestedAt: -1 });
    console.log(req.user._id);
    res.status(200).json({ requests });
  } catch (error) {
    console.error("Error fetching user withdrawal requests:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Fetch all withdrawal requests
const getAllWithdrawalRequests = async (req, res) => {
  try {
    const requests = await WithdrawalRequest.find() // Fetch all withdrawal requests
      .populate("userId", "email balance country") // Optionally populate user details
      .sort({ requestedAt: -1 }); // Sort by requested date

    // Format withdrawal requests to ensure consistent structure
    const formattedRequests = requests.map((request) => ({
      ...request.toObject(),
      userId: request.userId
        ? {
            _id: request.userId._id,
            email: request.userId.email,
            balance: request.userId.balance,
            country: request.userId.country,
          }
        : {},
    }));

    res.status(200).json({ withdrawalRequests: formattedRequests });
  } catch (error) {
    console.error("Error fetching all withdrawal requests:", error);
    res.status(500).json({ message: "Server error." });
  }
};

const updateWithdrawalRequestsByAdmin = async (req, res) => {
  const { requestId, status, reason } = req.body; // Request details from frontend
  console.log("Request ID:", requestId);
  console.log("New Status:", status);
  if (status === "Rejected") {
    console.log("Rejection Reason:", reason);
  }

  try {
    // ✅ Step 1: Fetch the withdrawal request by ID
    const withdrawalRequest = await WithdrawalRequest.findById(requestId);
    if (!withdrawalRequest) {
      return res.status(404).json({ message: "Withdrawal request not found." });
    }

    // ✅ Step 2: Fetch the user associated with the withdrawal request
    const user = await User.findById(withdrawalRequest.userId);
    if (!user) {
      return res.status(404).json({ message: "User associated with the request not found." });
    }

    // ✅ Step 3: Validate status
    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be 'Approved' or 'Rejected'." });
    }

    // ✅ Step 4: Handle approval & rejection logic
    if (status === "Approved") {
      const withdrawalAmount = withdrawalRequest.amount;

      if (user.balance < withdrawalAmount) {
        return res.status(400).json({ message: "Insufficient balance for withdrawal." });
      }

      user.balance -= withdrawalAmount; // Deduct the balance
      await user.save(); // Save updated balance
    } else if (status === "Rejected") {
      if (!reason || reason.trim() === "") {
        return res.status(400).json({ message: "Rejection reason is required." });
      }
      withdrawalRequest.reason = reason; // Store rejection reason
    }

    // ✅ Step 5: Update withdrawal request status
    withdrawalRequest.status = status;
    withdrawalRequest.reviewedAt = new Date(); // Timestamp for review
    await withdrawalRequest.save(); // Save updated request

    // ✅ Format withdrawal request response
    const formattedRequest = {
      ...withdrawalRequest.toObject(),
      userId: user
        ? {
            _id: user._id,
            email: user.email,
            balance: user.balance,
            country: user.country || "N/A",
          }
        : {},
    };

    res.status(200).json({
      message: "Withdrawal request status updated successfully.",
      withdrawalRequest: formattedRequest,
    });
  } catch (error) {
    console.error("Error updating withdrawal request:", error);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = {
  createWithdrawalRequest,
  getUserWithdrawalRequests,
  getAllWithdrawalRequests,
  updateWithdrawalRequestsByAdmin,
};
