import React, { useEffect, useState } from 'react';
import { FaDollarSign, FaStar, FaRocket } from 'react-icons/fa'; // Import icons
import { useAuth } from '../context/AuthContext'; // Import the custom hook
import './InvestmentPlans.css';
import PurchaseModal from './PurchaseModal'; // Import the modal component

const plans = [
  {
    name: 'Basic',
    price: 499,
    duration: 1, // 1 month validity
    roi: '🔹30 days Plan',
    icon: <FaDollarSign />,
    badge: 'Starter',
  },
  {
    name: 'Premium',
    price: 999,
    duration: 3, // 3 months validity
    roi: '🔥 3 Months + VIP Support',
    icon: <FaStar />,
    badge: 'Best Plan',
  },
  {
    name: 'Elite',
    price: 1499,
    duration: 6, // 6 months validity
    roi: '🚀 6 Months + Private Group',
    icon: <FaRocket />,
    badge: 'VIP',
  },
];

const InvestmentPlans = () => {
  const { isAuthenticated, user, loading, setUser } = useAuth(); // Using context to get auth status and user data
  const [activePlan, setActivePlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [selectedPlan, setSelectedPlan] = useState(null); // Store the selected plan

  useEffect(() => {
    if (user?.investmentPlan?.status === 'Active' || user?.investmentPlan?.status === 'Pending') {
      setActivePlan(user.investmentPlan); // Set active or pending plan
    } else {
      setActivePlan(null); // Clear activePlan if no plan
    }
  }, [user]);

  const handlePurchase = (plan) => {
    // Check if the user is authenticated
    if (!isAuthenticated) {
      alert("You need to log in first to purchase a plan.");
      return;
    }

    // Prevent opening modal if the user already has an active plan
    if (activePlan?.status === 'Active') {
      alert("You already have an active plan.");
      return;
    }

    setSelectedPlan(plan); // Set the selected plan
    setIsModalOpen(true); // Open the modal to show payment screenshot or plan details
  };

  const handleConfirmPurchase = (plan) => {
    const purchaseDate = new Date();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + plan.duration); // Set expiry based on plan duration

    const userPlan = {
      name: plan.name,
      price: plan.price,
      purchaseDate: purchaseDate.toISOString(),
      expiryDate: expiryDate.toISOString(),
      status: 'Pending', // Set status to "Pending" initially
    };

    // Update the user's data with the purchased plan
    const updatedUser = { ...user, investmentPlan: userPlan };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser)); // Save to localStorage
    setUser(updatedUser); // Update context

    setActivePlan(userPlan); // Set the new plan
    setIsModalOpen(false); // Close the modal
    alert(`You have purchased the ${plan.name} plan. Waiting for admin approval.`);
  };

  return (
    <div className="investment-plans">
      <h2 className="text-center text-4xl font-bold mb-8 text-black">Investment Plans</h2>

      {/* Active Plan or Pending Plan Section */}
      {activePlan ? (
        <div className="active-plan text-center p-4 rounded-lg shadow-md mb-6 bg-yellow-500 text-black font-semibold">
          {activePlan.status === "Active"
            ? `You have an active ${activePlan.planName} plan until ${new Date(activePlan.expiryDate).toDateString()}.`
            : `You have a pending ${activePlan.planName} plan. Waiting for admin approval.`}
        </div>
      ) : (
        <p className="text-center text-gray-600 mb-6">
          {isAuthenticated ? "No active plan. Choose a plan to start investing." : "Please log in to purchase a plan."}
        </p>
      )}

      <div className="plans-container">
        {plans.map((plan, index) => {
          const isActive = activePlan && activePlan.planName === plan.name && activePlan.status === 'Active';
          const isPending = activePlan && activePlan.planName === plan.name && activePlan.status === 'Pending';

          return (
            <div key={index} className={`plan-card ${index === 1 ? 'best-value' : ''}`}>
              {/* Badge for Plans */}
              <div className={`plan-badge ${plan.badge.toLowerCase().replace(" ", "-")}`}>
                {plan.badge}
              </div>

              <div className="plan-header">
                <h3 className="plan-name">{plan.icon} {plan.name}</h3>
              </div>
              <div className="plan-details">
                <p className="plan-price">₹{plan.price}</p>
                <p className="plan-roi">{plan.roi}</p>
                <p className="plan-duration"> {plan.duration} Month(s) Validity</p>
              </div>
              <div className="plan-footer">
                {isActive ? (
                  <button className="cta-button active">Active Plan</button>
                ) : isPending ? (
                  <button className="cta-button" onClick={() => handlePurchase(plan)}>
                    Pending Plan
                  </button>
                ) : (
                  <button className="cta-button" onClick={() => handlePurchase(plan)}>
                    Join Now
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Component */}
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

export default InvestmentPlans;

