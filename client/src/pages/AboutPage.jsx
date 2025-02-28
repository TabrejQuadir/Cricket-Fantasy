import { motion } from "framer-motion";
import { FaPlusCircle, FaMinusCircle, FaQuestionCircle } from "react-icons/fa";
import { useState } from "react";

export default function AboutPage() {

    const testimonials = [
        { name: "Rahul", review: "SureWin11 makes cricket investments effortless! My returns have exceeded expectations!" },
        { name: "Amit", review: "The expert team ensures smooth investments. Reliable support and a trustworthy platform!" },
        { name: "Sneha", review: "I never imagined earning so much from cricket investments. SureWin11 is a game-changer!" },
        { name: "Vikram", review: "Joining the VIP Club was the best decision! Exclusive insights and high returns make it worth it." },
        { name: "Pooja", review: "Fastest withdrawals ever! My profits were credited within hours. 100% trustworthy!" },
        { name: "Ankit", review: "SureWin11’s expert strategies handle everything for me. Best passive income source!" },
        { name: "Divya", review: "Exceptional customer support! The team genuinely cares about investor success and satisfaction." },
        { name: "Suraj", review: "At first, I was skeptical, but now I earn consistently with zero stress!" },
        { name: "Meera", review: "Transparency is key, and SureWin11 delivers! I always have full visibility of my funds." },
        { name: "Rohan", review: "Cricket investing has never been this easy and rewarding. SureWin11 is a must-try for everyone!" },
    ];


    const faqs = [
        {
            question: "How does SureWin11 work?",
            answer: "SureWin11 is an investment platform where our experts create winning fantasy cricket teams on your behalf. You invest in matches, and after the game, you receive returns based on the team's performance. Plus, your **first match investment is absolutely FREE!**"
        },
        {
            question: "Is my investment secure?",
            answer: "Absolutely! We ensure a fully transparent and secure process. Our expert team carefully manages your investment, and all transactions are safeguarded for your peace of mind."
        },
        {
            question: "How can I withdraw my earnings?",
            answer: "Withdrawing your earnings is quick and hassle-free! Simply place a withdrawal request, and your funds will be transferred to your bank account or UPI ID within 24 hours—no hidden fees!"
        },
        {
            question: "Do I need cricket knowledge to invest?",
            answer: "Not at all! Our professionals handle all the research and strategy, allowing you to earn without any prior cricket knowledge. Just invest and enjoy the returns!"
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept UPI, bank transfers, and all major payment gateways, ensuring seamless and secure transactions for deposits and withdrawals."
        }
    ];


    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };


    return (
        <div className="relative bg-gradient-to-br from-black via-gray-900 to-black text-white min-h-screen overflow-hidden">
            {/* Parallax Background Effect */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514214460829-5f081763862a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] opacity-30 blur-lg"></div>

            {/* Hero Section */}
            <section className="text-center pt-28 relative z-10">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 drop-shadow-xl"
                >
                    About Us
                </motion.h1>
                <p className="text-lg text-gray-300 mt-4 max-w-3xl mx-auto px-4">
                    At <span className="text-yellow-400 font-semibold">SureWin11</span>, we help cricket enthusiasts invest smartly while our experts create and manage teams on their behalf. With transparency, innovation, and expert-backed strategies, we ensure secure investments and guaranteed returns.
                </p>

            </section>

            {/* Our Story */}
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto text-center py-16 relative z-10"
            >
                <h2 className="text-4xl font-bold mb-6 text-yellow-400">Our Story</h2>
                <p className="text-lg text-gray-300">
                    Founded in **2023**, <span className="text-yellow-400 font-semibold">SureWin11</span> blends the thrill of cricket with smart financial investments. We’ve helped thousands of investors maximize their profits with our expert-driven strategies.
                </p>
            </motion.section>

            {/* Core Values - Animated Cards */}
            <section className="max-w-5xl mx-auto py-12">
                <h2 className="text-4xl font-bold text-center text-yellow-400 mb-12">Our Core Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {["Transparency", "Innovation", "Community", "Integrity"].map((value, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="p-8 bg-black/50 border border-yellow-500/60 backdrop-blur-md rounded-xl shadow-lg hover:shadow-yellow-600/40 transition-all transform hover:scale-105 text-center"
                        >
                            <h3 className="text-2xl font-bold text-yellow-300">{value}</h3>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Testimonials - Neon Cards */}
            <section className="max-w-6xl mx-auto py-12 overflow-hidden">
                <h2 className="text-4xl font-bold text-center text-yellow-400 mb-12">
                    What Our Investors Say
                </h2>

                {/* YoYo Scrolling Testimonials */}
                <div className="relative w-full overflow-hidden">
                    <motion.div
                        className="flex space-x-6 min-w-[600%]"
                        initial={{ x: "0%" }}
                        animate={{ x: "-50%" }}
                        transition={{
                            repeat: Infinity,
                            repeatType: "reverse",
                            duration: 15,
                            ease: "linear"
                        }}
                    >
                        {/* Duplicate testimonials to create a smooth loop */}
                        {[...testimonials, ...testimonials].map((testimonial, index) => (
                            <motion.div
                                key={index}
                                className="min-w-[300px] md:min-w-[350px] p-6 bg-black/50 border border-yellow-500/60 backdrop-blur-md rounded-xl shadow-lg hover:shadow-yellow-600/40 transition-all transform"
                            >
                                <p className="text-lg italic text-gray-300">"{testimonial.review}"</p>
                                <p className="text-yellow-400 font-semibold mt-4">- {testimonial.name}, Investor</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* FAQs */}
            <section className="max-w-5xl mx-auto py-12">
                <h2 className="text-4xl font-bold text-center text-yellow-400 mb-12">Frequently Asked Questions</h2>

                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.2, ease: "easeInOut" }}
                            className="p-6 bg-black/50 border border-yellow-500/60 backdrop-blur-md rounded-lg shadow-md cursor-pointer"
                        >
                            <summary
                                onClick={() => toggleFAQ(index)}
                                className="text-lg font-semibold text-yellow-300 flex items-center justify-between cursor-pointer hover:text-yellow-400 transition-all duration-300"
                            >
                                <span>{faq.question}</span>
                                {openIndex === index ? (
                                    <FaMinusCircle className="text-yellow-400 transition-all duration-300" />
                                ) : (
                                    <FaPlusCircle className="text-yellow-400 transition-all duration-300" />
                                )}
                            </summary>

                            <motion.p
                                initial={{ height: 0, opacity: 0 }}
                                animate={openIndex === index ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="text-gray-300 mt-3 overflow-hidden"
                            >
                                {faq.answer}
                            </motion.p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Contact Section */}
            <section className="max-w-4xl mx-auto py-12">
                <h2 className="text-4xl font-bold text-center text-[#FDC700]/50 mb-12">Get in Touch</h2>
                <form className="bg-black/50 border border-yellow-500/60 backdrop-blur-md p-6 rounded-xl shadow-lg max-w-lg mx-auto">
                    <input type="text" placeholder="Your Name" className="w-full p-3 mb-4 bg-transparent border border-yellow-500 rounded-md focus:outline-none text-white" />
                    <input type="email" placeholder="Your Email" className="w-full p-3 mb-4 bg-transparent border border-yellow-500 rounded-md focus:outline-none text-white" />
                    <textarea placeholder="Your Message" rows="4" className="w-full p-3 bg-transparent border border-yellow-500 rounded-md focus:outline-none text-white"></textarea>
                    <button className="w-full mt-6 py-3 text-lg font-semibold bg-gradient-to-r from-yellow-500 to-yellow-700 text-black rounded-lg shadow-lg hover:shadow-yellow-600 transition-all transform hover:scale-105">
                        Send Message
                    </button>
                </form>
            </section>
        </div>
    );
}
