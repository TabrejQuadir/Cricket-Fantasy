import { motion, useMotionValue, useTransform } from "framer-motion";
import { Trophy, Zap, Target } from "lucide-react";
import { useState } from "react";

const cards = [
  {
    icon: <Target size={50} className="text-gold drop-shadow-lg" />,
    title: "Guaranteed Profits",
    description: "Our expert strategies maximize your earnings!",
  },
  {
    icon: <Zap size={50} className="text-green-400 drop-shadow-lg" />,
    title: "Fast Withdrawals",
    description: "Withdraw your profits instantly!",
  },
  {
    icon: <Trophy size={50} className="text-purple-500 drop-shadow-lg" />,
    title: "VIP Access",
    description: "Exclusive club for ₹50,000+ investors!",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 text-white text-center relative">
      <motion.h2
        className="text-5xl font-extrabold mb-12 text-[#FDC700] tracking-widest drop-shadow-xl"
        initial={{ x: 0, scale: 0.95 }}
        whileInView={{ x: 0, scale: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
      >
        Why Choose Us?
      </motion.h2>
      <div className="flex flex-wrap justify-center gap-8">
        {cards.map((card, index) => (
          <GlowingCard key={index} card={card} />
        ))}
      </div>
    </section>
  );
}

// ✅ Glowing Card Component
function GlowingCard({ card }) {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const xPos = e.clientX - left;
    const yPos = e.clientY - top;

    x.set(xPos - width / 2);
    y.set(yPos - height / 2);
  };

  const glowX = useTransform(x, [-100, 100], ["-40%", "40%"]);
  const glowY = useTransform(y, [-100, 100], ["-40%", "40%"]);

  return (
    <motion.div
      className="relative p-8 bg-glass shadow-2xl border border-[#FDC700]/20 backdrop-blur-md transition-all duration-300 hover:shadow-gold/50 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dynamic Glow Effect */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 w-full h-full bg-gradient-to-r from-yellow-400 via-transparent to-yellow-400 opacity-50 blur-2xl pointer-events-none"
          style={{
            left: glowX,
            top: glowY,
            width: "200%",
            height: "200%",
          }}
        />
      )}

      <div className="relative z-10">
        <div className="mb-6 flex justify-center">{card.icon}</div>
        <h3 className="text-2xl font-bold text-white mb-3 tracking-wide drop-shadow-md">
          {card.title}
        </h3>
        <p className="text-lg text-[#FDC700] leading-relaxed">{card.description}</p>
      </div>
    </motion.div>
  );
}
