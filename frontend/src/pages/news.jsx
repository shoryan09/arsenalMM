import { useState, useEffect } from "react";

export default function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("http://localhost:3001/api/news")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(data => {
        setArticles(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="px-6 py-24 text-center text-white/60">Loading news...</div>;
  if (error) return <div className="px-6 py-24 text-center text-red-400">Error: {error}</div>;

  const sources = ["all", ...new Set(articles.map(a => a.source))];

  const filtered = filter === "all"
    ? articles
    : articles.filter(a => a.source === filter);

  return (
    <div className="px-6 py-12 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">News</h1>
      <p className="text-white/50 text-sm mb-8">
        Latest Arsenal news from {sources.length - 1} sources
      </p>

      <div className="flex flex-wrap gap-2 mb-10">
        {sources.map(src => (
          <button
            key={src}
            onClick={() => setFilter(src)}
            className={`px-4 py-1.5 text-xs uppercase tracking-wider rounded-full transition-all ${
              filter === src
                ? "bg-[#EF0107] text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            {src === "all" ? "All Sources" : src}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center text-white/50 py-12">No articles found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

function ArticleCard({ article }) {
  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 rounded-xl overflow-hidden transition-all"
    >
      {article.image && (
        <div className="aspect-video w-full bg-white/5 overflow-hidden">
          <img
            src={article.image}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => (e.target.parentElement.style.display = "none")}
          />
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] uppercase tracking-wider text-[#EF0107] font-medium">
            {article.source}
          </span>
          <span className="text-white/30 text-xs">·</span>
          <span className="text-[10px] text-white/50">{timeAgo(article.pubDate)}</span>
        </div>

        <h2 className="text-base font-semibold leading-snug mb-2 group-hover:text-white transition-colors">
          {article.title}
        </h2>

        {article.excerpt && (
          <p className="text-sm text-white/60 leading-relaxed line-clamp-2">
            {article.excerpt}
          </p>
        )}
      </div>
    </a>
  );
}

function timeAgo(date) {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return then.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
