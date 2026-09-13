import React from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, AlertTriangle } from "lucide-react";
import HackathonHeader from "../components/common/HackathonHeader";
import HackathonRegistrationForm from "../components/hackathon/HackathonRegistrationForm";
import HackathonParticipantCounter from "../components/hackathon/HackathonParticipantCounter";
import TechBackground from "../components/hackathon/TechBackground";
import { useGetHackathonBySlugQuery } from "../api/apiSlice.js";

const HackathonRegister = () => {
  const { slug } = useParams();
  const { data: hackathon, isLoading, isError } = useGetHackathonBySlugQuery(slug);

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      <TechBackground />

      <div className="relative">
        <HackathonHeader />

        {isLoading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        )}

        {isError && (
          <div className="max-w-lg mx-auto text-center px-4 py-24">
            <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-white mb-2">Hackathon not found</h1>
            <p className="text-slate-400 mb-6">We couldn't find the hackathon you're looking for.</p>
            <Link to="/hackathons" className="text-blue-400 font-semibold hover:underline">
              View all hackathons
            </Link>
          </div>
        )}

        {hackathon && hackathon.status !== "open" && (
          <div className="max-w-lg mx-auto text-center px-4 py-24">
            <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-white mb-2">Registration Closed</h1>
            <p className="text-slate-400 mb-6">Registration for {hackathon.title} is not currently open.</p>
            <Link to="/hackathons" className="text-blue-400 font-semibold hover:underline">
              View all hackathons
            </Link>
          </div>
        )}

        {hackathon && hackathon.status === "open" && (
          <>
            <HackathonRegistrationForm hackathon={hackathon} />
            <div className="max-w-4xl mx-auto px-4 pb-12">
              <HackathonParticipantCounter hackathonId={hackathon.id} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HackathonRegister;
