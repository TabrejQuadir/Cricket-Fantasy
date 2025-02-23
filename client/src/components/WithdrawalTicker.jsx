import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function WithdrawalTicker() {
    const [withdrawals, setWithdrawals] = useState([
        "✅ Rahul just withdrew ₹25,000 profit!",
        "✅ Amit earned ₹40,000 from the last match!",
        "✅ Deepak upgraded to VIP Plan!",
        "✅ Priya won ₹50,000 on Dream League!",
        "✅ Sandeep doubled his winnings today!",
        "✅ Anjali hit the jackpot in the Mega Contest!",
    ]);

    const tickerRef = useRef(null);

  useEffect(() => {
        const tl = gsap.timeline({ repeat: -1, defaults: { ease: "power1.inOut" } });

        tl.to(tickerRef.current, {
            y: "-90%",
            duration: 10,
            repeat: -1,
            yoyo: true,
        });

        return () => tl.kill();
    }, []);

    return (
        <div className="relative w-full max-w-2xl bg-gradient-to-br from-[#111] to-[#222] 
                        p-5 rounded-2xl shadow-[0px_0px_20px_5px_rgba(253,199,0,0.2)] 
                        border border-[#FDC700]/50 backdrop-blur-2xl overflow-hidden 
                        text-white">
            
            {/* Title with Glow Effect */}
            <h3 className="text-lg font-extrabold text-[#FDC700] text-center mb-4 uppercase tracking-wide 
                           bg-clip-text text-transparent bg-gradient-to-r from-[#FDC700] to-[#FFD700] drop-shadow-lg">
                🔥 Live Withdrawals
            </h3>

            {/* Scrolling Ticker */}
            <div className="h-48 overflow-hidden relative">
                <div ref={tickerRef} className="absolute top-0 left-0 w-full flex flex-col gap-2">
                    {withdrawals.concat(withdrawals).map((text, index) => (
                        <div
                            key={index}
                            className="p-3 text-sm text-center font-semibold tracking-wide 
                                       bg-black/20 rounded-lg shadow-md flex items-center justify-center 
                                       transition-all duration-300 border border-[#FDC700]/30 
                                       text-[#FDC700] backdrop-blur-lg"
                        >
                            {text}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
