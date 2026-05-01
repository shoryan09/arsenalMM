import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Gunners Hub</h3>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Pages</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-xs text-white/50 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/fixtures" className="text-xs text-white/50 hover:text-white transition-colors">Fixtures</Link></li>
              <li><Link to="/results" className="text-xs text-white/50 hover:text-white transition-colors">Results</Link></li>
              <li><Link to="/table" className="text-xs text-white/50 hover:text-white transition-colors">Table</Link></li>
              <li><Link to="/squad" className="text-xs text-white/50 hover:text-white transition-colors">Squad</Link></li>
              <li><Link to="/news" className="text-xs text-white/50 hover:text-white transition-colors">News</Link></li>
            </ul>
          </div>

          {/* Credits */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Data Sources</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://www.football-data.org" target="_blank" rel="noopener noreferrer" className="text-xs text-white/50 hover:text-white transition-colors">
                  football-data.org
                </a>
              </li>
              <li>
                <a href="https://arseblog.com" target="_blank" rel="noopener noreferrer" className="text-xs text-white/50 hover:text-white transition-colors">
                  Arseblog
                </a>
              </li>
              <li>
                <a href="https://www.bbc.co.uk/sport/football" target="_blank" rel="noopener noreferrer" className="text-xs text-white/50 hover:text-white transition-colors">
                  BBC Sport
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Gunners Hub. Not affiliated with Arsenal FC.
          </p>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/shoryan09/arsenalMM"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/40 hover:text-white transition-colors"
            >
              GitHub
            </a>

            <span className="text-xs text-white/30">Built by Shoryan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}