const BankAccount = require("../models/BankAccount");

// Get all bank accounts for a user
const getUserBankAccounts = async (req, res) => {
  try {
    const accounts = await BankAccount.find({ userId: req.user._id });
    res.json({ accounts });
  } catch (error) {
    console.error("Error fetching bank accounts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const createBankAccount = async (req, res) => {
  const userId = req.user._id;
  console.log("userId:", userId);

  if (!userId) {
    return res.status(400).json({ message: "userId is required." });
  }

  // Log the entire request body
  console.log("Request body:", req.body);

  const { bankName, accountNumber, accountHolder, branchCode } = req.body;

  if (!bankName || !accountNumber || !accountHolder || !branchCode) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const existingAccounts = await BankAccount.find({ userId: userId });
    if (existingAccounts.length >= 2) {
      return res
        .status(400)
        .json({ message: "Maximum limit of 2 bank accounts reached." });
    }

    const isDefault = existingAccounts.length === 0;

    const bankAccount = new BankAccount({
      userId: userId,
      bankName,
      accountNumber,
      accountHolder,
      branchCode,
      isDefault,
    });

    await bankAccount.save();

    res.status(201).json({
      message: "Bank account created successfully.",
      account: bankAccount,
    });
  } catch (error) {
    console.error("Error creating bank account:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a bank account
const updateBankAccount = async (req, res) => {
  try {
    const account = await BankAccount.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!account) {
      return res.status(404).json({ message: "Bank account not found" });
    }

    const { bankName, accountNumber, accountHolder, branchCode } = req.body;

    account.bankName = bankName;
    account.accountNumber = accountNumber;
    account.accountHolder = accountHolder;
    account.branchCode = branchCode;

    await account.save();
    res.json({ message: "Bank account updated successfully", account });
  } catch (error) {
    console.error("Error updating bank account:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a bank account
const deleteBankAccount = async (req, res) => {
  try {
    const account = await BankAccount.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!account) {
      return res.status(404).json({ message: "Bank account not found" });
    }

    const wasDefault = account.isDefault;
    await BankAccount.deleteOne({ _id: req.params.id });

    // If the deleted account was default and there's another account, make it default
    if (wasDefault) {
      const remainingAccount = await BankAccount.findOne({
        userId: req.user.userId,
      });
      if (remainingAccount) {
        remainingAccount.isDefault = true;
        await remainingAccount.save();
      }
    }

    res.json({ message: "Bank account deleted successfully" });
  } catch (error) {
    console.error("Error deleting bank account:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ Set a bank account as default (Only for the authenticated user)
const setDefaultBankAccount = async (req, res) => {
  const userId = req.user._id;  // Ensure the request comes from the authenticated user
  const { id } = req.params;    // The ID of the bank account to be set as default

  try {
    // ✅ Step 1: Ensure the requested bank account belongs to the user
    const account = await BankAccount.findOne({ _id: id, userId });

    if (!account) {
      return res.status(404).json({ message: "Bank account not found or does not belong to user." });
    }

    // ✅ Step 2: Remove default status from the user's other bank accounts
    await BankAccount.updateMany({ userId }, { isDefault: false });

    // ✅ Step 3: Set the selected bank account as default
    account.isDefault = true;
    await account.save();

    // ✅ Step 4: Return updated bank accounts
    const updatedAccounts = await BankAccount.find({ userId });
    
    res.status(200).json({ 
      success: true, 
      message: "Default account set successfully!", 
      updatedAccounts,
      defaultAccountId: account._id
    });
  } catch (error) {
    console.error("Error setting default bank account:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { setDefaultBankAccount };


module.exports = {
  getUserBankAccounts,
  createBankAccount,
  updateBankAccount,
  deleteBankAccount,
  setDefaultBankAccount,
};
