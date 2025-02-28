import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import image1 from "../assets/Banner1.jpg";
import image2 from "../assets/Banner2.jpg";
import ShopCategory from "../components/SportCategory";
import Section3 from "../components/Section3";
import WhyChooseUs from "../components/WhyChooseUs";
import InvestmentPlans from "../components/InvestmentPlans";
import LimitedTimeOffer from "../components/LimitedTimeOffer ";
import InvestmentProcess from "../components/InvestmentProcess";

export default function HomePage() {
    const bannerRef = useRef(null);
    const images = [image1, image2];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });

            tl.to(bannerRef.current, {
                opacity: 0,
                duration: 1.5,
                ease: "power2.inOut",
                onComplete: () => {
                    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
                },
            })
                .to(bannerRef.current, {
                    opacity: 1,
                    duration: 1.5,
                    ease: "power2.inOut",
                });
        });

        return () => ctx.revert();
    }, []);

    return (
        <div className="relative min-h-screen md:mt-20 mt-16">
            <div className="container mx-auto px-4 py-6">
                {/* Win Banner */}
                <div className="backdrop-blur-lg bg-gradient-to-r from-black/40 to-black/20 border border-[#FDC700]/50 shadow-lg shadow-[#FDC700]/50 rounded-lg p-2 md:p-4 mb-6 md:mb-8">
                    <img
                        ref={bannerRef}
                        src={images[currentIndex]}
                        className="w-full h-[180px] md:h-[300px] lg:h-[350px] object-cover transition-opacity duration-1000 ease-in-out"
                        alt="Banner"
                    />
                </div>


                {/* Sport Categories */}
                <ShopCategory />

                <InvestmentPlans />
                <InvestmentProcess />
            
                <Section3 />

                <WhyChooseUs />
                <LimitedTimeOffer />
            </div>
        </div>
    );
}
