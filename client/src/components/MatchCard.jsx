import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function MatchCard() {
  const [matches, setMatches] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const matchCardRef = useRef(null);
  const navigate = useNavigate(); // ✅ For navigation
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  useEffect(() => {
    let timeoutId;
    if (showModal) {
      timeoutId = setTimeout(() => {
        setShowModal(false); // Hide the modal after 3 seconds
        navigate("/auth");    // Navigate to /auth after 3 seconds
      }, 3000);
    }

    // Cleanup function to clear timeout
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [showModal, navigate]); // Add `navigate` to the dependency array

  useEffect(() => {
    // Fetching upcoming matches from API
    const fetchMatches = async () => {
      try {
        const response = await axios.get("https://backend.prepaidtaskskill.in/api/matches/upcoming-matches", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Add token to the request header
          },
        });

        // Filter only the upcoming matches
        const upcomingMatches = response.data.filter(match => match.status === "Upcoming");
        setMatches(upcomingMatches); // Set only upcoming matches
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
    };

    fetchMatches();
  }, []); // Fetch matches when component mounts

  const changeMatch = (direction) => {
    gsap.to(matchCardRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: "power2.out",
      onComplete: () => {
        setCurrentMatchIndex((prevIndex) => {
          if (direction === "next") {
            return (prevIndex + 1) % matches.length;
          } else {
            return prevIndex === 0 ? matches.length - 1 : prevIndex - 1;
          }
        });
        gsap.to(matchCardRef.current, {
          opacity: 1,
          duration: 0,
          ease: "power2.in",
        });
      },
    });
  };

  const handleCreateTeam = (matchId) => {
    if (!user) {
      handleOpenModal();
      return;
    }

    if (user.investmentPlan && user.investmentPlan.status === "Active") {
      navigate(`/create-team/${matchId}`);
    } else {
      alert("❌ You need to have an active investment plan to invest.");
    }
  };


  const match = matches[currentMatchIndex]; // Get the current match based on the index

  return (
    <div className="flex flex-col md:flex-row items-center space-x-4 md:space-x-0 md:space-y-4 md:items-start">
      {/* Match Card (Center) */}
      <div ref={matchCardRef} className="relative w-full md:w-[95%] backdrop-blur-xl bg-black/40 border border-[#FDC700]/40 rounded-xl overflow-hidden shadow-lg transition-all duration-300 transform group p-5">
        {/* Curved header */}
        <div className="absolute top-0 right-0 w-48 h-16 bg-gradient-to-l from-pink-500/40 to-transparent rounded-bl-full" />

        {/* Animated Border */}
        <div className="absolute inset-0 w-full h-full border-1 border-transparent rounded-xl group-hover:border-[#FDC700] transition-all duration-1000 group-hover:shadow-[0_0_20px_#FDC700]"></div>

        {/* Match Details */}
        <div className="relative z-10 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-[#FDC700] ">{match?.category}</span>
              <span className="text-xs text-gray-400">{match?.points}100 pts</span>
            </div>

            {/* Display match time and formatted date */}
            <span className="text-sm font-semibold text-[#FDC700]  group-hover:text-[#FDC800] transition-all duration-300">
              {match?.matchTime} {/* Time: 10:30 AM */}
              {/* <br /> */}
              {new Date(match?.matchDate).toLocaleDateString()}
            </span>
          </div>

          {/* Teams & Logos (First letter of team names) */}
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center bg-white p-2 shadow-lg text-2xl font-bold text-gray-800"
              >
                {match?.team1?.charAt(0).toUpperCase()} {/* Show the first letter of team1 */}
              </div>
              <div className="font-bold text-white text-lg">{match?.team1}</div>
            </div>

            <div className="text-center text-[#FDC700] px-6 font-bold text-lg relative">
              <span className="block transform scale-110 group-hover:scale-125 transition-all duration-300 border border-[white] rounded-full p-2">
                VS
              </span>
            </div>

            <div className="text-center flex-1">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center bg-white p-2 shadow-lg text-2xl font-bold text-gray-800"
              >
                {match?.team2?.charAt(0).toUpperCase()} {/* Show the first letter of team2 */}
              </div>
              <div className="font-bold text-white text-lg">{match?.team2}</div>
            </div>
          </div>

          {/* Price Per Team */}
          <div className="text-center text-sm text-gray-400 mt-4 mb-4">
            Price Per Team:
            <span className="text-[#FDC700] font-bold ml-1">
              {user?.firstTimeFreeInvestment ? "FREE" : `₹${(match?.pricePerTeam / 2).toFixed(2)}`}
            </span>
          </div>


          <div className="text-center text-sm text-gray-400 mt-4 mb-4">
            Winning Probability
            <span className="text-[#FDC700] font-bold">
              {match?.minWinning ? `${match.minWinning}x` : "N/A"} - {match?.maxWinning ? `${match.maxWinning}x` : "N/A"}
            </span>
          </div>


          {/* ✅ Create Team Button with Check */}
          <button
            onClick={() => handleCreateTeam(match._id)}
            className="block w-full p-3 text-center rounded-lg bg-gradient-to-r from-[#FDC700] to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
          >
            Create Team 🚀
          </button>
        </div>

        {/* Previous Button */}
        <button
          onClick={() => changeMatch("prev")}
          className="absolute left-0 top-1/2 z-20 p-3 bg-gray-800 text-white rounded-lg hover:bg-[#FDC700] hover:text-black transition-all duration-100 shadow-md cursor-pointer"
        >
          <FaAngleLeft />
        </button>

        {/* Next Button */}
        <button
          onClick={() => changeMatch("next")}
          className="absolute right-0 top-1/2 z-20 transform p-3 bg-gray-800 text-white rounded-lg hover:bg-[#FDC700] hover:text-black transition-all duration-100 shadow-md cursor-pointer"
        >
          <FaAngleRight />
        </button>
      </div>

      {/* Glassmorphic Notification */}
      {showModal && (
        <div className="fixed inset-x-0 top-20 z-50 flex justify-center animate-bounce">
          <div className="p-4 bg-black/30 backdrop-blur-lg border border-[#FDC700]/50 rounded-xl shadow-lg shadow-[#FDC700]/30 w-[450px] text-center text-white 
        transition-all duration-300 ease-in-out transform hover:scale-105">
            <p className="text-lg font-semibold flex items-center justify-center">
              <span className="mr-2">🚀</span> Please Login To Invest in Upcoming Matches
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

