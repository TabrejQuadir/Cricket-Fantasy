import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaUpload, FaTrashAlt } from "react-icons/fa";

const UploadQr = () => {
  const [qrFile, setQrFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadedQr, setUploadedQr] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  useEffect(() => {
    const fetchQrCode = async () => {
      try {
        const response = await axios.get("https://backend.prepaidtaskskill.in/api/admin/get-qr");
        if (response.data.success) {
          setUploadedQr(response.data.qrCode);
          setUploaded(true);
        }
      } catch (error) {
        console.error("Error fetching QR Code:", error);
      }
    };
    fetchQrCode();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      setMessage("Invalid file type! Please upload PNG, JPG, or JPEG.");
      setQrFile(null);
      setPreview(null);
      return;
    }
    setQrFile(file);
    setPreview(URL.createObjectURL(file));
    setMessage("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!qrFile) {
      setMessage("Please select a QR code image to upload.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("qrCodes", qrFile);
    try {
      const response = await axios.post("https://backend.prepaidtaskskill.in/api/admin/upload-qr", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (response.data.success) {
        setUploadedQr(response.data.qrCode);
        setMessage("QR Code uploaded successfully!");
        setUploaded(true);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to upload QR code.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQr = async () => {
    try {
      const response = await axios.delete("https://backend.prepaidtaskskill.in/api/admin/delete-qr", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (response.data.success) {
        setUploadedQr(null);
        setUploaded(false);
        setMessage("QR Code deleted successfully!");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to delete QR code.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-gray-800/60 border border-yellow-500/50 p-8 rounded-3xl backdrop-blur-xl shadow-2xl"
      >
        <h2 className="text-center text-3xl font-bold text-yellow-400 mb-6 flex items-center justify-center gap-2">
          <FaUpload /> Upload QR Code
        </h2>

        {uploadedQr && (
          <div className="mb-6 flex flex-col items-center">
            <img
              src={`${uploadedQr}`}
              alt="Uploaded QR"
              className="w-44 h-44 rounded-xl shadow-lg border border-yellow-500 hover:scale-105 transition"
            />
            <p className="text-gray-400 text-sm mt-2">Your QR Code</p>
            <button
              onClick={handleDeleteQr}
              className="bg-red-500 hover:bg-red-700 text-white p-3 rounded-xl mt-4 flex items-center gap-2 shadow-lg"
            >
              <FaTrashAlt /> Delete QR Code
            </button>
          </div>
        )}

        {!uploadedQr && (
          <form onSubmit={handleUpload} className="space-y-5">
            <label className="block text-yellow-300 text-sm font-semibold">Select QR Code</label>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileChange}
              className="w-full p-3 bg-gray-700 border border-yellow-500/50 text-white rounded-xl focus:ring-2 focus:ring-yellow-500 transition"
              disabled={uploaded}
            />
            {preview && (
              <div className="mt-4 flex flex-col items-center">
                <img
                  src={preview}
                  alt="QR Preview"
                  className="w-40 h-40 rounded-xl shadow-lg border border-yellow-500 hover:scale-105 transition"
                />
                <p className="text-gray-400 text-sm mt-2">Preview</p>
              </div>
            )}

            <button
              type="submit"
              className={`w-full p-3 rounded-xl font-semibold transition-all shadow-lg ${
                loading || uploaded
                  ? "bg-yellow-500/50 cursor-not-allowed"
                  : "bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800"
              } text-black`}
              disabled={loading || uploaded}
            >
              {loading ? "Uploading..." : uploaded ? "QR Code Uploaded" : "Upload QR Code"}
            </button>
          </form>
        )}

        {message && <p className="text-center mt-4 text-yellow-300">{message}</p>}
      </motion.div>
    </div>
  );
};

export default UploadQr;