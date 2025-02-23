import { useState, useEffect, useRef } from "react";
import { FaTrophy, FaUser, FaWallet, FaSignInAlt, FaInfoCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ Import useAuth

export default function Nav() {
    const { user, isAuthenticated, logout, setUser } = useAuth(); // ✅ Get user state from context
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null); // ✅ Ref for detecting clicks outside
    const navigate = useNavigate();

    // ✅ Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="backdrop-blur-lg bg-black/20 border-b border-yellow-600/40 shadow-lg shadow-yellow-900/20 fixed top-0 left-0 right-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 md:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo & About */}
                    <div className="flex items-center space-x-6">
                        <Link to="/" className="flex items-center space-x-2 md:space-x-3" onClick={() => setDropdownOpen(false)}>
                            <img className="size-10 md:size-14 drop-shadow-lg"
                                src="https://png.pngtree.com/png-vector/20250125/ourmid/pngtree-a-3d-logo-design-of-professional-cricket-league-at-the-center-png-image_15336326.png"
                                alt="SureWin11 Logo"
                                title="SureWin11 - Home"
                            />
                            <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 text-lg md:text-3xl font-extrabold tracking-wide drop-shadow-xl">
                                SureWin11
                            </h1>
                        </Link>
                    </div>

                    {/* Navigation Icons */}
                    <div className="flex items-center space-x-4 md:space-x-8">
                        {isAuthenticated && (
                            <>
                                <NavButton icon={FaTrophy} tooltip="Order History" onClick={() => navigate('/order-history')} />
                                <NavButton icon={FaWallet} tooltip="Wallet" onClick={() => setDropdownOpen(false)} />
                            </>
                        )}
                        <NavButton icon={FaInfoCircle} tooltip="About" onClick={() => navigate('/about')} />

                        {/* ✅ Conditionally show Profile or Login icon */}
                        {isAuthenticated ? (
                            <div className="relative" ref={dropdownRef}>
                                <NavButton icon={FaUser} tooltip="Profile" onClick={() => setDropdownOpen(!dropdownOpen)} />

                                {/* Dropdown Menu */}
                                {dropdownOpen && (
                                    <ul className="absolute right-0 mt-2 w-52 bg-black/80 backdrop-blur-md border border-yellow-500/40 shadow-[0px_0px_15px_rgba(253,199,0,0.3)] rounded-xl overflow-hidden transition-all duration-300">
                                        <li>
                                            <Link
                                                to="/profile"
                                                className="block px-5 py-3 text-white text-lg font-medium transition-all duration-300 hover:bg-yellow-500/20 hover:text-yellow-400"
                                                onClick={() => setDropdownOpen(false)} // ✅ Close dropdown on click
                                            >
                                                Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <button
                                                onClick={() => {
                                                    logout(); // ✅ Logout user
                                                    setDropdownOpen(false); // ✅ Close dropdown
                                                }}
                                                className="w-full text-left px-5 py-3 text-red-500 text-lg font-medium transition-all duration-300 hover:bg-red-500/20 hover:text-red-400"
                                            >
                                                Logout
                                            </button>
                                        </li>
                                    </ul>
                                )}
                            </div>
                        ) : (
                            <Link to="/auth" onClick={() => setDropdownOpen(false)}>
                                <NavButton icon={FaSignInAlt} tooltip="Login" className="cursor-pointer" />
                            </Link>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    );
}

/* 🔹 Nav Button Component with Tooltip */
function NavButton({ icon: Icon, tooltip, onClick }) {
    return (
        <div className="relative group">
            <button
                onClick={onClick}
                className="relative cursor-pointer flex items-center justify-center text-yellow-500/80 hover:text-yellow-400 
                       transition-all duration-300 text-lg sm:text-xl p-2 rounded-lg 
                       hover:scale-110 active:scale-95 
                       bg-black/20 hover:bg-yellow-700/10 border border-yellow-600/50 shadow-md 
                       hover:shadow-yellow-500/40"
            >
                <Icon />
            </button>
            {/* Tooltip */}
            <span className="absolute left-1/2 -translate-x-1/2 -bottom-10 px-2 py-1 text-sm text-white bg-yellow-600/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {tooltip}
            </span>
        </div>
    );
}
