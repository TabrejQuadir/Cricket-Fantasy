import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaGift } from "react-icons/fa"; // Premium Icons
import "./LimitedTimeOffer.css";

const LimitedTimeOffer = () => {
  const [timeLeft, setTimeLeft] = useState(48 * 60 * 60); // 2 days in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="limited-time-offer">
      {/* Flashing Timer */}
      <motion.h2 className="flash-title">
        🚀 Final Call! <span className="timer">{formatTime(timeLeft)}</span> Left to Join!
      </motion.h2>

      {/* Sliding VIP Spots Left */}
      <div className="vip-spots-container mb-4">
        <div className="vip-spots">
          🎯 <span className="glow">Only 5 VIP Spots Left!</span> Secure Yours NOW! 🎯
        </div>
      </div>

      {/* Bonus Offer */}
      <motion.div className="bonus-offer">
        <FaGift className="bonus-icon" />  
        <span className="bonus-text">Invest ₹10,000 Today & Get ₹1,000 Bonus! 🔥</span>
      </motion.div>

      {/* Call-to-Action Button */}
      <motion.button className="cta" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
        Claim Your VIP Spot Now 🚀
      </motion.button>
    </div>
  );
};

export default LimitedTimeOffer;
