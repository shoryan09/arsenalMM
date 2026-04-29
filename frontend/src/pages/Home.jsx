import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import TunnelImg from "../assets/arsenal_tunnel.jpg";

export default function Home() {
  // Hardcoded next match — replace with API later
  const nextMatch = {
    opponent: "Chelsea",
    date: new Date("2026-05-03T17:30:00"),
    competition: "Premier League",
    venue: "Emirates Stadium",
  };

  const [timeLeft, setTimeLeft] = useState(getTimeLeft(nextMatch.date));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(nextMatch.date));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative -mt-14 h-screen w-full overflow-hidden">
      {/* Tunnel background — fades softly into page */}
      <img
        src={TunnelImg}
        alt="Emirates Stadium tunnel — Never Give Up, Fight Until The End"
        className="absolute inset-0 w-full h-full object-cover [mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_75%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_75%,transparent_100%)]"
      />

      {/* Subtle vignette to focus the eye toward the doorway */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

      {/* Fixture card — anchored bottom-center */}
      <div className="relative h-full flex items-end justify-center pb-10 px-6">
        <Link to="/fixtures" className="block group w-full max-w-md">
          <div className="bg-white/[0.06] backdrop-blur-2xl border border-white/15 rounded-2xl px-6 py-5 hover:bg-white/[0.10] hover:border-white/25 transition-all duration-300 shadow-2xl">
            {/* Top row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#EF0107] rounded-full animate-pulse"></span>
                <span className="text-[11px] font-medium text-white/70 uppercase tracking-[0.15em]">
                  Next · {nextMatch.competition}
                </span>
              </div>
              <span className="text-[11px] text-white/50 group-hover:text-white transition-colors">
                Fixtures →
              </span>
            </div>

            {/* Teams */}
            <div className="flex items-center justify-between mb-5">
              <span className="text-xl font-semibold tracking-tight">Arsenal</span>
              <span className="text-[11px] text-white/40 font-medium uppercase tracking-wider">
                vs
              </span>
              <span className="text-xl font-semibold tracking-tight">
                {nextMatch.opponent}
              </span>
            </div>

            {/* Countdown */}
            <div className="grid grid-cols-4 gap-3 pt-4 border-t border-white/10">
              <TimeUnit value={timeLeft.days} label="Days" />
              <TimeUnit value={timeLeft.hours} label="Hours" />
              <TimeUnit value={timeLeft.minutes} label="Min" />
              <TimeUnit value={timeLeft.seconds} label="Sec" />
            </div>

            {/* Venue */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
              <span>{nextMatch.venue}</span>
              <span>
                {nextMatch.date.toLocaleDateString("en-GB", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

function TimeUnit({ value, label }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-semibold tabular-nums leading-none">
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-[10px] uppercase tracking-[0.15em] text-white/50 mt-1.5">    
        {label}
      </div>
    </div>
  );
}

function getTimeLeft(target) {
  const diff = target - new Date();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}