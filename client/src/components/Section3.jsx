import React from 'react'
import MatchCard from './MatchCard'
import WithdrawalTicker from './WithdrawalTicker';
import { useAuth } from "../context/AuthContext";

const Section3 = () => {
  const { user } = useAuth(); // ✅ Access user from context

  return (
    <>
           <div className="mb-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-[#FDC700] to-red-500">
          Upcoming Matches {user?.firstTimeFreeInvestment && (
            <span className="text-lg sm:text-xl block text-green-400 font-semibold mt-2">
              🎉 Welcome First-Time Investor!
            </span>
          )}
        </h2>
      </div>

      
      <div className="w-full flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-10 mx-auto px-4 py-6">

        {/* Match Card Section */}
        <div className="w-full lg:w-1/2">
          <MatchCard />
        </div>

        {/* Withdrawal Ticker Section */}
        <div className="w-full lg:w-1/2">
          <WithdrawalTicker />
        </div>
      </div>
    </>
  )
}

export default Section3