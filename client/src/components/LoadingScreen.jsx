import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { gsap } from "gsap";

function LoadingScreen({ onComplete }) {
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        let count = 0;
        const interval = setInterval(() => {
            count += 1;
            setCounter(count);
            if (count >= 100) {
                clearInterval(interval);
                revealAnimation();
            }
        }, 20); // ✅ Increase delay to slow down loading (30ms per step)

        return () => clearInterval(interval);
    }, []);

    const revealAnimation = () => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: onComplete, // ✅ Trigger loading complete in `App.js`
            });

            tl.to(".follow", { width: "100%", ease: "power4.out", duration: 0.3 })
                .to(".hide", { opacity: 0, duration: 0.2 }, "-=0.3")
                .to(".hide", { visibility: "hidden", duration: 0.01 })
                .to(".follow", { opacity: 0.5, duration: 0.1 })
                .to(".follow", { height: "100%", ease: "power4.out", duration: 0.3 })
                .to(".follow", { opacity: 0, duration: 0.1 });

            return () => ctx.revert();
        });
    };

    return (
        <AppContainer>
            <Loading className="loading">
                <Follow className="follow" style={{ width: `${counter}%` }}></Follow>
                <ProgressBar className="hide" style={{ width: `${counter}%` }}></ProgressBar>
                <Count className="hide">{counter}%</Count>
            </Loading>
        </AppContainer>
    );
}

export default LoadingScreen;

const AppContainer = styled.div`
    width: 100vw;
    min-height: 100vh;
    color: #000000;
    position: relative;
    overflow: auto;
`;

const Loading = styled.div`
    height: 100%;
    width: 100%;
    background-color: #000000;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    transition: visibility 0.5s ease-in-out;
`;

const Follow = styled.div`
    position: absolute;
    background-color: #FDC700;
    height: 2px;
    width: 0;
    left: 0;
    z-index: 2;
`;

const ProgressBar = styled.div`
    position: absolute;
    left: 0;
    background: linear-gradient(to right, #ff7f50, #ffba00, #ff7f50);
    height: 4px;
    width: 0;
    box-shadow: 0px 0px 10px rgba(255, 165, 0, 0.6);
    transition: width 0.3s ease-out;
`;

const Count = styled.p`
    position: absolute;
    font-size: 120px;
    color: goldenrod;
    transform: translateY(-15px);
    font-weight: 600;
    animation: fadeIn 0.8s ease-in-out, pulse 1.2s infinite alternate;

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @keyframes pulse {
        from { transform: scale(1); }
        to { transform: scale(1.05); }
    }
`;
