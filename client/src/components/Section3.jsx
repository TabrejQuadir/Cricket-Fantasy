import React from 'react'
import MatchCard from './MatchCard'
import WithdrawalTicker from './WithdrawalTicker';

const Section3 = () => {
  return (
    <div className="w-full flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-10 mx-auto px-4 py-6">
    {/* Match Card Section */}
    <div className="w-full lg:w-1/2">
        <MatchCard  />
    </div>

    {/* Withdrawal Ticker Section */}
    <div className="w-full lg:w-1/2">
        <WithdrawalTicker />
    </div>
</div>

  )
}

export default Section3