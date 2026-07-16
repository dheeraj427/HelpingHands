import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import "../styles/Navbar.css";

function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { path: "/", label: "🏠 Home" },
    { path: "/schools", label: "🏫 Schools" },
    { path: "/resources", label: "📚 Resources" },
    { path: "/volunteer", label: "🤝 Volunteers" },
    { path: "/contact", label: "📞 Contact" },
    { path: "/admin", label: "🔐 Admin" },
  ];

  return (
    <header className="navbar glass">
      <div className="navbar-container">

        <Link to="/" className="logo">

          <div className="logo-circle">
            ❤️
          </div>

          <div className="logo-text">

            <h2>HelpingHands</h2>

            <span>Empowering Education</span>

          </div>

        </Link>

        <ul className={menuOpen ? "nav-links active" : "nav-links"}>

          {links.map((item) => (
            <li key={item.path}>

              <Link
                to={item.path}
                className={
                  location.pathname === item.path
                    ? "nav-item active"
                    : "nav-item"
                }
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>

            </li>
          ))}

        </ul>

        <button
          className="nav-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

      </div>
    </header>
  );
}

export default Navbar;