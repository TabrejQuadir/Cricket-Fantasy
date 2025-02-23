const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 📌 Cloudinary Storage for Screenshots (used for buying plans)
const storageScreenshots = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "screenshots",
    format: async (req, file) => file.mimetype.split("/")[1], // ✅ Extracts correct format
    public_id: (req, file) => `payment_${Date.now()}`,
  },
});


// 📌 Cloudinary Storage for QR Codes
const storageQrCodes = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "qrCodes",
    format: async (req, file) => file.mimetype.split("/")[1], // ✅ Extracts correct format
    public_id: (req, file) => `qr_${Date.now()}`,
  },
});

// File filter for allowed image types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PNG, JPG, and JPEG are allowed."), false);
  }
};

// Multer upload configurations
const uploadScreenshot = multer({
  storage: storageScreenshots,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max size: 5MB
});

const uploadQrCode = multer({
  storage: storageQrCodes,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max size: 5MB
});

module.exports = {
  uploadScreenshot, // For handling screenshots
  uploadQrCode, // For handling QR codes
};
