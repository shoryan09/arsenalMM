import { useState, useEffect } from "react";

export default function Table() {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/standings/PL")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(data => {
        setStandings(data.standings[0].table);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="px-6 py-24 text-center text-white/60">Loading table...</div>;
  if (error) return <div className="px-6 py-24 text-center text-red-400">Error: {error}</div>;

  return (
    <div className="px-6 py-12 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Premier League</h1>

      <div className="space-y-1">
        {/* Header row */}
        <div className="grid grid-cols-[40px_1fr_50px_50px_50px_50px_60px] gap-3 px-4 py-2 text-[11px] uppercase tracking-wider text-white/40 border-b border-white/10">
          <span>#</span>
          <span>Team</span>
          <span className="text-center">P</span>
          <span className="text-center">W</span>
          <span className="text-center">D</span>
          <span className="text-center">L</span>
          <span className="text-center">Pts</span>
        </div>

        {/* Team rows */}
        {standings.map(team => {
          const isArsenal = team.team.id === 57;
          return (
            <div
              key={team.team.id}
              className={`grid grid-cols-[40px_1fr_50px_50px_50px_50px_60px] gap-3 px-4 py-3 rounded-md transition-colors ${
                isArsenal
                  ? "bg-[#EF0107]/15 border border-[#EF0107]/40"
                  : "hover:bg-white/5"
              }`}
            >
              <span className="text-white/50 font-medium">{team.position}</span>
              <span className="flex items-center gap-3 font-medium">
                <img src={team.team.crest} alt="" className="w-5 h-5 object-contain" />
                <span>{team.team.shortName}</span>
              </span>
              <span className="text-center text-white/70">{team.playedGames}</span>
              <span className="text-center text-white/70">{team.won}</span>
              <span className="text-center text-white/70">{team.draw}</span>
              <span className="text-center text-white/70">{team.lost}</span>
              <span className="text-center font-bold">{team.points}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}