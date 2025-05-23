import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"

interface MusicHeaderProps {
  onLogout: () => void
}

export function MusicHeader({ onLogout }: MusicHeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const navItems = [
    { name: "שירים", path: "/songs" },
    { name: "זמרים", path: "/artists" },
    { name: "אודות", path: "/about" },
    { name: "בקשת שיר", path: "/request" },
    { name: "רינגטון", path: "/ringtone" },
    { name: "הקלטה", path: "/AudioRecorder" },
    { name: "קריוקי", path: "/KaraokeRecorder" },

  ]

  return (
    <header className={`header ${scrolled ? "scrolled" : "default"}`}>
      <div className="container">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MusicNoteIcon className="icon" />
            <div className="user-actions">
            <button className="logout-button" onClick={onLogout}>
              <span className="ml-1">התנתק</span>
              <LogoutIcon className="icon" />
            </button>
          </div>
            <span
              className="logo"
              onClick={() => navigate("/home")}
            >
              Magical Music
            </span>
          </div>

          <nav className="nav">
            {navItems.map((item) => (
              <Link
                to={item.path}
                key={item.name}
                className="nav-item"
              >
                <span>{item.name}</span>
                <span className="underline"></span>
              </Link>
            ))}
          </nav>

       
        </div>
      </div>
    </header>
  )
}

// כאן הוסף את הפונקציות של הקומפוננטות
function MusicNoteIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 18V5l12-2v13"></path>
      <circle cx="6" cy="18" r="3"></circle>
      <circle cx="18" cy="16" r="3"></circle>
    </svg>
  )
}

function LogoutIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  )
}
