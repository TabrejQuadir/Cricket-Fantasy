import React, { useEffect, useState } from "react";
import { FaDollarSign, FaStar, FaRocket } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import PurchaseModal from "./PurchaseModal";

const plans = [
  { name: "Basic", price: 499, duration: 1, roi: "🔹 30 days Plan", icon: <FaDollarSign />, badge: "Starter" },
  { name: "Premium", price: 999, duration: 3, roi: "🔥 3 Months + VIP Support", icon: <FaStar />, badge: "Best Plan" },
  { name: "Elite", price: 1499, duration: 6, roi: "🚀 6 Months + Private Group", icon: <FaRocket />, badge: "VIP" },
];

const InvestmentPlans2 = () => {
  const { isAuthenticated, user, setUser } = useAuth();
  const [activePlan, setActivePlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  console.log(user?.investmentPlan)

  useEffect(() => {
    if (user?.investmentPlan?.status === "Active" || user?.investmentPlan?.status === "Pending") {
      setActivePlan(user.investmentPlan);
    } else {
      setActivePlan(null);
    }
  }, [user]);

  const handlePurchase = (plan) => {
    if (!isAuthenticated) {
      alert("You need to log in first to purchase a plan.");
      return;
    }

    if (activePlan?.status === "Active") {
      alert("You already have an active plan.");
      return;
    }

    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleConfirmPurchase = (plan) => {
    const purchaseDate = new Date();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + plan.duration);

    const userPlan = {
      name: plan.name,
      price: plan.price,
      purchaseDate: purchaseDate.toISOString(),
      expiryDate: expiryDate.toISOString(),
      status: "Pending",
    };

    const updatedUser = { ...user, investmentPlan: userPlan };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setUser(updatedUser);

    setActivePlan(userPlan);
    setIsModalOpen(false);
    alert(`You have purchased the ${plan.name} plan. Waiting for admin approval.`);
  };

  return (
    <div className="investment-plans bg-gray-100 py-12 px-6">
      <h2 className="text-center text-4xl font-bold mb-8 text-gray-900">
        Monthly Subscription Plans
      </h2>

      {activePlan ? (
        <div className="bg-yellow-500 text-black font-semibold text-center p-4 rounded-lg shadow-md mb-6">
          {activePlan.status === "Active"
            ? `You have an active ${activePlan.planName} plan until ${new Date(activePlan.expiryDate).toDateString()}.`
            : `You have a pending ${activePlan.planName} plan. Waiting for admin approval.`}
        </div>
      ) : (
        <p className="text-center text-gray-600 mb-6">
          {isAuthenticated ? "No active plan. Choose a plan to start investing." : "Please log in to purchase a plan."}
        </p>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-center sm:space-x-4 lg:grid lg:grid-cols-3 gap-8">
        {plans.map((plan, index) => {
          const isActive = activePlan && activePlan.planName === plan.name && activePlan.status === "Active";
          const isPending = activePlan && activePlan.planName === plan.name && activePlan.status === "Pending";

          return (
            <div
              key={index}
              className={`relative bg-white shadow-lg rounded-xl p-4 sm:p-5 lg:p-6 transition-all transform hover:scale-105 ${index === 1 ? "border-2 border-yellow-500" : ""
                }`}
            >
              <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-2 sm:px-3 py-1 text-xs font-semibold rounded-full shadow-lg">
                {plan.badge}
              </div>

              <div className="flex items-center justify-center text-4xl sm:text-5xl text-gray-700 mb-3">
                {plan.icon}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-center text-gray-900">{plan.name}</h3>

              <div className="text-center text-gray-600 mt-2">
                <p className="text-lg sm:text-xl font-semibold text-gray-800">₹{plan.price}</p>
                <p className="text-xs sm:text-sm mt-1">{plan.roi}</p>
                <p className="text-xs sm:text-sm">⏳ {plan.duration} Month(s) Validity</p>
              </div>

              <div className="mt-4 flex justify-center">
                {isActive ? (
                  <button className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold shadow-md text-sm sm:text-base">
                    Active Plan
                  </button>
                ) : isPending ? (
                  <button className="w-full bg-gray-400 text-white py-2 rounded-lg font-semibold shadow-md text-sm sm:text-base">
                    Pending Plan
                  </button>
                ) : (
                  <button
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 rounded-lg font-semibold shadow-md hover:opacity-90 transition text-sm sm:text-base"
                    onClick={() => handlePurchase(plan)}
                  >
                    Join Now
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>


      <PurchaseModal
        user={user}
        setUser={setUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmPurchase}
        plan={selectedPlan}
      />
    </div>
  );
};

export default InvestmentPlans2;
