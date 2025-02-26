import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaWhatsapp, FaTelegram, FaShareAlt } from "react-icons/fa";
import axios from "axios";

const FloatingSocialButton = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [whatsappLink, setWhatsappLink] = useState("");
  const [telegramLink, setTelegramLink] = useState("");

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get("https://backend.prepaidtaskskill.in/api/contact", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setWhatsappLink(response.data.whatsappLink || "");
        setTelegramLink(response.data.telegramLink || "");
      } catch (error) {
        console.error("Error fetching social links", error);
      }
    };

    fetchLinks();
  }, []);

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-center z-50">
      {/* Expandable Social Buttons */}
      {isOpen && (
        <motion.div
          className="flex flex-col gap-3 mb-3"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 flex items-center justify-center rounded-full bg-green-500 text-white text-xl shadow-lg hover:scale-110 transition-all"
            >
              <FaWhatsapp />
            </a>
          )}
          {telegramLink && (
            <a
              href={telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-white text-xl shadow-lg hover:scale-110 transition-all"
            >
              <FaTelegram />
            </a>
          )}
        </motion.div>
      )}

      {/* Floating Action Button */}
      <motion.button
        className="w-14 h-14 cursor-pointer flex items-center justify-center rounded-full bg-yellow-500 text-white text-2xl shadow-xl transition-all hover:scale-110"
        onClick={() => setIsOpen(!isOpen)}
        animate={{ rotate: isOpen ? 135 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <FaShareAlt />
      </motion.button>
    </div>
  );
};

export default FloatingSocialButton;
