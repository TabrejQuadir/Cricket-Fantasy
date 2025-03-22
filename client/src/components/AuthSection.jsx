import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthSection = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return null;

  return (
    <div className="flex w-full my-2 mb-4 rounded overflow-hidden border border-[#FDC700] animate-shine">
      <Link
        to="/auth"
        className="w-1/2 py-3 text-sm font-medium text-white bg-transparent backdrop-blur-xl border border-white/30 hover:border-white/60 hover:bg-white/10 transition-all duration-300 flex items-center justify-center uppercase tracking-wide"
      >
        Sign Up
      </Link>
      <Link
        to="/auth"
        className="w-1/2 py-3 text-sm font-medium text-white bg-transparent backdrop-blur-xl border border-white/30 hover:border-red-600/60 hover:bg-white/10 transition-all duration-300 flex items-center justify-center uppercase tracking-wide"
      >
        Log In
      </Link>
    </div>
  );
};

export default AuthSection;