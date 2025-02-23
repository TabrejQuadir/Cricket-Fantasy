import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaArrowLeft, FaPlus, FaPencilAlt, FaTrashAlt, FaStar } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const BankAccounts = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    branchCode: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ✅ Fetch all bank accounts
  useEffect(() => {
    const fetchBankAccounts = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("https://backend.prepaidtaskskill.in/api/bank-accounts", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAccounts(response.data.accounts);
        const defaultAcc = response.data.accounts.find((acc) => acc.isDefault);
        setDefaultAccount(defaultAcc ? defaultAcc._id : null);
      } catch (error) {
        setErrorMessage("Failed to load bank accounts.");
      }
    };

    fetchBankAccounts();
  }, []);

  // ✅ Auto-hide success & error messages after 3 seconds
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  // ✅ Handle Input Change
  const handleInputChange = (e) => {
    setBankDetails({ ...bankDetails, [e.target.name]: e.target.value });
  };

  // ✅ Handle Add & Edit Bank Account
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("authToken");

      if (isEditing) {
        // Update bank account
        await axios.put(
          `https://backend.prepaidtaskskill.in/api/bank-accounts/${editId}`,
          bankDetails,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccessMessage("Bank account updated successfully!");
      } else {
        // Add new bank account
        const response = await axios.post("https://backend.prepaidtaskskill.in/api/bank-accounts", bankDetails, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setSuccessMessage("Bank account added successfully!");
        }
      }

      // Refresh list
      const response = await axios.get("https://backend.prepaidtaskskill.in/api/bank-accounts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAccounts(response.data.accounts);
      setBankDetails({ bankName: "", accountNumber: "", accountHolder: "", branchCode: "" });
      setIsEditing(false);
      setEditId(null);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Edit
  const handleEdit = (account) => {
    setIsEditing(true);
    setEditId(account._id);
    setBankDetails({
      bankName: account.bankName,
      accountNumber: account.accountNumber,
      accountHolder: account.accountHolder,
      branchCode: account.branchCode,
    });
  };

  // ✅ Handle Delete
  const handleDelete = async (accountId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`https://backend.prepaidtaskskill.in/api/bank-accounts/${accountId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAccounts(accounts.filter((account) => account._id !== accountId));
      setSuccessMessage("Bank account deleted successfully!");
    } catch (error) {
      setErrorMessage("Failed to delete bank account.");
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (accountId) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("authToken");

      // ✅ Send PUT request to update the default bank account
      const response = await axios.put(
        `https://backend.prepaidtaskskill.in/api/bank-accounts/${accountId}/set-default`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // ✅ Update state with the new default account
        setDefaultAccount(accountId);

        // ✅ Update the accounts list with the updated response from the backend
        setAccounts(response.data.updatedAccounts);

        setSuccessMessage("Default bank account updated successfully!");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to update default bank account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-br from-gray-100 via-blue-50 to-gray-800">
      {/* Header */}
      {/* <div className="flex items-center w-full bg-white py-4 px-8 mb-6 border-b border-gray-200">
        <FaArrowLeft
          className="text-gray-700 text-2xl cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => window.history.back()}
        />
        <h1 className="ml-6 text-3xl font-extrabold text-gray-800">Bank Accounts</h1>
      </div> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-8">
          {/* Bank Accounts Section */}
          <div className="w-full lg:w-[60%] space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Bank Accounts</h2>

            {accounts.length === 0 ? (
              <p className="text-gray-500">No bank accounts added yet.</p>
            ) : (
              accounts.map((account) => (
                <div
                  key={account._id}
                  className={`bg-white/80 rounded-lg shadow-lg p-6 ${account.isDefault ? "border-2 border-blue-500" : "border border-gray-300"
                    }`}
                >
                  <h3 className="text-xl font-semibold text-gray-800">{account.bankName}</h3>
                  <p>Account Holder: {account.accountHolder}</p>
                  <p>Account Number: {account.accountNumber}</p>
                  <p>Branch Code: {account.branchCode}</p>

                  <div className="mt-4 flex gap-3">
                    <button onClick={() => handleEdit(account)} className="text-yellow-500 hover:text-yellow-600 transition-colors duration-300 cursor-pointer">
                      <FaPencilAlt />
                    </button>
                    <button onClick={() => handleDelete(account._id)} className="text-red-500 hover:text-red-600 transition-colors duration-300 cursor-pointer">
                      <FaTrashAlt />
                    </button>
                    {defaultAccount !== account._id && (
                      <button
                        onClick={() => handleSetDefault(account._id)}
                        className="text-blue-500 flex items-center gap-1 cursor-pointer"
                      >
                        <FaStar /> Set Default
                      </button>
                    )}
                    {account.isDefault && (
                      <span className="bg-blue-200 text-blue-700 px-2 py-1 rounded text-sm">Default</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add/Edit Bank Account Form */}
          <form onSubmit={handleSave} className="w-full lg:w-[35%] bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">{isEditing ? "Edit Bank Account" : "Add Bank Account"}</h2>
            <input type="text" name="bankName" value={bankDetails.bankName} onChange={handleInputChange} placeholder="Bank Name" className="w-full p-3 border border-gray-300 rounded-lg mb-4" required />
            <input type="text" name="accountHolder" value={bankDetails.accountHolder} onChange={handleInputChange} placeholder="Account Holder" className="w-full p-3 border border-gray-300 rounded-lg mb-4" required />
            <input type="text" name="accountNumber" value={bankDetails.accountNumber} onChange={handleInputChange} placeholder="Account Number" className="w-full p-3 border border-gray-300 rounded-lg mb-4" required />
            <input type="text" name="branchCode" value={bankDetails.branchCode} onChange={handleInputChange} placeholder="Branch Code" className="w-full p-3 border border-gray-300 rounded-lg mb-4" required />
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg">{isEditing ? "Save Changes" : "Add Bank Account"}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BankAccounts;
