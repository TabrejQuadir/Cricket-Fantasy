import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaMoneyBillWave, FaCheckCircle, FaExclamationTriangle, FaPiggyBank, FaHistory, FaSpinner } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const WithDrawPage = () => {
  const { user } = useAuth();
  const [defaultBank, setDefaultBank] = useState(null);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [loading, setLoading] = useState(false);
  const [bankLoading, setBankLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Fetch Default Bank Account with Loading Effect
  useEffect(() => {
    const fetchBankAccount = async () => {
      setBankLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("https://backend.prepaidtaskskill.in/api/bank-accounts", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const defaultAcc = response.data.accounts.find((acc) => acc.isDefault);
        if (defaultAcc) {
          setDefaultBank(defaultAcc);
        } else {
          setErrorMessage("No default bank account found. Please set one first.");
        }
      } catch (error) {
        setErrorMessage("Failed to load bank account details.");
      } finally {
        setBankLoading(false);
      }
    };

    fetchBankAccount();
  }, []);

  // ✅ Auto-hide error and success messages
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  // ✅ Handle Withdrawal Request
  const handleWithdraw = async () => {
    if (!defaultBank) {
      setErrorMessage("You need to set a default bank account first.");
      return;
    }
    if (!amount || amount <= 0) {
      setErrorMessage("Please enter a valid amount.");
      return;
    }
    if (amount > user.balance) {
      setErrorMessage("Insufficient balance.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.post(
        "https://backend.prepaidtaskskill.in/api/withdrawals",
        {
          amount,
          currency,
          bankName: defaultBank.bankName,
          accountNumber: defaultBank.accountNumber,
          branchCode: defaultBank.branchCode,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setSuccessMessage("Withdrawal request submitted successfully!");
        setAmount("");
      } else {
        setErrorMessage(response.data.message || "Failed to submit withdrawal request.");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* 🔗 Link to View All Withdrawal Requests */}
      <div className="absolute top-28 left-6 sm:left-10 z-10 bg-black/50 px-3 py-2 rounded-lg">
        <Link
          to="/withdraw-history"
          className="flex items-center gap-2 text-yellow-400 hover:text-yellow-500 text-lg font-semibold transition-all duration-300"
        >
          <FaHistory className="text-xl" /> View Withdrawal Requests
        </Link>
      </div>


      <div className="w-full max-w-lg mx-auto mt-10 sm:mt-16 p-6 bg-black/40 backdrop-blur-3xl border border-yellow-500/40 rounded-3xl shadow-lg text-white text-center">

        <h2 className="text-3xl font-extrabold text-yellow-400 mb-6">💳 Withdraw Funds</h2>

        {/* ✅ Display User Balance */}
        <p className="text-gray-300 text-sm mb-4">
          Your Balance: <span className="text-yellow-400 font-bold">₹{user.balance.toFixed(2)}</span>
        </p>

        {/* ✅ Default Bank Account Details with Loading Effect */}
        {bankLoading ? (
          <div className="flex justify-center mt-4">
            <FaSpinner className="animate-spin text-yellow-400 text-3xl" />
          </div>
        ) : defaultBank ? (
          <div className="bg-gray-900/50 p-4 rounded-lg border border-yellow-500/40 text-left">
            <h3 className="text-lg font-semibold text-yellow-400 flex items-center gap-2">
              <FaPiggyBank /> Default Bank Account
            </h3>
            <p className="text-gray-300">Bank: <span className="font-bold">{defaultBank.bankName}</span></p>
            <p className="text-gray-300">Account Number: <span className="font-bold">{defaultBank.accountNumber}</span></p>
            <p className="text-gray-300">Branch Code: <span className="font-bold">{defaultBank.branchCode}</span></p>
          </div>
        ) : (
          <p className="text-red-400 text-sm mt-4">⚠️ No default bank account found.</p>
        )}

        {/* ✅ Amount Input */}
        <div className="mt-6">
          <label className="text-sm font-semibold text-gray-300">Enter Withdrawal Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 bg-gray-900/40 border border-yellow-500/40 text-white rounded-xl focus:ring-2 focus:ring-yellow-500 placeholder-gray-400 mt-2"
            placeholder="Enter amount"
          />
        </div>

        {/* ✅ Currency Selection */}
        <div className="mt-4">
          <label className="text-sm font-semibold text-gray-300">Select Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full p-3 bg-gray-900/40 border border-yellow-500/40 text-white rounded-xl focus:ring-2 focus:ring-yellow-500 mt-2"
          >
            <option value="INR">INR</option>
            <option value="PKR">PKR</option>
            <option value="RUB">RUB</option>
          </select>
        </div>

        {/* ✅ Withdraw Button */}
        <button
          onClick={handleWithdraw}
          className="mt-6 px-6 py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-700 text-black shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
        >
          Withdraw Funds 💰
        </button>

        {/* ✅ Loading Spinner */}
        {loading && <div className="mt-4 text-yellow-400 text-sm">Processing withdrawal request...</div>}

        {/* ✅ Success & Error Messages */}
        {successMessage && (
          <p className="mt-4 flex items-center justify-center text-green-400">
            <FaCheckCircle className="mr-2" /> {successMessage}
          </p>
        )}
        {errorMessage && (
          <p className="mt-4 flex items-center justify-center text-red-400">
            <FaExclamationTriangle className="mr-2" /> {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default WithDrawPage;
