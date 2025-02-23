import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GiCricketBat } from "react-icons/gi";
import { FaTrophy, FaMoneyBillWave, FaWallet } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

function SportCategory({ icon: Icon, name, isCricket, onClick }) {
    return (
        <div
            onClick={!isCricket ? onClick : undefined}
            className={`relative flex flex-col items-center justify-center p-3 backdrop-blur-xl border border-[#FDC700]/50 
                    rounded-3xl transition-all duration-300 ease-in-out overflow-hidden cursor-pointer
                    before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:to-yellow-500/20 
                    before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100 
                    after:absolute after:inset-0 after:bg-[#FDC700]/10 after:rounded-3xl after:blur-lg
                    ${isCricket
                    ? "bg-gradient-to-r from-pink-600 via-red-500 to-orange-400 text-white shadow-lg shadow-pink-500/50 border-none animate-glow font-bold"
                    : "bg-black/20 border-[#FDC700]/50 text-white/90 hover:bg-black/30"
                }
                    ${name === "Cricket" ? 'border border-[#FDC700]/50 after:animate-pulse' : ""}
        `}
        >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FDC700]/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></span>
            <Icon className={`text-4xl mb-2 transition-all duration-300 ${isCricket ? "text-white drop-shadow-lg" : "text-[#FDC700]"}`} />
            <span className="text-sm font-semibold tracking-wide">{name}</span>
        </div>
    );
}

export default function ShopCategory() {
    const { user } = useAuth(); // Get user authentication state
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    // Function to handle deposit and withdraw clicks
    const handleActionClick = (action) => {
        if (!user) {
            setModalMessage("You need to login first.");
            setShowModal(true);
        } else {
            const route = action === "Deposit Money" ? "/deposit" : "/withdraw";
            navigate(route);
        }
    };

    // Function to handle "More" click (always shows "Coming Soon")
    const handleMoreClick = () => {
        setModalMessage("🚀 Coming Soon!");
        setShowModal(true);
    };

    useEffect(() => {
        let timeoutId;
        if (showModal) {
            timeoutId = setTimeout(() => setShowModal(false), 3000);
        }
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [showModal]);

    return (
        <div className="relative">
            {/* Categories */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 mb-6 md:mb-8">
                {/* Cricket Category */}
                <SportCategory icon={GiCricketBat} name="Cricket" isCricket />

                {/* Deposit Money */}
                <button onClick={() => handleActionClick("Deposit Money")}
                    className="relative flex flex-col items-center justify-center p-3 backdrop-blur-xl border border-[#FDC700]/50 
                    rounded-3xl transition-all duration-300 ease-in-out overflow-hidden cursor-pointer
                    before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:to-yellow-500/20 
                    before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100 
                    after:absolute after:inset-0 after:bg-[#FDC700]/10 after:rounded-3xl after:blur-lg">
                    <FaMoneyBillWave className="text-[#FDC700] text-4xl mb-2" />
                    <span className="text-sm font-semibold tracking-wide text-white">Deposit Money</span>
                </button>

                {/* Withdraw Money */}
                <button onClick={() => handleActionClick("Withdraw Money")}
                    className="relative flex flex-col items-center justify-center p-3 backdrop-blur-xl border border-[#FDC700]/50 
                    rounded-3xl transition-all duration-300 ease-in-out overflow-hidden cursor-pointer
                    before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:to-yellow-500/20 
                    before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100 
                    after:absolute after:inset-0 after:bg-[#FDC700]/10 after:rounded-3xl after:blur-lg">
                    <FaWallet className="text-[#FDC700] text-4xl mb-2" />
                    <span className="text-sm font-semibold tracking-wide text-white">Withdraw Money</span>
                </button>

                {/* More Category */}
                <SportCategory icon={FaTrophy} name="More" onClick={handleMoreClick} />
            </div>

            {/* Glassmorphic Notification Modal */}
            {showModal && (
                <div className="fixed inset-x-0 top-20 z-50 flex justify-center animate-bounce">
                    <div className="p-4 bg-black/30 backdrop-blur-lg border border-[#FDC700]/50 rounded-xl shadow-lg shadow-[#FDC700]/30 w-[280px] text-center text-white 
        transition-all duration-300 ease-in-out transform hover:scale-105">
                        <p className="text-lg font-semibold flex items-center justify-center">
                            <span className="mr-2">⚠️</span> {modalMessage}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
