import { NavLink } from "react-router-dom";
import SiteLogo from "../assets/SiteLogo.png";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Fixtures", path: "/fixtures" },
  { name: "Results", path: "/results" },
  { name: "Table", path: "/table" },
  { name: "Squad", path: "/squad" },
  { name: "News", path: "/news" },
];

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1f1e1d]/80 backdrop-blur-md border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center h-14">
          {/* Logo */}
          <NavLink to="/" className="flex items-center mr-10">
            <img src={SiteLogo} alt="Arsenal logo" className="w-10 h-10 object-contain" />
          </NavLink>

          {/* Nav links */}
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.name}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3 py-1.5 text-[13px] font-medium cursor-pointer transition-colors ${
                      isActive ? "text-white" : "text-white/70 hover:text-white"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}