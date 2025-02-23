import React, { useState, useRef } from "react";
import { Link } from "react-router-dom"; // Assuming you're using React Router for navigation
import { motion } from "framer-motion";

const Navbar = ({ navbarVisible }) => {
    const [isOpen, setIsOpen] = useState(false); // State for mobile menu
    const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown menu
    const navbarRef = useRef(null); // Ref for the navbar

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const logoVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
    };

    const linkVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.nav
            ref={navbarRef}
            className="bg-white border bg-opacity-30 backdrop-blur-md shadow-lg fixed w-[80%] left-1/2 top-5 transform -translate-x-1/2 z-10 rounded-full"
            initial={{ opacity: 0, y: -20 }}
            animate={navbarVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto px-10 py-4 flex justify-between items-center">
                <div className="flex items-center">
                    <motion.img
                        src="https://png.pngtree.com/png-vector/20241217/ourmid/pngtree-cricket-bat-and-ball-placed-with-a-winning-trophy-png-image_14749018.png"
                        className="size-24 absolute -left-24"
                        alt=""
                        initial="hidden"
                        animate="visible"
                        variants={logoVariants}
                        transition={{ duration: 0.5 }}
                    />

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={linkVariants}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Link to="/" className="text-3xl font-extrabold text-blue-600 drop-shadow-md animate-pulse font-sans">
                            Khelo India
                        </Link>
                    </motion.div>
                </div>
                <div className="hidden md:flex space-x-8">
                    {["Home", "Matches"].map((link, index) => (
                        <motion.div
                            key={link}
                            initial="hidden"
                            animate={navbarVisible ? "visible" : "hidden"}
                            variants={linkVariants}
                            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }} // Staggered delay
                        >
                            <Link to={`/${link.toLowerCase()}`} className="text-gray-800 hover:text-blue-600 transition duration-300">
                                {link}
                            </Link>
                        </motion.div>
                    ))}
                    <div className="relative">
                        <button onClick={toggleDropdown} className="text-gray-800 hover:text-blue-600 transition duration-300">
                            More
                        </button>
                        {dropdownOpen && (
                            <ul className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
                                {["About", "Contact"].map((link) => (
                                    <li key={link}>
                                        <Link to={`/${link.toLowerCase()}`} className="block px-4 py-2 text-gray-800 hover:bg-blue-100">
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800 focus:outline-none">
                        {isOpen ? 'Close' : 'Menu'}
                    </button>
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden bg-white shadow-md">
                    <div className="flex flex-col space-y-2 px-4 py-2">
                        {["Home", "Matches", "About", "Contact"].map((link, index) => (
                            <motion.div
                                key={link}
                                initial="hidden"
                                animate="visible"
                                variants={linkVariants}
                                transition={{ duration: 0.5, delay: 0.1 }}
                            >
                                <Link to={`/${link.toLowerCase()}`} className="text-gray-800 hover:text-blue-600 transition duration-300">
                                    {link}
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </motion.nav>
    );
};

export default Navbar;