import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext"; // ✅ Import useAuth

const PurchaseModal = ({ isOpen, onClose, plan }) => {
  const { user, setUser } = useAuth(); // ✅ Get user & setUser from context
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [qrCode, setQrCode] = useState(null);

  // Fetch admin QR code if user has no investment plan
  useEffect(() => {
    if (isOpen && !user?.investmentPlan) {
      const fetchQrCode = async () => {
        try {
          const response = await axios.get("https://backend.prepaidtaskskill.in/api/admin/get-qr");
          if (response.data.success) {
            setQrCode(response.data.qrCode);
          }
        } catch (error) {
          console.error("Error fetching QR Code:", error);
        }
      };
      fetchQrCode();
    }
  }, [isOpen, user]);

  // Handle file change (payment screenshot)
  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (file && !["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      setMessage("Invalid file type! Please upload PNG, JPG, or JPEG.");
      setPaymentScreenshot(null);
      setPreview(null);
      return;
    }
    setPaymentScreenshot(file);
    setPreview(URL.createObjectURL(file));
    setMessage("");
  };

  // Submit payment screenshot
  const handleSubmit = async () => {
    if (!paymentScreenshot) {
      setMessage("Please upload a payment screenshot.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("screenshot", paymentScreenshot);
    formData.append("userId", user._id);
    formData.append("planName", plan.name);
    formData.append("amount", plan.price);

    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + plan.duration);
    formData.append("expiryDate", expiryDate.toISOString());

    try {
      const response = await axios.post("https://backend.prepaidtaskskill.in/api/investment/buy-plan", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.data.success) {
        setMessage("Plan purchase request sent. Waiting for admin approval.");

        // ✅ Update user state immediately (Optimistic UI update)
        setUser((prevUser) => ({
          ...prevUser,
          investmentPlan: { status: "Pending", paymentScreenshot: preview },
        }));

        console.log("Fetching updated user profile...");

        // ✅ Add a slight delay before fetching latest user profile
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // ✅ Fetch updated user profile from backend
        const updatedUserResponse = await axios.get("https://backend.prepaidtaskskill.in/api/auth/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });

        setUser(updatedUserResponse.data); // ✅ Update user state with fresh data
        console.log("Updated user profile:", updatedUserResponse.data);

        // Clear the preview after successful submission
        setPreview(null);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to upload payment screenshot.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const isButtonDisabled = user?.investmentPlan?.status === "Pending" || user?.investmentPlan?.status === "Active";
  const hasPendingPlan = user?.investmentPlan?.status === "Pending";

  return (
    <div
      className={`fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-50 transition-opacity duration-500 ${showModal ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <div className="bg-white p-8 rounded-lg max-w-lg w-full relative shadow-xl border-4 border-yellow-500">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black cursor-pointer"
          onClick={onClose}
        >
          <FaTimes size={24} />
        </button>
        <h2 className="text-xl font-bold text-center mb-6 text-yellow-500">Confirm Purchase</h2>

        {/* QR Code + Screenshot Preview Section */}
        <div className="flex items-center justify-center gap-6 mb-6">
          {preview && (
            <div className="text-center">
              <img
                src={preview}
                alt="Screenshot Preview"
                className="w-36 h-36 rounded-lg shadow-md border border-yellow-500"
              />
              <p className="text-gray-400 text-sm mt-2">Preview</p>
            </div>
          )}

          {!user?.investmentPlan && qrCode && (
            <div className="text-center">
              <img
                src={`${qrCode}`}
                alt="QR Code"
                className="w-40 h-40 rounded-lg shadow-lg border border-yellow-500"
              />
              <p className="text-gray-400 text-sm mt-2">Scan this QR to confirm the purchase.</p>
            </div>
          )}
        </div>

        {hasPendingPlan && (
          <div className="text-center mb-6">
            <p className="text-yellow-500 font-semibold text-lg">Your {user?.investmentPlan?.planName} plan is pending approval.</p>
            {user?.investmentPlan?.paymentScreenshot && (
              <div className="mt-4 text-center">
                <img
                  src={`${user.investmentPlan.paymentScreenshot}`}
                  alt="Pending Screenshot"
                  className="w-40 h-40 rounded-lg shadow-md border border-yellow-500 mx-auto"
                />
                <p className="text-gray-400 text-sm mt-2">Pending Payment Screenshot</p>
              </div>
            )}
          </div>
        )}

        <div className="mb-6 text-center">
          <h3 className="text-lg font-semibold">{plan?.planName} Plan</h3>
          <p className="text-sm text-gray-500">Price: ₹{plan?.price}</p>
          <p className="text-sm text-gray-500">Validity: {plan?.duration} Month(s)</p>
        </div>

        {!hasPendingPlan && (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-600">Upload Payment Screenshot</label>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleScreenshotChange}
              className="w-full p-3 bg-gray-800/40 border border-yellow-500/40 text-white rounded-xl focus:ring-2 focus:ring-yellow-500"
            />
            {/* 🔴 Alert for UTR visibility */}
            <p className="text-red-500 text-sm mt-2 font-semibold">
              ⚠️ UTR number must be visible in the screenshot, or the payment will be rejected.
            </p>
          </div>
        )}

        {message && <p className="text-center text-red-500 text-sm">{message}</p>}

        <div className="flex justify-between gap-4 mt-6">
          <button className="w-full py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300" onClick={onClose}>Cancel</button>
          {!hasPendingPlan && (
            <button className="w-full py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-600" onClick={handleSubmit} disabled={loading || isButtonDisabled}>{loading ? "Submitting..." : "Confirm Purchase"}</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;
