import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaBars, FaTimes, FaHome, FaUsers, FaTrophy, FaMoneyBillWave, FaClipboardList,
    FaCog, FaPlus, FaList
} from "react-icons/fa";

const Sidebar = ({ isOpen, setIsOpen }) => {
    const [showLinks, setShowLinks] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const sidebarRef = useRef(null);

    // Close sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target) &&
                !event.target.closest(".dropdown-menu") // ✅ Ignore clicks inside dropdowns
            ) {
                setIsOpen(false);
                setShowLinks(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setIsOpen]);


    // Handle sidebar width animation before showing links
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setShowLinks(true), 300); // Delay showing links until width expands
        } else {
            setShowLinks(false);
        }
    }, [isOpen]);

    // Toggle dropdowns (auto-close previous)
    const toggleDropdown = (dropdownName) => {
        setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
    };

    return (
        <motion.div
            ref={sidebarRef}
            initial={{ width: 80 }}
            animate={{ width: isOpen ? 250 : 80 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed left-0 top-0 h-screen bg-black backdrop-blur-lg border-r border-yellow-500/40 shadow-2xl transition-all duration-300 z-50 flex flex-col"
        >
            {/* Sidebar Header */}
            <div className="relative flex items-center px-5 py-6">
                <img
                    src="https://png.pngtree.com/png-vector/20250125/ourmid/pngtree-a-3d-logo-design-of-professional-cricket-league-at-the-center-png-image_15336326.png"
                    alt="Admin Logo"
                    className="w-12 h-12 transition-all duration-300"
                />
                <button
                    className="bg-yellow-500 text-black p-2 rounded-full shadow-lg hover:bg-yellow-600 transition-all cursor-pointer ml-auto "
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* Navigation Links with Staggered Animation */}
            <motion.ul
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                    hidden: {},
                    visible: {
                        transition: { staggerChildren: 0.1, delayChildren: 0.8 }
                    }
                }}
                className="mt-5 space-y-3 flex flex-col"
            >
                <NavItem to="/dashboard" icon={<FaHome />} label="Dashboard" isOpen={isOpen} />
                <NavItem to="/users" icon={<FaUsers />} label="Manage Users" isOpen={isOpen} />


                <DropdownItem
                    icon={<FaTrophy />}
                    label="Matches"
                    isOpen={isOpen}
                    isActive={activeDropdown === "matches"}
                    toggleDropdown={() => toggleDropdown("matches")}
                    subItems={[
                        { to: "/add-match", icon: <FaPlus />, label: "Add Match" },
                        { to: "/all-matches", icon: <FaList />, label: "All Matches" },
                    ]}
                />

                <DropdownItem
                    icon={<FaClipboardList />}
                    label="Wallet Management"
                    isOpen={isOpen}
                    isActive={activeDropdown === "money management"}
                    toggleDropdown={() => toggleDropdown("money management")}
                    subItems={[
                        { to: "/add-balance", icon: <FaPlus />, label: "Add Balance" },
                        { to: "/withdraw-balance", icon: <FaPlus />, label: "Withdraw Balance" },
                    ]}
                />

                <DropdownItem
                    icon={<FaMoneyBillWave />}
                    label="Transactions"
                    isOpen={isOpen}
                    isActive={activeDropdown === "transactions"}
                    toggleDropdown={() => toggleDropdown("transactions")}
                    subItems={[
                        { to: "/investment-plan-verification", icon: <FaPlus />, label: "Investment Plan Verify" }, 
                        { to: "/match-investment-history", icon: <FaPlus />, label: "Match-investments" },
                        { to: "/deposit-verification", icon: <FaPlus />, label: "Deposit Verification" },
                    ]}
                />

                <NavItem to="/admin/settings" icon={<FaCog />} label="Settings" isOpen={isOpen} />
            </motion.ul>
        </motion.div>
    );
};

/* ✅ Reusable Nav Item Component */

const NavItem = ({ to, icon, label, isOpen }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <motion.li
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            className="group relative"
        >
            <Link
                to={to}
                className={`flex items-center px-5 py-3 rounded-lg transition-all duration-300
                    ${isActive ? "bg-yellow-600 text-white" : "text-yellow-300 hover:bg-yellow-600/20"}
                `}
            >
                <span className="text-xl">{icon}</span>
                {isOpen && <span className="ml-3 text-lg">{label}</span>}
            </Link>

            {/* Tooltip when Sidebar is Closed */}
            {!isOpen && (
                <span className="absolute left-16 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-yellow-500 text-black rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-all duration-300">
                    {label}
                </span>
            )}
        </motion.li>
    );
};


/* ✅ Dropdown Nav Item Component */

const DropdownItem = ({ icon, label, isOpen, isActive, toggleDropdown, subItems }) => {
    const location = useLocation();
    const isSubActive = subItems.some((item) => location.pathname === item.to);
    const showTooltip = !isOpen && !isActive; // ✅ Show tooltip only when sidebar is closed AND dropdown is NOT open

    return (
        <motion.li
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            className="relative"
        >
            {/* 🔹 Main Dropdown Button */}
            <button
                onClick={toggleDropdown}
                className={`flex items-center justify-between w-full px-5 py-3 rounded-lg transition-all duration-300
                    ${isSubActive ? "bg-yellow-600 text-white" : "text-yellow-300 hover:bg-yellow-600/20"}
                `}
            >
                <div className="flex items-center">
                    <span className="text-xl">{icon}</span>
                    {isOpen && <span className="ml-3 text-lg">{label}</span>}
                </div>
                {isOpen && <span className="ml-auto">{isActive || isSubActive ? "▲" : "▼"}</span>}
            </button>

            {/* 🔹 Tooltip for Dropdown Label (Only show when closed & not open) */}
            {showTooltip && (
                <span className="absolute left-16 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-yellow-500 text-black rounded-lg text-sm opacity-0 hover:opacity-100 transition-all duration-300">
                    {label}
                </span>
            )}

            {/* 🔹 Dropdown Menu */}
            <AnimatePresence>
                {(isActive || isSubActive) && (
                    <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="ml-6 space-y-2 dropdown-menu"
                    >
                        {subItems.map((item, index) => (
                            <li key={index} className="group relative">
                                <Link
                                    to={item.to}
                                    className={`flex items-center mt-2 px-4 py-2 rounded-lg transition-all duration-300
                                        ${location.pathname === item.to ? "bg-yellow-600 text-white" : "text-yellow-400 hover:bg-yellow-600/10"}
                                    `}
                                >
                                    <span className="mr-2">{item.icon}</span>
                                    {isOpen && <span>{item.label}</span>}
                                </Link>

                                {/* 🔹 Tooltip for Submenu Items (Show only when sidebar is closed) */}
                                {!isOpen && (
                                    <span className="absolute left-16 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-yellow-500 text-black rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        {item.label}
                                    </span>
                                )}
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </motion.li>
    );
};



export default Sidebar;
