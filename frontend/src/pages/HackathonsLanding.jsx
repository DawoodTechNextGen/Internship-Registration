import React from "react";
import { Loader2, Trophy, Zap, Radar, Cpu } from "lucide-react";
import HackathonHeader from "../components/common/HackathonHeader";
import HackathonCard from "../components/hackathon/HackathonCard";
import LeaderboardTable from "../components/hackathon/LeaderboardTable";
import TechBackground from "../components/hackathon/TechBackground";
import { useGetHackathonsQuery, useGetLeaderboardQuery } from "../api/apiSlice.js";

const SectionEyebrow = ({ children }) => (
  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-blue-400 mb-3">
    <span className="text-blue-500">{"//"}</span>
    {children}
  </div>
);

const StatTile = ({ icon: Icon, label, value }) => (
  <div className="relative rounded-2xl border border-slate-700/60 bg-slate-900/90 px-6 py-5 overflow-hidden">
    <div className="absolute -top-6 -right-6 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl"></div>
    <div className="relative flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-500/20 border border-blue-500/30 flex items-center justify-center">
        <Icon className="w-5 h-5 text-blue-400" />
      </div>
      <div>
        <div className="text-2xl font-black text-white tabular-nums">{value}</div>
        <div className="text-xs text-slate-400 font-medium tracking-wide">{label}</div>
      </div>
    </div>
  </div>
);

const HackathonsLanding = () => {
  const { data: openHackathons, isLoading: openLoading } = useGetHackathonsQuery("open");
  const { data: upcomingHackathons, isLoading: upcomingLoading } = useGetHackathonsQuery("upcoming");
  const { data: completedHackathons } = useGetHackathonsQuery("completed");

  const activeHackathons = [...(openHackathons || []), ...(upcomingHackathons || [])];
  const recentHackathon = completedHackathons && completedHackathons.length > 0 ? completedHackathons[0] : null;

  const { data: leaderboard } = useGetLeaderboardQuery(recentHackathon?.id, {
    skip: !recentHackathon,
  });

  const isLoading = openLoading || upcomingLoading;
  const totalHosted = (openHackathons?.length || 0) + (upcomingHackathons?.length || 0) + (completedHackathons?.length || 0);

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      <TechBackground />

      <div className="relative">
        <HackathonHeader />

        {/* Hero */}
        <section className="relative overflow-hidden px-4 pt-20 pb-16 md:pt-28 md:pb-24">
          <div className="relative max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-mono uppercase tracking-widest mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></span>
              </span>
              System Online — DawoodTech NextGen
            </span>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Build. Compete.
              </span>
              <br />
              <span className="text-white">Ship the Future.</span>
            </h1>

            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
              Solo or squad up — push code, ship ideas, and race the clock in hackathons engineered for
              builders who want to move at machine speed.
            </p>

            <div className="flex items-center justify-center gap-4">
              <a
                href="#active-hackathons"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:scale-[1.03]"
              >
                <Zap className="w-4 h-4" />
                Enter the Arena
              </a>
              {recentHackathon && (
                <a
                  href="#leaderboard"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-slate-700 text-slate-300 font-semibold rounded-xl hover:border-blue-500/50 hover:text-blue-300 transition-colors"
                >
                  <Trophy className="w-4 h-4" />
                  View Leaderboard
                </a>
              )}
            </div>
          </div>

          {/* Live stats strip */}
          <div className="relative max-w-3xl mx-auto mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatTile icon={Zap} label="Registration Open" value={openHackathons?.length ?? "—"} />
            <StatTile icon={Radar} label="Upcoming Drops" value={upcomingHackathons?.length ?? "—"} />
            <StatTile icon={Cpu} label="Hackathons Hosted" value={totalHosted || "—"} />
          </div>
        </section>

        {/* Active / Open hackathons */}
        <section id="active-hackathons" className="px-4 pb-20 max-w-6xl mx-auto scroll-mt-20">
          <SectionEyebrow>active_hackathons.list()</SectionEyebrow>
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <Trophy className="w-7 h-7 text-blue-400" />
            Active Hackathons
          </h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
          ) : activeHackathons.length === 0 ? (
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/90 p-10 text-center text-slate-400 font-mono text-sm">
              [ no active hackathons found — check back soon ]
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeHackathons.map((hackathon) => (
                <HackathonCard key={hackathon.id} hackathon={hackathon} />
              ))}
            </div>
          )}
        </section>

        {/* Recent results & leaderboard */}
        {recentHackathon && (
          <section id="leaderboard" className="px-4 pb-24 max-w-6xl mx-auto scroll-mt-20">
            <SectionEyebrow>leaderboard.render()</SectionEyebrow>
            <h2 className="text-3xl font-bold text-white mb-2">Recent Results &amp; Leaderboard</h2>
            <p className="text-slate-400 mb-8 font-mono text-sm">{"> "}{recentHackathon.title}</p>
            <LeaderboardTable entries={leaderboard} />
          </section>
        )}
      </div>
    </div>
  );
};

export default HackathonsLanding;
