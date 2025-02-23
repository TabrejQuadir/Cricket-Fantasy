const express = require('express');
const router = express.Router();
const { 
    getUserBankAccounts,
    createBankAccount,
    updateBankAccount,
    deleteBankAccount,
    setDefaultBankAccount
} = require('../controllers/bankAccountController');
const {isAuthenticated} = require('../middilware/authMiddilware');

// Get all bank accounts for a user
router.get('/', isAuthenticated, getUserBankAccounts);

// Create a new bank account
router.post('/', isAuthenticated, createBankAccount);

// Update a bank account
router.put('/:id', isAuthenticated, updateBankAccount);

// Delete a bank account
router.delete('/:id', isAuthenticated, deleteBankAccount);

// Set a bank account as default
router.put('/:id/set-default', isAuthenticated, setDefaultBankAccount);

module.exports = router;
