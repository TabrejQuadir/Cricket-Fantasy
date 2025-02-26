import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { gsap } from "gsap";
import LoadingScreen from "./components/LoadingScreen";
import Nav from "./components/Nav";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import AboutPage from "./pages/AboutPage";
import Auth from "./pages/Auth";
import FloatingSocialButton from "./components/FloatingSocialButton ";
import OrderHistory from "./pages/OrderHistory";
import InvestInTeam from "./pages/InvestInTeam";
import DepositPage from "./pages/DepositPage";
import DepositHistory from "./pages/DepositHistory";
import WithDrawPage from "./pages/WithDrawPage";
import AddBankAccount from "./pages/AddBankAccount";
import WithdrawHistory from "./pages/WithdrawHistory";
import SnakeCursor from "./components/SnakeCursor";

export default function App() {
    const [loadingComplete, setLoadingComplete] = useState(false);

    useEffect(() => {
        if (loadingComplete) {
            gsap.to(".loading-screen", {
                opacity: 0,
                duration: 1,
                ease: "power2.out",
                onComplete: () => {
                    document.querySelector(".loading-screen").style.display = "none";
                },
            });
        }
    }, [loadingComplete]);

    return (
        <Router>
            {/* ✅ Show loading screen first */}
            {!loadingComplete ? (
                <LoadingScreen onComplete={() => setLoadingComplete(true)} />
            ) : (
                <>
                    {/* ✅ Show Navbar only after loading completes */}
                    <SnakeCursor/>
                    <Nav navbarVisible={loadingComplete} />
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path={'/profile'} element={<ProfilePage/>}/>
                        <Route path={'/about'} element={<AboutPage/>}/>
                        <Route path={'/order-history'} element={<OrderHistory/>}/>
                        <Route path="*" element={<HomePage />} />
                        <Route path="/create-team/:matchId" element={<InvestInTeam/>}/>
                        <Route path="/deposit" element={<DepositPage/>  }/>
                        <Route path="deposit-history" element={<DepositHistory/>}/>
                        <Route path="/withdraw" element={<WithDrawPage/>}/>
                        <Route path="/add-bank-account" element={<AddBankAccount/>}/>
                        <Route path="/withdraw-history" element={<WithdrawHistory/>}/>
                    </Routes>
                    <FloatingSocialButton/>
                </>
            )}
        </Router>
    );
}
