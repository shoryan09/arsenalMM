import { useState, useEffect } from "react";

export default function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("http://localhost:3001/api/matches/results")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(data => {
        // Most recent first
        const sorted = (data.matches || []).sort(
          (a, b) => new Date(b.utcDate) - new Date(a.utcDate)
        );
        setResults(sorted);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="px-6 py-24 text-center text-white/60">Loading results...</div>;
  if (error) return <div className="px-6 py-24 text-center text-red-400">Error: {error}</div>;

  const competitions = ["all", ...new Set(results.map(r => r.competition.name))];

  const filtered = filter === "all"
    ? results
    : results.filter(r => r.competition.name === filter);

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
      <h1 className="text-3xl font-bold mb-2">Results</h1>
      <p className="text-white/50 text-sm mb-8">Last {results.length} matches</p>

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

      {Object.entries(grouped).length === 0 ? (
        <div className="text-center text-white/50 py-12">No results match this filter.</div>
      ) : (
        Object.entries(grouped).map(([month, matches]) => (
          <section key={month} className="mb-10">
            <h2 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">{month}</h2>
            <div className="space-y-2">
              {matches.map(match => (
                <ResultCard key={match.id} match={match} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}

function ResultCard({ match }) {
  const date = new Date(match.utcDate);
  const homeScore = match.score.fullTime.home;
  const awayScore = match.score.fullTime.away;
  const isHome = match.homeTeam.id === 57;
  const arsenalScore = isHome ? homeScore : awayScore;
  const opponentScore = isHome ? awayScore : homeScore;

  // Outcome from Arsenal's perspective
  let outcome = "draw";
  if (arsenalScore > opponentScore) outcome = "win";
  else if (arsenalScore < opponentScore) outcome = "loss";

  const outcomeColor = {
    win: "border-l-green-500/60",
    draw: "border-l-yellow-500/60",
    loss: "border-l-red-500/60",
  }[outcome];

  return (
    <div className={`bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 border-l-4 ${outcomeColor} rounded-xl p-4 transition-all cursor-pointer`}>
      <div className="flex items-center justify-between gap-4">
        {/* Date */}
        <div className="flex flex-col items-center min-w-[60px]">
          <span className="text-xl font-bold tabular-nums">{date.getDate()}</span>
          <span className="text-[10px] uppercase tracking-wider text-white/50">
            {date.toLocaleDateString("en-GB", { weekday: "short" })}
          </span>
        </div>

        {/* Teams + score */}
        <div className="flex-1 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2 flex-1 justify-end">
            <span className={`text-sm font-medium ${match.homeTeam.id === 57 ? "" : "text-white/70"}`}>
              {match.homeTeam.shortName}
            </span>
            <img src={match.homeTeam.crest} alt="" className="w-6 h-6 object-contain" />
          </div>

          <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-md tabular-nums font-bold text-base">
            <span>{homeScore}</span>
            <span className="text-white/40">-</span>
            <span>{awayScore}</span>
          </div>

          <div className="flex items-center gap-2 flex-1">
            <img src={match.awayTeam.crest} alt="" className="w-6 h-6 object-contain" />
            <span className={`text-sm font-medium ${match.awayTeam.id === 57 ? "" : "text-white/70"}`}>
              {match.awayTeam.shortName}
            </span>
          </div>
        </div>

        {/* Competition */}
        <div className="flex flex-col items-end min-w-[80px]">
          <div className="flex items-center gap-1.5">
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