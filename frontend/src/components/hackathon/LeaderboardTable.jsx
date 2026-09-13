import React from "react";
import { Trophy, Medal, Award } from "lucide-react";

const PODIUM_STYLES = {
  1: {
    Icon: Trophy,
    iconClass: "text-yellow-400",
    ring: "from-yellow-400/60 to-yellow-600/10",
    glow: "shadow-yellow-500/20",
  },
  2: {
    Icon: Medal,
    iconClass: "text-slate-300",
    ring: "from-slate-300/50 to-slate-500/10",
    glow: "shadow-slate-400/10",
  },
  3: {
    Icon: Award,
    iconClass: "text-amber-500",
    ring: "from-amber-500/50 to-amber-700/10",
    glow: "shadow-amber-500/10",
  },
};

const PodiumCard = ({ entry }) => {
  const style = PODIUM_STYLES[entry.rank];
  const { Icon, iconClass, ring, glow } = style;

  return (
    <div className={`relative rounded-2xl bg-gradient-to-b ${ring} p-px`}>
      <div className={`relative rounded-2xl bg-slate-900/95 p-6 text-center shadow-xl ${glow}`}>
        <Icon className={`w-8 h-8 mx-auto mb-3 ${iconClass}`} />
        <div className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-1">Rank #{entry.rank}</div>
        <div className="font-bold text-white text-lg mb-1 truncate">{entry.display_name}</div>
        {entry.project_title && (
          <div className="text-sm text-slate-400 truncate mb-2">{entry.project_title}</div>
        )}
        <div className="flex items-center justify-center gap-3 text-sm font-mono">
          {entry.score !== null && entry.score !== undefined && (
            <span className="text-blue-400">{entry.score} pts</span>
          )}
          {entry.prize && <span className="text-yellow-400">{entry.prize}</span>}
        </div>
      </div>
    </div>
  );
};

const LeaderboardTable = ({ entries }) => {
  if (!entries || entries.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-700/60 bg-slate-900/90 p-10 text-center text-slate-400 font-mono text-sm">
        [ leaderboard.pending — results not yet announced ]
      </div>
    );
  }

  const sorted = [...entries].sort((a, b) => a.rank - b.rank);
  const podium = sorted.filter((e) => e.rank <= 3);
  const rest = sorted.filter((e) => e.rank > 3);

  return (
    <div className="space-y-8">
      {podium.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {podium.map((entry) => (
            <PodiumCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}

      {rest.length > 0 && (
        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/90 overflow-hidden">
          <table className="w-full hidden md:table">
            <thead>
              <tr className="border-b border-slate-700/60 text-left text-xs font-mono uppercase tracking-wider text-slate-500">
                <th className="px-6 py-3 w-16">Rank</th>
                <th className="px-6 py-3">Team / Participant</th>
                <th className="px-6 py-3">Project</th>
                <th className="px-6 py-3">Score</th>
                <th className="px-6 py-3">Prize</th>
              </tr>
            </thead>
            <tbody>
              {rest.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b border-slate-800 last:border-0 hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-6 py-4 font-mono font-bold text-slate-500">#{entry.rank}</td>
                  <td className="px-6 py-4 font-semibold text-white">{entry.display_name}</td>
                  <td className="px-6 py-4 text-slate-400">{entry.project_title || "—"}</td>
                  <td className="px-6 py-4 text-blue-400 font-mono">
                    {entry.score !== null && entry.score !== undefined ? entry.score : "—"}
                  </td>
                  <td className="px-6 py-4 text-yellow-400 font-medium">{entry.prize || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="md:hidden divide-y divide-slate-800">
            {rest.map((entry) => (
              <div key={entry.id} className="p-4 flex items-start gap-3">
                <span className="font-mono font-bold text-slate-500 pt-0.5">#{entry.rank}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">{entry.display_name}</p>
                  {entry.project_title && (
                    <p className="text-sm text-slate-400 truncate">{entry.project_title}</p>
                  )}
                  <div className="flex items-center gap-3 mt-1 text-sm font-mono">
                    {entry.score !== null && entry.score !== undefined && (
                      <span className="text-blue-400">{entry.score} pts</span>
                    )}
                    {entry.prize && <span className="text-yellow-400">{entry.prize}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardTable;
