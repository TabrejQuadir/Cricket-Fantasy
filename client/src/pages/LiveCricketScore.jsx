import React from "react";
import { motion } from "framer-motion";

const LiveCricketScore = ({ liveScoreVisible }) => {
  const matchData = {
    team1: {
      name: "India",
      score: "210/3",
      overs: "35.2",
      logo: "https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg",
    },
    team2: {
      name: "Australia",
      score: "198/8",
      overs: "50.0",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Flag_of_Australia.svg/800px-Flag_of_Australia.svg.png?20211007161007",
    },
    status: "India needs 50 runs to win in 14.4 overs",
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.2, ease: "easeOut" },
    },
  };

  const floatingVariant = {
    animate: {
      y: [0, -5, 0], 
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
    },
  };

  return (
    <motion.div
      className="flex flex-col gap-6 justify-center items-center min-h-screen bg-gradient-to-b from-orange-500 via-white to-green-500 px-32"
      initial="hidden"
      animate={liveScoreVisible ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* Floating Score Card */}
      <motion.div
        className="bg-white/10 border border-black backdrop-blur-lg text-black p-6 rounded-xl shadow-2xl w-96 text-center"
        variants={floatingVariant}
        animate="animate"
      >
        <h2 className="text-xl font-bold mb-4 text-blue-700">🏏 Live Cricket Score</h2>
        <div className="flex items-center justify-between mb-4">
          <motion.div
            className="flex flex-col items-center"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 150 }}
          >
            <img src={matchData.team1.logo} alt={matchData.team1.name} className="w-12 h-8 mb-2" />
            <p className="font-semibold">{matchData.team1.name}</p>
            <p className="text-lg font-bold text-green-700">{matchData.team1.score}</p>
            <p className="text-sm">Overs: {matchData.team1.overs}</p>
          </motion.div>
          <span className="text-2xl font-bold">VS</span>
          <motion.div
            className="flex flex-col items-center"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 150 }}
          >
            <img src={matchData.team2.logo} alt={matchData.team2.name} className="w-12 h-8 mb-2" />
            <p className="font-semibold">{matchData.team2.name}</p>
            <p className="text-lg font-bold text-red-700">{matchData.team2.score}</p>
            <p className="text-sm">Overs: {matchData.team2.overs}</p>
          </motion.div>
        </div>
        <p className="text-yellow-500 font-semibold">{matchData.status}</p>
      </motion.div>

      {/* Welcome Section with Animated Text */}
      <motion.div
        className="text-center text-black p-6 rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-4 text-blue-800 animate-pulse"> Welcome to KheloIndia </h2>
        <p className="mb-4">
          We will provide you the <span className="font-semibold text-green-700">Best Teams</span> for Fantasy Cricket (Dream11, Vision11, etc.)
          <br />
          <span className="font-bold text-orange-700">
            "We also provide the Best Cricket Betting Tips for Match Sessions & Rates!"
          </span>
        </p>
        <motion.p
          className="text-lg font-bold text-gray-800"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          Style it your way and win big! 🏆
        </motion.p>
      </motion.div>

      {/* Animated Buttons */}
      <div className="flex gap-4">
        <motion.button
          className="relative bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-300 ease-in-out cursor-pointer overflow-hidden"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          whileHover={{ scale: 1.1, boxShadow: "0px 4px 20px rgba(255, 165, 0, 0.6)" }}
          whileTap={{ scale: 0.95 }}
        >
          Sign Up
        </motion.button>

        <motion.button
          className="relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-300 ease-in-out cursor-pointer overflow-hidden"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          whileHover={{ scale: 1.1, boxShadow: "0px 4px 20px rgba(0, 255, 0, 0.5)" }}
          whileTap={{ scale: 0.95 }}
        >
          Login
        </motion.button>
      </div>
    </motion.div>
  );
};

export default LiveCricketScore;
