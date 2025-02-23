const express = require('express');
const router = express.Router();
const {isAuthenticated} = require('../middilware/authMiddilware');
const {isAdmin} = require('../middilware/authMiddilware');
const {
  createWithdrawalRequest,
  getUserWithdrawalRequests,
  getAllWithdrawalRequests,
  updateWithdrawalRequestsByAdmin
} = require('../controllers/withdrawalController');

// Create a withdrawal request
router.post('/', isAuthenticated, createWithdrawalRequest);

// Get user's withdrawal requests
router.get('/', isAuthenticated, getUserWithdrawalRequests);

// Route for admin to get all withdrawal requests
router.get('/admin/all',isAdmin, getAllWithdrawalRequests);

// Update withdrawal requests for users 
router.post('/admin/:userId/update-status', isAdmin, updateWithdrawalRequestsByAdmin);



module.exports = router;
