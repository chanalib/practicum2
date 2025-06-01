"use client"

import type React from "react"
import { useEffect, useState } from "react"
import "./Styles/user-profile.css"
interface UserStats {
  totalLikedSongs: number
  favoriteGenres: string[]
  listeningTime: number
  joinDate: string
  lastActive: string
}

interface User {
  id?: number
  firstName?: string
  lastName?: string
  email?: string
  avatar?: string
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true)
      setError(null)
      try {
        // Try to fetch real user data
        const res = await fetch("https://magical-music-server.onrender.com/api/UserProfil")
        if (res.ok) {
          const data = await res.json()
          setUser({
            id: data.id,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            avatar: data.avatar,
          })
        } else {
          // Fallback to localStorage or default data
          const savedUser = localStorage.getItem("currentUser")
          if (savedUser) {
            const userData = JSON.parse(savedUser)
            setUser(userData)
          } else {
            setUser({
              firstName: "משתמש",
              lastName: "אורח",
              email: "user@example.com",
            })
          }
        }

        // Calculate stats from liked songs
        const savedLikes = localStorage.getItem("likedSongs")
        const likedSongs = savedLikes ? JSON.parse(savedLikes) : []

        // Mock genre analysis based on liked songs
        const mockGenres = ["פופ", "רוק", "ג'אז", "קלאסי", "אלקטרוני"]
        const favoriteGenres = mockGenres.slice(0, Math.min(3, Math.max(1, Math.floor(likedSongs.length / 3))))

        setStats({
          totalLikedSongs: likedSongs.length,
          favoriteGenres,
          listeningTime: likedSongs.length * 3.5, // Average 3.5 minutes per song
          joinDate: "2024-01-01",
          lastActive: new Date().toISOString(),
        })
      } catch (err: any) {
        console.error("שגיאה בטעינת נתוני המשתמש:", err)
        setError("לא ניתן לטעון את נתוני המשתמש כעת")
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  // Update user data when it changes
  useEffect(() => {
    const handleStorageChange = () => {
      const savedUser = localStorage.getItem("currentUser")
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const handleSaveProfile = async () => {
    if (!user) return
    try {
      const res = await fetch(`https://magical-music-server.onrender.com/api/UserProfil`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })
      if (res.ok) {
        // Update localStorage as well
        localStorage.setItem("currentUser", JSON.stringify(user))
        setIsEditing(false)
      } else {
        throw new Error("שגיאה בשמירה")
      }
    } catch (err) {
      console.error("שגיאה בשמירת הפרופיל:", err)
      // Save to localStorage as fallback
      localStorage.setItem("currentUser", JSON.stringify(user))
      setIsEditing(false)
    }
  }

  const formatListeningTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = Math.floor(minutes % 60)
    return hours > 0 ? `${hours} שעות ו-${mins} דקות` : `${mins} דקות`
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString("he-IL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getInitials = (): string => {
    if (!user) return "U"
    const firstInitial = user.firstName?.charAt(0) || ""
    const lastInitial = user.lastName?.charAt(0) || ""
    const emailInitial = user.email?.charAt(0) || ""

    return firstInitial + lastInitial || emailInitial || "U"
  }

  if (loading)
    return (
      <div className="user-profile-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>טוען נתונים...</p>
        </div>
      </div>
    )

  if (error)
    return (
      <div className="user-profile-page">
        <div className="error-container">
          <div className="error-icon">❌</div>
          <p>שגיאה: {error}</p>
        </div>
      </div>
    )

  if (!user || !stats)
    return (
      <div className="user-profile-page">
        <div className="error-container">
          <div className="error-icon">👤</div>
          <p>לא נמצאו נתוני משתמש</p>
        </div>
      </div>
    )

  return (
    <div className="user-profile-page">
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              <span className="avatar-text">{getInitials()}</span>
              <div className="avatar-glow"></div>
            </div>
            <button className="change-avatar-btn">📷 שנה תמונה</button>
          </div>

          <div className="profile-info">
            {isEditing ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={user.firstName || ""}
                  onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                  placeholder="שם פרטי"
                  className="edit-input"
                />
                <input
                  type="text"
                  value={user.lastName || ""}
                  onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                  placeholder="שם משפחה"
                  className="edit-input"
                />
                <input
                  type="email"
                  value={user.email || ""}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  placeholder="אימייל"
                  className="edit-input"
                />
                <div className="edit-actions">
                  <button className="save-btn" onClick={handleSaveProfile}>
                    💾 שמור
                  </button>
                  <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                    ❌ ביטול
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-display">
                <h1 className="profile-name">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="profile-email">{user.email}</p>
                <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                  ✏️ ערוך פרופיל
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">💖</div>
            <div className="stat-content">
              <h3 className="stat-number">{stats.totalLikedSongs}</h3>
              <p className="stat-label">שירים מועדפים</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🎵</div>
            <div className="stat-content">
              <h3 className="stat-number">{formatListeningTime(stats.listeningTime)}</h3>
              <p className="stat-label">זמן האזנה</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3 className="stat-number">{formatDate(stats.joinDate)}</h3>
              <p className="stat-label">תאריך הצטרפות</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏰</div>
            <div className="stat-content">
              <h3 className="stat-number">{formatDate(stats.lastActive)}</h3>
              <p className="stat-label">פעילות אחרונה</p>
            </div>
          </div>
        </div>

        {/* Music Preferences */}
        <div className="preferences-section">
          <h2 className="section-title">🎼 תחומי העניין המוזיקליים שלך</h2>
          <div className="genres-container">
            {stats.favoriteGenres.length > 0 ? (
              stats.favoriteGenres.map((genre, index) => (
                <div key={index} className="genre-tag">
                  {genre}
                </div>
              ))
            ) : (
              <p className="no-genres">התחל לאהוב שירים כדי לגלות את תחומי העניין שלך</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="actions-section">
          <h2 className="section-title">🚀 פעולות מהירות</h2>
          <div className="actions-grid">
            <button className="action-card" onClick={() => (window.location.href = "/favorites")}>
              <div className="action-icon">💖</div>
              <div className="action-content">
                <h3>רשימת ההשמעה שלי</h3>
                <p>{stats.totalLikedSongs} שירים מועדפים</p>
              </div>
            </button>

            <button className="action-card" onClick={() => (window.location.href = "/songs")}>
              <div className="action-icon">🎵</div>
              <div className="action-content">
                <h3>גלה שירים חדשים</h3>
                <p>עבור לספריית השירים</p>
              </div>
            </button>

            <button className="action-card" onClick={() => (window.location.href = "/creators")}>
              <div className="action-icon">🎤</div>
              <div className="action-content">
                <h3>זמרים מועדפים</h3>
                <p>גלה אמנים חדשים</p>
              </div>
            </button>

            <button className="action-card">
              <div className="action-icon">📊</div>
              <div className="action-content">
                <h3>סטטיסטיקות מפורטות</h3>
                <p>צפה בנתוני ההאזנה שלך</p>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-section">
          <h2 className="section-title">📈 פעילות אחרונה</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">💖</div>
              <div className="activity-content">
                <p>אהבת שיר חדש</p>
                <span className="activity-time">לפני 2 שעות</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">🎵</div>
              <div className="activity-content">
                <p>האזנת ל-5 שירים</p>
                <span className="activity-time">היום</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">🎤</div>
              <div className="activity-content">
                <p>גילית זמר חדש</p>
                <span className="activity-time">אתמול</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
