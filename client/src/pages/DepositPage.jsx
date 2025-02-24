import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";

const DepositPage = () => {
  const { user } = useAuth();
  const [qrCode, setQrCode] = useState(null);
  const [amount, setAmount] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [qrLoading, setQrLoading] = useState(true); // ✅ Loader for QR fetching
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Automatically hide success & error messages after 3 seconds
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  // ✅ Fetch Admin QR Code on Page Load
  useEffect(() => {
    const fetchQrCode = async () => {
      setQrLoading(true);
      try {
        const response = await axios.get("https://backend.prepaidtaskskill.in/api/admin/get-qr");
        if (!response.data || !response.data.qrCode) {
          throw new Error("QR Code URL not found in API response.");
        }
        setQrCode(response.data.qrCode);
      } catch (error) {
        console.error("Error fetching QR Code:", error);
        setErrorMessage("Failed to load QR Code.");
      } finally {
        setQrLoading(false);
      }
    };

    fetchQrCode();
  }, []);

  // ✅ Handle File Upload & Preview Image
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setScreenshot(file);
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  // ✅ Handle Deposit Submission
  const handleDeposit = async () => {
    if (!amount || amount <= 0) {
      setErrorMessage("Please enter a valid amount.");
      return;
    }
    if (!screenshot) {
      setErrorMessage("Please upload a payment screenshot.");
      return;
    }

    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("amount", amount);
    formData.append("paymentScreenshot", screenshot);

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post("https://backend.prepaidtaskskill.in/api/balance/add-balance", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setSuccessMessage("Deposit request submitted successfully! Waiting for admin approval.");
        setAmount("");
        setScreenshot(null);
        setScreenshotPreview(null);
      } else {
        setErrorMessage(response.data.message || "Failed to submit deposit request.");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-[100px]">
    {/* 🔗 Link to View All Deposit Requests */}
    <div className="absolute top-[90px] left-4 sm:left-10 z-10 bg-black/50 px-3 py-2 rounded-lg">
      <Link
        to="/deposit-history"
        className="text-yellow-400 hover:text-yellow-500 text-lg font-semibold transition-all duration-300"
      >
        📜 View Deposit History
      </Link>
    </div>
  
    <div className="max-w-lg mx-auto mt-12 sm:mt-16 p-6 bg-black/40 backdrop-blur-3xl border border-yellow-500/40 rounded-3xl shadow-[0px_0px_50px_rgba(253,199,0,0.5)] text-white text-center">
      <h2 className="text-3xl font-extrabold text-yellow-400 mb-6">💰 Deposit Funds</h2>
  
      {/* ✅ Display User Balance */}
      <p className="text-gray-300 text-sm mb-4">
        Your Current Balance: <span className="text-yellow-400 font-bold">₹{user.balance.toFixed(2)}</span>
      </p>
  
      {/* ✅ QR Code Display (Hidden When Screenshot is Uploaded) */}
      {!screenshotPreview && (
        <div className="mb-6">
          <p className="text-gray-400 text-sm mb-2">Scan the QR Code below to make a deposit:</p>
          {qrLoading ? (
            <div className="flex justify-center">
              <FaSpinner className="animate-spin text-yellow-400 text-3xl" />
            </div>
          ) : qrCode ? (
            <img src={qrCode} alt="Admin QR Code" className="w-48 h-48 mx-auto rounded-xl border border-yellow-500" />
          ) : (
            <p className="text-red-400 text-sm">QR Code not available.</p>
          )}
        </div>
      )}
  
      {/* ✅ Amount Input */}
      <div className="mb-6">
        <label className="text-sm font-semibold text-gray-300">Enter Deposit Amount (₹)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 bg-gray-900/40 border border-yellow-500/40 text-white rounded-xl focus:ring-2 focus:ring-yellow-500 placeholder-gray-400 mt-2"
          placeholder="Enter amount"
        />
      </div>
  
      {/* ✅ Upload Screenshot */}
      <div className="mb-6">
        <label className="text-sm font-semibold text-gray-300">Upload Payment Screenshot</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 mt-2 bg-gray-800 border border-yellow-500/40 rounded-xl text-white cursor-pointer"
        />
      </div>
  
      {/* ✅ Show Preview of Uploaded Screenshot */}
      {screenshotPreview && (
        <div className="mb-6">
          <p className="text-gray-400 text-sm mb-2">Uploaded Screenshot:</p>
          <img src={screenshotPreview} alt="Uploaded Screenshot" className="w-48 h-48 mx-auto rounded-xl border border-yellow-500" />
        </div>
      )}
  
      {/* ✅ Confirm Deposit Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleDeposit}
        className="px-6 py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-700 text-black shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
      >
        Confirm Deposit 🚀
      </motion.button>
  
      {/* ✅ Loading Spinner */}
      {loading && <div className="mt-4 text-yellow-400 text-sm">Processing deposit request...</div>}
  
      {/* ✅ Success & Error Messages */}
      {successMessage && <p className="mt-4 text-green-400">{successMessage}</p>}
      {errorMessage && <p className="mt-4 text-red-400">{errorMessage}</p>}
    </div>
  </div>
  
  );
};

export default DepositPage;
