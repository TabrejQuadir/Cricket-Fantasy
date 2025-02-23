import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const Loader = ({ onLoaded }) => {
    const loaderRef = useRef(null);
    const [progress, setProgress] = useState(100);
    const [showFlash, setShowFlash] = useState(false);

    useEffect(() => {
        let startTime = performance.now();

        const updateProgress = (timestamp) => {
            const elapsed = timestamp - startTime;
            const newProgress = Math.max(100 - Math.floor(elapsed / 25), 0);

            setProgress(newProgress);

            if (newProgress > 0) {
                requestAnimationFrame(updateProgress);
            } else {
                setShowFlash(true);

                setTimeout(() => {
                    loaderRef.current.classList.add("scale-150", "opacity-0");
                    setTimeout(onLoaded, 500);
                }, 300);
            }
        };

        requestAnimationFrame(updateProgress);
    }, [onLoaded]);

    return (
        <div
            ref={loaderRef}
            className="fixed inset-0 flex items-center justify-center bg-cover bg-center bg-no-repeat z-50 transition-all duration-700 ease-in-out h-screen"
            style={{
                backgroundImage: !showFlash
                    ? "url('https://echofyy.netlify.app/images/banner-bg2.jpg')"
                    : "none",
            }}
        >
            {!showFlash && (
                <div
                    className="absolute inset-0 bg-black"
                    style={{ opacity: progress / 100 }}
                />
            )}

            {showFlash && (
                <motion.div
                    initial={{
                        opacity: 0.7,
                        x: -window.innerWidth,
                        width: "100vw",
                        boxShadow: "0px 0px 60px rgba(121, 185, 0, 0.6)",
                        filter: "blur(10px)",
                        transform: "scale(0.8)",
                    }}
                    animate={{
                        opacity: 1,
                        x: 0,
                        width: "100vw",
                        boxShadow: "0px 0px 150px rgba(121, 185, 0, 1)",
                        filter: "blur(0px)",
                        transform: "scale(1)",
                    }}
                    exit={{
                        opacity: 0,
                        x: window.innerWidth,
                        width: "100vw",
                        boxShadow: "0px 0px 60px rgba(121, 185, 0, 0.6)",
                        filter: "blur(10px)",
                        transform: "scale(0.8)",
                    }}
                    transition={{
                        duration: 1.4,
                        ease: "easeOut",
                    }}
                    className="absolute inset-0 bg-black z-20 rounded-lg"
                />
            )}

            {!showFlash && (
                <div className="relative w-24 h-24 flex items-center justify-center z-10">
                    {/* Rotating Border Ring */}
                    <div className="absolute w-full h-full rounded-full border-[8px] border-transparent border-t-[#79B900] animate-spin-slow shadow-[0_0_30px_#79B900] before:content-[''] before:w-full before:h-full before:absolute before:rounded-full before:border-[2px] before:border-[#79B900] before:blur-[8px]" />

                    {/* Glowing Outer Pulse Circle */}
                    <div className="absolute w-48 h-48 rounded-full border-[6px] border-[#79B900] opacity-80 animate-pulse shadow-[0_0_50px_orange] before:content-[''] before:w-full before:h-full before:absolute before:rounded-full before:border-[2px] before:border-orange-500 before:blur-[10px]" />

                    {/* Inner Gradient Circle */}
                    <div className="absolute w-40 h-40 rounded-full bg-gradient-to-r from-[#79B900] to-orange-400 opacity-95 animate-pulse shadow-[0_0_60px_#79B900]" />

                    {/* Digital Counter with Smooth Animation */}
                    <motion.div
                        className="absolute text-2xl font-extrabold text-[#FFFFFF] font-mono tracking-[0.15em] drop-shadow-[0_0_15px_#79B900] blur-[0.5px]"
                        animate={{
                            opacity: [0.5, 1, 0.8, 1],
                            scale: [1, 1.1, 1],
                            y: [-5, 0, -5],
                        }}
                        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                    >
                        {progress}%
                    </motion.div>

                    {/* Heading Text with Modern Glow */}
                    <motion.p
                        className="absolute left-[-550px] top-[-120px] text-3xl font-extrabold text-[white] font-sans tracking-wide drop-shadow-[0_0_20px_#79B900] blur-[0.5px]"
                        animate={{
                            opacity: progress / 100,
                            y: [-50, 0],
                            scale: [0.85, 1],
                        }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    >
                        Get ready to win big with our Expert Cricket Team
                        <br />
                        Tips for Dream11 and Vision11
                    </motion.p>

                    {/* Enhanced Paragraph with Staggered Animation */}
                    <motion.p
                        className="absolute left-[-550px] top-[30px] text-lg font-semibold text-orange-400 font-sans tracking-wider drop-shadow-[0_0_10px_orange] blur-[0.5px] text-left"
                        animate={{
                            opacity: progress / 100,
                            x: [-80, 0],
                            scale: [0.95, 1],
                        }}
                        transition={{ duration: 1.6, ease: "easeOut", delay: 0.4 }}
                    >
                        Invest with confidence and get 100% surety of <br />winning double of your investment with our expert<br /> team tips.
                    </motion.p>
                </div>
            )}
        </div>
    );
};

export default Loader;