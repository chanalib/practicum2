"use client"
import "./MusicHeader.css"
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"

interface User {
  Name?: string
  email?: string
}

interface MusicHeaderProps {
  onLogout: () => void
  user?: User | null
}

const MusicHeader = ({ onLogout, user }: MusicHeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileHover, setProfileHover] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const navItems = [
    { name: "שירים", path: "/songs" },
    { name: "זמרים", path: "/creators" },
    { name: "הקלטה", path: "/AudioRecorder" },
    { name: "קריוקי", path: "/KaraokeRecorder" },
    { name: "רינגטון", path: "/ringtone" },
    { name: "בקשת שיר", path: "/request" },
    { name: "תמלול", path: "/transcription" },
  ]

  const firstLetter = user
    ? (user.Name?.charAt(0) || user.email?.charAt(0) || "").toUpperCase()
    : "U"

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [menuOpen])

  return (
    <header className="music-header">
      <div className="header-container">
        <div className="header-content">
          <a href="/home" className="logo-section">
            <h1 className="logo-title">
              <span className="gradient-text">🎵 Magical Music</span>
            </h1>
          </a>

          <nav className="main-nav">
            {navItems.map((item) => (
              <a
                key={item.name}
                href="#"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault()
                  navigate(item.path)
                }}
              >
                <span className="nav-text">{item.name}</span>
                <span className="nav-underline"></span>
              </a>
            ))}
          </nav>

          <div className="header-actions" ref={menuRef}>
            <div className="profile-wrapper">
              <div
                className={`profile-circle ${profileHover ? "hover" : ""}`}
                title={user?.Name || user?.email || "משתמש"}
                onClick={() => setMenuOpen((prev) => !prev)}
                onMouseEnter={() => setProfileHover(true)}
                onMouseLeave={() => setProfileHover(false)}
              >
                <span className="profile-letter">{firstLetter}</span>
                <div className="profile-glow"></div>
                <div className="profile-particles">
                  <span className="particle particle-1">✨</span>
                  <span className="particle particle-2">⭐</span>
                  <span className="particle particle-3">💫</span>
                </div>
              </div>

              {menuOpen && (
                <div className="profile-menu">
                  <div className="menu-header">
                    <div className="menu-avatar">
                      <span>{firstLetter}</span>
                    </div>
                    <div className="menu-user-info">
                      <h3 className="menu-username">{user?.Name}</h3>
                      <p className="menu-email">{user?.email || "user@example.com"}</p>
                    </div>
                  </div>

                  <div className="menu-divider"></div>

                  <div className="menu-items">
                    <a href="#" className="menu-item" onClick={() => setMenuOpen(false)}>
                      <span className="menu-icon">👤</span>
                      <span>פרופיל אישי</span>
                    </a>
                    <a href="#" className="menu-item" onClick={() => setMenuOpen(false)}>
                      <span className="menu-icon">⚙️</span>
                      <span>הגדרות</span>
                    </a>
                    <a href="#" className="menu-item" onClick={() => setMenuOpen(false)}>
                      <span className="menu-icon">🎵</span>
                      <span>השירים שלי</span>
                    </a>
                    <a href="#" className="menu-item" onClick={() => setMenuOpen(false)}>
                      <span className="menu-icon">❤️</span>
                      <span>מועדפים</span>
                    </a>
                  </div>

                  <div className="menu-divider"></div>

                  <button
                    className="logout-button-menu"
                    onClick={() => {
                      onLogout()
                      setMenuOpen(false)
                    }}
                  >
                    <span className="menu-icon">🚪</span>
                    <span>התנתק</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export { MusicHeader }
