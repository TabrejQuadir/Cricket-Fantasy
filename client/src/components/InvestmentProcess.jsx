import React from "react";
import { motion } from "framer-motion";
import { FaMoneyBillWave, FaRegClock, FaTrophy } from "react-icons/fa";

const steps = [
    {
        icon: <FaMoneyBillWave className="text-green-400 text-4xl sm:text-5xl md:text-6xl" />,
        title: "Subscribe & Get Free Trial",
        description: "Choose a subscription plan and receive a free trial to invest in a match for free!",
    },
    {
        icon: <FaRegClock className="text-yellow-400 text-4xl sm:text-5xl md:text-6xl" />,
        title: "Invest & Wait for Results",
        description: "Continue investing in upcoming matches and let expert strategies work for you.",
    },
    {
        icon: <FaTrophy className="text-blue-400 text-4xl sm:text-5xl md:text-6xl" />,
        title: "Earn & Withdraw",
        description: "Withdraw your winnings anytime and keep growing your earnings effortlessly!",
    },
];

const InvestmentProcess = () => {
    return (
        <div className="relative flex flex-col items-center justify-center py-20 text-white bg-black overflow-hidden">
            {/* Glowing Title */}
            <motion.h2
                className="text-2xl sm:text-3xl md:text-5xl font-extrabold mb-16 text-center relative uppercase"
                initial={{ opacity: 0, y: -50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 drop-shadow-lg">
                    How It Works
                </span>
            </motion.h2>

            {/* Steps Container - Always Horizontal */}
            <div className="relative flex items-center justify-center w-full max-w-6xl overflow-x-auto px-4 no-scrollbar">
                {steps.map((step, index) => (
                    <motion.div
                        key={index}
                        className="relative flex flex-col items-center text-center mx-2 sm:mx-6"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.3 }}
                        viewport={{ once: true }}
                    >
                        {/* Floating Neon Circle with Icon */}
                        <motion.div
                            className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center rounded-full bg-opacity-30 backdrop-blur-xl border border-yellow-300 shadow-2xl"
                            whileHover={{ scale: 0.95, rotate: 5 }}
                        >
                            {step.icon}
                        </motion.div>

                        {/* Step Title & Description */}
                        <h3 className="text-sm sm:text-lg md:text-xl font-bold mt-3 text-yellow-300 tracking-wider">
                            {step.title}
                        </h3>
                        <p className="text-gray-400 mt-2 max-w-[8rem] sm:max-w-[10rem] md:max-w-xs text-xs sm:text-sm leading-relaxed">
                            {step.description}
                        </p>

                        {/* Connecting Glowing Line */}
                        {index !== steps.length - 1 && (
                            <motion.div
                                className="absolute top-10 sm:top-12 left-full w-12 sm:w-20 md:w-24 h-[2px] bg-yellow-400 shadow-[0_0_15px_rgba(255,215,0,0.8)]"
                                initial={{ width: 0 }}
                                whileInView={{ width: "6rem" }}
                                transition={{ duration: 0.5, delay: index * 0.3 }}
                                viewport={{ once: true }}
                            />
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Subtle Animated Background Glow */}
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                <motion.div
                    className="w-80 h-80 bg-yellow-400 opacity-10 blur-3xl rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>
        </div>
    );
};

export default InvestmentProcess;
