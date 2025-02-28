import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const SnakeCursor = () => {
  const numSegments = 70;
  const segmentSize = 16;
  const dampening = 0.25;
  const hitBoost = 1.6;

  const [isMobile, setIsMobile] = useState(false);
  const [segments, setSegments] = useState(
    Array.from({ length: numSegments }, () => ({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    }))
  );

  const [isHit, setIsHit] = useState(false);
  const mousePos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const hitEffect = useRef(null);

  useEffect(() => {
    // Check if the device is mobile
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768); // Adjust breakpoint if needed
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  useEffect(() => {
    if (isMobile) return; // Don't run animations on mobile

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleClick = (e) => {
      setIsHit(true);
      hitEffect.current = { x: e.clientX, y: e.clientY };

      gsap.to(mousePos.current, {
        x: e.clientX + (Math.random() * 100 - 50),
        y: e.clientY - Math.random() * 100,
        duration: 0.2,
        ease: "power2.out",
        onComplete: () => setIsHit(false),
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    const animate = () => {
      setSegments((prevSegments) => {
        const newSegments = [...prevSegments];
        const boostFactor = isHit ? hitBoost : dampening;
        
        // Ensure the first segment follows the mouse smoothly
        newSegments[0].x += (mousePos.current.x - newSegments[0].x) * boostFactor;
        newSegments[0].y += (mousePos.current.y - newSegments[0].y) * boostFactor;
    
        // Keep segments evenly spaced
        for (let i = 1; i < numSegments; i++) {
          const dx = newSegments[i - 1].x - newSegments[i].x;
          const dy = newSegments[i - 1].y - newSegments[i].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
    
          // Maintain spacing between segments
          if (distance > segmentSize * 0.8) { // Prevent shrinking too much
            newSegments[i].x += dx * dampening;
            newSegments[i].y += dy * dampening;
          }
        }
    
        return newSegments;
      });
    
      requestAnimationFrame(animate);
    };
    

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    };
  }, [isHit, isMobile]);

  if (isMobile) return null; // Hide cursor on mobile

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {segments.map((segment, index) => {
        const scale = 1 - index / numSegments;
        const shadowIntensity = 1 - index / numSegments;
        return (
          <div
            key={index}
            className="absolute rounded-full"
            style={{
              width: `${segmentSize * scale}px`,
              height: `${segmentSize * scale}px`,
              left: segment.x - (segmentSize * scale) / 2,
              top: segment.y - (segmentSize * scale) / 2,
              background: `radial-gradient(circle, rgba(255,0,0,1) 30%, rgba(180,0,0,1) 90%)`,
              boxShadow: isHit
                ? `0 0 20px rgba(255, 255, 0, 1), 0 0 40px rgba(255, 255, 0, 0.8)`
                : `0 0 ${10 * shadowIntensity}px rgba(255, 0, 0, 0.8), 0 0 ${
                    20 * shadowIntensity
                  }px rgba(255, 0, 0, 0.6)`,
              opacity: scale,
              border: "1px solid white",
              transform: isHit ? `rotate(${Math.random() * 20 - 10}deg)` : "none",
              transition: "transform 0.1s ease-out",
            }}
          ></div>
        );
      })}
    </div>
  );
};

export default SnakeCursor;
