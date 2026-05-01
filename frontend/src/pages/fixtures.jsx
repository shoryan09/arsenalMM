import { useState, useEffect } from "react";

export default function Fixtures() {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("http://localhost:3001/api/matches/fixtures")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(data => {
        setFixtures(data.matches || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="px-6 py-24 text-center text-white/60">Loading fixtures...</div>;
  if (error) return <div className="px-6 py-24 text-center text-red-400">Error: {error}</div>;

  const competitions = ["all", ...new Set(fixtures.map(f => f.competition.name))];

  const filtered = filter === "all"
    ? fixtures
    : fixtures.filter(f => f.competition.name === filter);

  // Group by month
  const grouped = filtered.reduce((acc, match) => {
    const monthKey = new Date(match.utcDate).toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
    });
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(match);
    return acc;
  }, {});

  return (
    <div className="px-6 py-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Fixtures</h1>
      <p className="text-white/50 text-sm mb-8">{fixtures.length} upcoming matches</p>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 mb-10">
        {competitions.map(comp => (
          <button
            key={comp}
            onClick={() => setFilter(comp)}
            className={`px-4 py-1.5 text-xs uppercase tracking-wider rounded-full transition-all ${
              filter === comp
                ? "bg-[#EF0107] text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            {comp === "all" ? "All" : comp}
          </button>
        ))}
      </div>

      {/* Grouped fixtures */}
      {Object.entries(grouped).length === 0 ? (
        <div className="text-center text-white/50 py-12">No fixtures match this filter.</div>
      ) : (
        Object.entries(grouped).map(([month, matches]) => (
          <section key={month} className="mb-10">
            <h2 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">{month}</h2>
            <div className="space-y-2">
              {matches.map(match => (
                <FixtureCard key={match.id} match={match} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}

function FixtureCard({ match }) {
  const date = new Date(match.utcDate);

  return (
    <div className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl p-4 transition-all cursor-pointer">
      <div className="flex items-center justify-between gap-4">
        {/* Date */}
        <div className="flex flex-col items-center min-w-[60px]">
          <span className="text-xl font-bold tabular-nums">{date.getDate()}</span>
          <span className="text-[10px] uppercase tracking-wider text-white/50">
            {date.toLocaleDateString("en-GB", { weekday: "short" })}
          </span>
        </div>

        {/* Teams */}
        <div className="flex-1 flex items-center justify-center gap-3">
          <div className="flex items-center gap-2 flex-1 justify-end">
            <span className={`text-sm font-medium ${match.homeTeam.id === 57 ? "" : "text-white/70"}`}>
              {match.homeTeam.shortName}
            </span>
            <img src={match.homeTeam.crest} alt="" className="w-6 h-6 object-contain" />
          </div>

          <span className="text-xs text-white/30 px-2">vs</span>

          <div className="flex items-center gap-2 flex-1">
            <img src={match.awayTeam.crest} alt="" className="w-6 h-6 object-contain" />
            <span className={`text-sm font-medium ${match.awayTeam.id === 57 ? "" : "text-white/70"}`}>
              {match.awayTeam.shortName}
            </span>
          </div>
        </div>

        {/* Time + competition */}
        <div className="flex flex-col items-end min-w-[80px]">
          <span className="text-sm font-medium tabular-nums">
            {date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false })}
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <img src={match.competition.emblem} alt="" className="w-3 h-3 object-contain" />
            <span className="text-[10px] uppercase tracking-wider text-white/40">
              {match.competition.code || match.competition.name.slice(0, 3).toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}