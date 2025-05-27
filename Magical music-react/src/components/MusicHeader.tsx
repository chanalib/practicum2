import  { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./MusicHeader.css";

type NavItem = {
  name: string;
  path: string;
};

type User = {
  firstName?: string;
  email?: string;
} | null;

type MusicHeaderProps = {
  onLogout: () => void;
  user: User;
};

const navItems: NavItem[] = [
  { name: "בית", path: "/home" },
  { name: "שירים", path: "/songs" },
  { name: "זמרים", path: "/creators" },
  { name: "הקלטה", path: "/AudioRecorder" },
  { name: "קריוקי", path: "/KaraokeRecorder" },
  { name: "רינגטון", path: "/ringtone" },
  { name: "בקשת שיר", path: "/request" },
  { name: "תמלול שיר", path: "/Transcription" },
];

const MusicHeader = ({ onLogout, user }: MusicHeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const firstLetter = user
    ? (user.firstName?.charAt(0) || user.email?.charAt(0) || "").toUpperCase()
    : "";

  // סגירת התפריט בלחיצה מחוץ
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header className="music-header">
      <div className="header-container">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="logo-title">
              <span className="gradient-text">🎵 Magical Music</span>
            </h1>
          </div>

          <nav className="main-nav">
            {navItems.map((item: NavItem) => (
              <Link key={item.name} to={item.path} className="nav-link">
                <span className="nav-text">{item.name}</span>
                <span className="nav-underline"></span>
              </Link>
            ))}
          </nav>

          <div className="header-actions" ref={menuRef}>
            {user && (
              <div className="profile-wrapper">
                <div
                  className="profile-circle"
                  title={user.firstName || user.email}
                  onClick={() => setMenuOpen((prev) => !prev)}
                  style={{ cursor: "pointer" }}
                >
                  {firstLetter}
                </div>
                {menuOpen && (
                  <div className="profile-menu">
                    <div className="profile-info">
                      <p>{user.firstName || "משתמש"}</p>
                      <p className="email">{user.email}</p>
                    </div>
                    <Link to="/profile" className="profile-link" onClick={() => setMenuOpen(false)}>
                      אזור אישי
                    </Link>
                    <button
                      className="logout-button-menu"
                      onClick={() => {
                        onLogout();
                        setMenuOpen(false);
                      }}
                    >
                      התנתק
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export { MusicHeader };
