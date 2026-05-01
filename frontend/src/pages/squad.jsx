import { useState, useEffect } from "react";

export default function Squad() {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/squad")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(data => {
        setTeam(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="px-6 py-24 text-center text-white/60">Loading squad...</div>;
  if (error) return <div className="px-6 py-24 text-center text-red-400">Error: {error}</div>;

  // Group players by broad position
  const groups = {
    Goalkeepers: [],
    Defenders: [],
    Midfielders: [],
    Forwards: [],
    Other: [],
  };

  team.squad.forEach(player => {
    const group = mapPosition(player.position);
    groups[group].push(player);
  });

  return (
    <div className="px-6 py-12 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Squad</h1>
      <p className="text-white/50 text-sm mb-10">{team.squad.length} players</p>

      {Object.entries(groups).map(([position, players]) =>
        players.length > 0 ? (
          <section key={position} className="mb-12">
            <h2 className="text-sm uppercase tracking-[0.2em] text-white/40 mb-4">
              {position} <span className="text-white/30">· {players.length}</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {players.map(player => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          </section>
        ) : null
      )}
    </div>
  );
}

// Maps any specific or generic position string to a broad category
function mapPosition(position) {
  if (!position || position === "null") return "Other";

  const pos = position.toLowerCase();

  if (pos.includes("goalkeeper")) return "Goalkeepers";

  if (
    pos.includes("back") ||
    pos.includes("defence") ||
    pos.includes("defender")
  ) return "Defenders";

  if (pos.includes("midfield")) return "Midfielders";

  if (
    pos.includes("forward") ||
    pos.includes("winger") ||
    pos.includes("striker") ||
    pos.includes("offence")
  ) return "Forwards";

  return "Other";
}

function PlayerCard({ player }) {
  const age = calculateAge(player.dateOfBirth);

  return (
    <div className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 rounded-xl p-4 transition-all cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <span className="text-3xl font-bold text-white/80 tabular-nums">
          {player.shirtNumber || "—"}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-white/40 px-2 py-0.5 rounded bg-white/5">
          {player.nationality?.slice(0, 3).toUpperCase() || "—"}
        </span>
      </div>

      <h3 className="font-semibold text-base leading-tight mb-1">{player.name}</h3>
      <p className="text-xs text-white/50">
        {player.position && player.position !== "null" ? player.position : "Squad player"} · Age {age}
      </p>
    </div>
  );
}

function calculateAge(dob) {
  if (!dob) return "—";
  const birth = new Date(dob);
  const diff = Date.now() - birth.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}