const express = require("express");
const { getContactInfo, updateContactInfo } = require("../controllers/contactController");
const { isAdmin } = require("../middilware/authMiddilware");

const router = express.Router();

// Route to get contact information
router.get("/", getContactInfo);

// Route to update contact information
router.put("/", isAdmin, updateContactInfo);

module.exports = router;
