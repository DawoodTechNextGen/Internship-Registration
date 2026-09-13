import React from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, ArrowRight, Globe2 } from "lucide-react";

const STATUS_STYLES = {
  open: "bg-green-500/10 text-green-400 border-green-500/30",
  upcoming: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  closed: "bg-slate-700/30 text-slate-400 border-slate-600/40",
  completed: "bg-slate-700/30 text-slate-300 border-slate-600/40",
  draft: "bg-slate-700/30 text-slate-400 border-slate-600/40",
};

const STATUS_LABELS = {
  open: "Registration Open",
  upcoming: "Upcoming",
  closed: "Registration Closed",
  completed: "Completed",
  draft: "Draft",
};

const STATUS_DOT = {
  open: "bg-green-400",
  upcoming: "bg-blue-400",
  closed: "bg-slate-500",
  completed: "bg-slate-400",
  draft: "bg-slate-500",
};

const formatDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
};

const HackathonCard = ({ hackathon }) => {
  const startDate = formatDate(hackathon.event_start);
  const endDate = formatDate(hackathon.event_end);
  const isOpen = hackathon.status === "open";

  return (
    <div className="group relative rounded-2xl bg-gradient-to-b from-slate-700/40 to-slate-800/0 p-px transition-all duration-300 hover:from-blue-500/60 hover:to-blue-600/20">
      <div className="relative rounded-2xl bg-slate-900/95 overflow-hidden flex flex-col h-full transition-shadow duration-300 group-hover:shadow-2xl group-hover:shadow-blue-500/10">
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border ${
                STATUS_STYLES[hackathon.status] || STATUS_STYLES.draft
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[hackathon.status] || "bg-slate-500"}`}></span>
              {STATUS_LABELS[hackathon.status] || hackathon.status}
            </span>
            <span className="flex items-center text-xs font-medium text-slate-500 capitalize">
              <Globe2 className="w-3.5 h-3.5 mr-1" />
              {hackathon.mode}
            </span>
          </div>

          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
            {hackathon.title}
          </h3>

          {hackathon.description && (
            <p className="text-sm text-slate-400 mb-4 line-clamp-3">{hackathon.description}</p>
          )}

          <div className="mt-auto space-y-2 text-sm text-slate-400 font-mono">
            {(startDate || endDate) && (
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                {startDate}
                {endDate && startDate !== endDate ? ` – ${endDate}` : ""}
              </div>
            )}
            {hackathon.venue && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                {hackathon.venue}
              </div>
            )}
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 text-blue-400" />
              {hackathon.allow_individual && hackathon.allow_team
                ? "Individual or Team"
                : hackathon.allow_team
                  ? "Team Only"
                  : "Individual Only"}
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          {isOpen ? (
            <Link
              to={`/hackathons/${hackathon.slug}/register`}
              className="group/btn w-full inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold transition-all duration-200 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/30"
            >
              Register Now
              <ArrowRight className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <button
              disabled
              className="w-full px-4 py-2.5 bg-slate-800/60 text-slate-500 rounded-xl font-semibold cursor-not-allowed border border-slate-700/50"
            >
              {STATUS_LABELS[hackathon.status] || "Not Open"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HackathonCard;
