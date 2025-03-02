import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaBars, FaTimes, FaHome, FaUsers, FaTrophy, FaClipboardList,
    FaMoneyBillWave, FaCog, FaPlus, FaList,
    FaArrowAltCircleDown,
    FaArrowRight,
    FaImage
} from "react-icons/fa";
import axios from "axios";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const navigate = useNavigate();
    const authToken = localStorage.getItem("authToken"); // Check if user is logged in


    // Toggle dropdowns (auto-close previous)
    const toggleDropdown = (dropdownName) => {
        setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
    };

    const handleLogout = async (event) => {
        console.log("hello")
        event.preventDefault();

        try {
            await axios.post('https://backend.prepaidtaskskill.in/api/auth/logout'); // Send logout request
            localStorage.removeItem("authToken"); // ✅ Remove token from localStorage
            navigate("/auth"); // ✅ Redirect user to login page
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };


    return (
        <nav className="fixed top-0 left-0 w-full bg-black/80 backdrop-blur-lg shadow-lg border-b border-yellow-500/40 z-50">
            <div className="w-full mx-auto px-12 py-4 flex justify-between items-center">
                {/* ✅ Logo */}
                <Link to="/dashboard" className="text-yellow-400 text-lg font-bold">
                    <img
                        src="https://png.pngtree.com/png-vector/20250125/ourmid/pngtree-a-3d-logo-design-of-professional-cricket-league-at-the-center-png-image_15336326.png"
                        alt="Admin Logo"
                        className="w-12 h-12 transition-all duration-300"
                    />
                </Link>

                {/* ✅ Desktop Menu */}
                <div className="hidden md:flex space-x-6 items-center">
                    <NavItem to="/dashboard" icon={<FaHome />} label="Dashboard" />

                    <DropdownItem
                        icon={<FaUsers />} label="Users" isActive={activeDropdown === "users"}
                        toggleDropdown={() => toggleDropdown("users")}
                        subItems={[
                            { to: "/users", icon: <FaList />, label: "All Users" },
                            { to: "/update-vip-level", icon: <FaPlus />, label: "Update VIP Level" },
                            { to: "/update-restrict-user", icon: <FaPlus />, label: "Update Restrict User" },
                        ]}
                    />

                    <DropdownItem
                        icon={<FaTrophy />} label="Matches" isActive={activeDropdown === "matches"}
                        toggleDropdown={() => toggleDropdown("matches")}
                        subItems={[
                            { to: "/add-match", icon: <FaPlus />, label: "Add Match" },
                            { to: "/all-matches", icon: <FaList />, label: "All Matches" },
                            { to: "/match-result", icon: <FaList />, label: "Match Result" },
                        ]}
                    />

                    <DropdownItem
                        icon={<FaClipboardList />} label="Wallet Management" isActive={activeDropdown === "wallet"}
                        toggleDropdown={() => toggleDropdown("wallet")}
                        subItems={[
                            { to: "/add-balance", icon: <FaPlus />, label: "Add Balance" },
                            { to: "/withdraw-balance", icon: <FaList />, label: "Withdraw Balance" },
                            { to: "/upload-qr", icon: <FaImage />, label: "Upload QR" },
                        ]}
                    />

                    <DropdownItem
                        icon={<FaMoneyBillWave />} label="Transactions" isActive={activeDropdown === "transactions"}
                        toggleDropdown={() => toggleDropdown("transactions")}
                        subItems={[
                            { to: "/investment-plan-verification", icon: <FaList />, label: "Investment Plan Verify" },
                            { to: "/match-investment-history", icon: <FaList />, label: "SingleUserMatchInvestmentHistory" },
                            { to: "/admin/match-investments", icon: <FaList />, label: "SingleMatchUsersInvestmentHistory" },
                            { to: "/deposit-verification", icon: <FaList />, label: "Deposit Verification" },
                        ]}
                    />

                    {/* ✅ Conditionally Render Login or Logout Button */}
                    {authToken ? (
                        <button
                            onClick={handleLogout}
                            className="flex items-center text-yellow-300 hover:text-yellow-500 transition-all duration-300 text-lg px-6 py-2 cursor-pointer"
                        >
                            <FaArrowRight className="text-xl mr-2" /> Logout
                        </button>
                    ) : (
                        <Link
                            to="/auth"
                            className="flex items-center text-yellow-300 hover:text-yellow-500 transition-all duration-300 text-lg px-6 py-2"
                        >
                            <FaArrowRight className="text-xl mr-2" /> Login
                        </Link>
                    )}

                </div>

                {/* ✅ Mobile Menu Button */}
                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-yellow-400 text-2xl">
                    {isOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* ✅ Mobile Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden bg-black/90 backdrop-blur-md border-t border-yellow-500/40"
                    >
                        <div className="flex flex-col space-y-4 py-4 text-center">
                            <NavItem to="/dashboard" icon={<FaHome />} label="Dashboard" closeMenu={() => setIsOpen(false)} />

                            <DropdownItem
                                icon={<FaUsers />} label="Users" isActive={activeDropdown === "users"}
                                toggleDropdown={() => toggleDropdown("users")}
                                subItems={[
                                    { to: "/users", icon: <FaList />, label: "All Users" },
                                    { to: "/update-vip-level", icon: <FaPlus />, label: "Update VIP Level" },
                                    { to: "/update-restrict-user", icon: <FaPlus />, label: "Update Restrict User" },
                                ]}
                                mobile
                            />

                            <DropdownItem
                                icon={<FaTrophy />} label="Matches" isActive={activeDropdown === "matches"}
                                toggleDropdown={() => toggleDropdown("matches")}
                                subItems={[
                                    { to: "/add-match", icon: <FaPlus />, label: "Add Match" },
                                    { to: "/all-matches", icon: <FaList />, label: "All Matches" },
                                ]}
                                mobile
                            />

                            <DropdownItem
                                icon={<FaClipboardList />} label="Wallet Management" isActive={activeDropdown === "wallet"}
                                toggleDropdown={() => toggleDropdown("wallet")}
                                subItems={[
                                    { to: "/add-balance", icon: <FaPlus />, label: "Add Balance" },
                                    { to: "/withdraw-balance", icon: <FaList />, label: "Withdraw Balance" },
                                    { to: "/upload-qr", icon: <FaImage />, label: "Upload QR" },
                                ]}
                                mobile
                            />

                            <DropdownItem
                                icon={<FaMoneyBillWave />} label="Transactions" isActive={activeDropdown === "transactions"}
                                toggleDropdown={() => toggleDropdown("transactions")}
                                subItems={[
                                    { to: "/investment-plan-verification", icon: <FaList />, label: "Investment Plan Verify" },
                                    { to: "/match-investment-history", icon: <FaList />, label: "SingleUserMatchInvestmentHistory" },
                                    { to: "/admin/match-investments", icon: <FaList />, label: "SingleMatchUsersInvestmentHistory" },
                                    { to: "/deposit-verification", icon: <FaList />, label: "Deposit Verification" },

                                ]}
                                mobile
                            />

                            {/* ✅ Conditionally Render Login or Logout Button for Mobile */}
                            {authToken ? (
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center text-yellow-300 hover:text-yellow-500 transition-all duration-300 text-lg px-6 py-2 cursor-pointer"
                                >
                                    <FaArrowRight className="text-xl mr-2" /> Logout
                                </button>
                            ) : (
                                <Link
                                    to="/auth"
                                    className="flex items-center text-yellow-300 hover:text-yellow-500 transition-all duration-300 text-lg px-6 py-2"
                                >
                                    <FaArrowRight className="text-xl mr-2" /> Login
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

/* ✅ Reusable Nav Item Component */
const NavItem = ({ to, icon, label, closeMenu }) => (
    <Link
        to={to}
        onClick={closeMenu}
        className="flex items-center text-yellow-300 hover:text-yellow-500 transition-all duration-300 text-lg px-6 py-2"
    >
        <span className="text-xl mr-2">{icon}</span> {label}
    </Link>
);

/* ✅ Dropdown Nav Item Component */
const DropdownItem = ({ icon, label, isActive, toggleDropdown, subItems, mobile }) => (
    <div className="relative">
        {/* Dropdown Button */}
        <button
            onClick={toggleDropdown}
            className="flex items-center justify-between w-full text-yellow-300 hover:text-yellow-500 transition-all duration-300 text-lg px-6 py-2"
        >
            <div className="flex items-center">
                <span className="text-xl mr-2">{icon}</span> {label}
            </div>
            <span>{isActive ? "▲" : "▼"}</span>
        </button>

        {/* Dropdown Menu (Absolute for Desktop, Inline for Mobile) */}
        <AnimatePresence>
            {isActive && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`${mobile ? "ml-6 space-y-2" : "absolute left-0 mt-2 bg-black/90 border border-yellow-500/40 rounded-lg shadow-lg z-50"}`}
                    style={{ width: mobile ? 'auto' : 'max-content' }} // Add this line
                >
                    {subItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.to}
                            className="flex items-center text-yellow-400 hover:text-yellow-500 transition-all duration-300 text-lg px-4 py-2"
                        >
                            <span className="mr-2">{item.icon}</span> {item.label}
                        </Link>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);


export default Navbar;
