"use client"

import type React from "react"
import { useState } from "react"
import Home from "../components/Home"
import AudioRecorder from "../components/AudioRecorder"
import KaraokeRecorder from "../components/KaraokeRecorder"
import Creators from "../components/Creators"
import AllSongs from "../components/AllSongs"
import "../styles/global.css"
import "../styles/home.css"
import "../styles/forms.css"
import "../styles/header.css"
import "../styles/audio-recorder.css"
import "../styles/karaoke.css"
import "../styles/creators.css"
import "../styles/songs.css"
import MusicAnimation from "../components/MusicAnimation"

export default function MagicalMusicApp() {
  const [currentPage, setCurrentPage] = useState<
    "login" | "register" | "home" | "audio" | "karaoke" | "creators" | "songs"
  >("home")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentPage("login")
  }

  const mockNavigate = (path: string) => {
    if (path === "/home" || path === "/") {
      setCurrentPage("home")
      setIsLoggedIn(true)
    } else if (path === "/login") {
      setCurrentPage("login")
    } else if (path === "/register") {
      setCurrentPage("register")
    } else if (path === "/AudioRecorder") {
      setCurrentPage("audio")
    } else if (path === "/KaraokeRecorder") {
      setCurrentPage("karaoke")
    } else if (path === "/artists") {
      setCurrentPage("creators")
    } else if (path === "/songs") {
      setCurrentPage("songs")
    }
  }

  // Mock components with navigation
  const LoginWithNavigation = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setError("")

      if (email && password) {
        setEmail("")
        setPassword("")
        setTimeout(() => {
          mockNavigate("/home")
        }, 1000)
      } else {
        setError("התחברות נכשלה, אנא בדוק את המייל והסיסמה.")
      }
    }

    return (
      <div className="music-login-form">
        <div className="music-login-header">
          <h2>Magical Music</h2>
          <p>עולם של מוזיקה קסומה</p>
        </div>
        <form className="login-form" onSubmit={handleLogin}>
          <label htmlFor="email">דואר אלקטרוני</label>
          <input
            type="email"
            id="email"
            placeholder="you@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />
          <label htmlFor="password">סיסמה</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
          />
          {error && <p className="error-message">{error}</p>}
          <div className="login-buttons">
            <button type="submit" className="music-button">
              כניסה
            </button>
            <p className="register-link" onClick={() => mockNavigate("/register")}>
              עדיין אין לי חשבון
            </p>
          </div>
        </form>
      </div>
    )
  }

  const RegisterWithNavigation = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if (name && email && password) {
        setMessage("!נרשמת בהצלחה")
        setTimeout(() => {
          mockNavigate("/home")
        }, 2000)
      } else {
        setMessage("שגיאה בהרשמה, אנא נסה שוב.")
      }
    }

    return (
      <div className="music-login-form">
        <div className="music-login-header">
          <h2>Magical Music</h2>
          <p>עולם של מוזיקה קסומה</p>
        </div>
        {message && <p className="error-message">{message}</p>}
        <form className="login-form" onSubmit={handleRegister}>
          <input
            type="text"
            id="name"
            placeholder="שם"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input-field"
          />
          <input
            type="email"
            id="email"
            placeholder="מייל"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
            placeholder="סיסמה"
          />
          <div className="login-buttons">
            <button type="submit" className="music-button">
              הרשמה
            </button>
            <p className="register-link" onClick={() => mockNavigate("/login")}>
              כבר יש לי חשבון
            </p>
          </div>
        </form>
      </div>
    )
  }

  // Enhanced header with navigation
  const HeaderWithNavigation = () => {
    const navItems = [
      { name: "בית", path: "/", icon: "🏠" },
      { name: "שירים", path: "/songs", icon: "🎵" },
      { name: "זמרים", path: "/artists", icon: "🎤" },
      { name: "הקלטה", path: "/AudioRecorder", icon: "🎙️" },
      { name: "קריוקי", path: "/KaraokeRecorder", icon: "📻" },
      { name: "רינגטון", path: "/ringtone", icon: "📱" },
      { name: "בקשת שיר", path: "/request", icon: "💌" },
    ]

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
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href="#"
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault()
                    mockNavigate(item.path)
                  }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.name}</span>
                  <span className="nav-underline"></span>
                </a>
              ))}
            </nav>

            <div className="header-actions">
              <button className="logout-button" onClick={handleLogout}>
                <span className="logout-icon">🚪</span>
                <span className="logout-text">התנתק</span>
              </button>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* Background Animation */}
      <MusicAnimation />

      {/* Header - only show when logged in */}
      {isLoggedIn && <HeaderWithNavigation />}

      {/* Main Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {currentPage === "login" && <LoginWithNavigation />}
        {currentPage === "register" && <RegisterWithNavigation />}
        {currentPage === "home" && isLoggedIn && <Home />}
        {currentPage === "audio" && isLoggedIn && <AudioRecorder />}
        {currentPage === "karaoke" && isLoggedIn && <KaraokeRecorder />}
        {currentPage === "creators" && isLoggedIn && <Creators />}
        {currentPage === "songs" && isLoggedIn && <AllSongs />}
        {currentPage === "home" && !isLoggedIn && <LoginWithNavigation />}
      </div>
    </div>
  )
}
