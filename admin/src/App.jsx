import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar"; // ✅ Import Navbar
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import AddTournament from "./pages/AddBalance";
import AddMatch from "./pages/AddMatch";
import AllMatches from "./pages/AllMatches";
import InvestmentPlanVerify from "./pages/InvestmentPlanVerify";
import TeamPurchaseVerify from "./pages/TeamPurchaseVerify";
import AdminAuth from "./pages/AdminAuth";
import UploadQr from "./pages/UploadQr";
import SingleUserMatchInvestmentHistory from "./pages/SingleUserMatchInvestmentHistory";
import BalancePaymentVerify from "./pages/BalancePaymentVerify";
import AddBalance from "./pages/AddBalance";
import WithDrawBalance from "./pages/WithDrawBalance";
import AdminMultiplier from "./pages/AdminMultiplier";
import AdminMatchInvestments from "./pages/AdminMatchInvestments";
import UpdateVipLevel from "./pages/UpdateVipLevel";

const App = () => {
    return (
        <Router>
            {/* ✅ Navbar at the top */}
            <Navbar />

            {/* ✅ Main Content Area */}
            <div className="min-h-screen bg-black pt-20 px-6">
                <Routes>
                    {/* 🔓 Public Route (Admin Login Page) */}
                    <Route path="/auth" element={<AdminAuth />} />

                    {/* 🔐 Protected Routes (Only accessible after login) */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="*" element={<Dashboard />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/add-tournament" element={<AddTournament />} />
                        <Route path="/add-match" element={<AddMatch />} />
                        <Route path="/all-matches" element={<AllMatches />} />
                        <Route path="/upload-qr" element={<UploadQr />} />
                        <Route path="/investment-plan-verification" element={<InvestmentPlanVerify />} />
                        <Route path="/update-vip-level" element={<UpdateVipLevel />} />
                        <Route path="/team-purchase-verification" element={<TeamPurchaseVerify />} />
                        <Route path="/match-investment-history" element={<SingleUserMatchInvestmentHistory />} />
                        <Route path="/deposit-verification" element={<BalancePaymentVerify />} />
                        <Route path="/add-balance" element={<AddBalance />} />
                        <Route path="/withdraw-balance" element={<WithDrawBalance />} />
                        <Route path="/match-result" element={<AdminMultiplier />} />
                        <Route path="/admin/match-investments" element={<AdminMatchInvestments />} />
                    </Route>
                </Routes>
            </div>
        </Router>
    );
};

export default App;
