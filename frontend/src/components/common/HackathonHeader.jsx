import React from "react";
import { Link } from "react-router-dom";
import dawoodTechLogo from "../../assets/dawoodtech-logo.png";

const HackathonHeader = () => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/hackathons" className="flex items-center gap-2 group">
          <img src={dawoodTechLogo} alt="DawoodTech" className="h-8 w-auto object-contain" />
        </Link>
        <Link
          to="/hackathons"
          className="text-sm font-mono font-semibold text-slate-400 hover:text-blue-400 transition-colors"
        >
          All Hackathons
        </Link>
      </div>
    </header>
  );
};

export default HackathonHeader;
