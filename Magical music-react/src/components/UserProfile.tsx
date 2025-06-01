// import React, { useEffect, useState } from "react"

// interface UserStats {
//   totalLikedSongs: number
//   favoriteGenres: string[]
//   listeningTime: number
//   joinDate: string
//   lastActive: string
// }

// interface User {
//   id?: number
//   firstName?: string
//   lastName?: string
//   email?: string
//   avatar?: string
// }

// const UserProfile: React.FC = () => {
//   const [user, setUser] = useState<User | null>(null)
//   const [stats, setStats] = useState<UserStats | null>(null)
//   const [isEditing, setIsEditing] = useState(false)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     const loadUserData = async () => {
//       setLoading(true)
//       setError(null)
//       try {
//         const res = await fetch("https://localhost:7157/api/UserProfil")
//         if (!res.ok) throw new Error("שגיאה בשרת")
//         const data = await res.json()

//         setUser({
//           id: data.id,
//           firstName: data.firstName,
//           lastName: data.lastName,
//           email: data.email,
//           avatar: data.avatar,
//         })

//         setStats({
//           totalLikedSongs: data.totalLikedSongs ?? 0,
//           favoriteGenres: data.favoriteGenres ?? [],
//           listeningTime: data.listeningTime ?? 0,
//           joinDate: data.joinDate ?? "",
//           lastActive: data.lastActive ?? "",
//         })
//       } catch (err: any) {
//         console.error("שגיאה בטעינת נתוני המשתמש:", err)
//         setError("לא ניתן לטעון את נתוני המשתמש כעת")
//       } finally {
//         setLoading(false)
//       }
//     }

//     loadUserData()
//   }, [])
// // פונקציה לשמירת שינויים בפרופיל
// const handleSaveProfile = async () => {
//   if (!user) return
//   try {
//     const res = await fetch(`https://localhost:7157/api/UserProfil`, {

//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(user),
//     })
//     if (!res.ok) throw new Error("שגיאה בשמירה")
//     setIsEditing(false)
//   } catch (err) {
//     console.error("שגיאה בשמירת הפרופיל:", err)
//     alert("אירעה שגיאה בעת השמירה")
//   }
// }
// // פונקציה לפורמט זמן האזנה (בדקות)
// const formatListeningTime = (minutes: number): string => {
//   const hours = Math.floor(minutes / 60)
//   const mins = minutes % 60
//   return `${hours} שעות ו־${mins} דקות`
// }
// // פונקציה לפורמט תאריכים
// const formatDate = (dateString: string): string => {
//   const date = new Date(dateString)
//   return date.toLocaleDateString("he-IL", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   })
// }

//   if (loading) return <div>טוען נתונים...</div>
//   if (error) return <div>שגיאה: {error}</div>
//   if (!user || !stats) return <div>לא נמצאו נתוני משתמש</div>

//   // כאן שאר הקוד עם המשתמש והסטטיסטיקות

//   return (
//     <div className="user-profile-page">
//       <div className="profile-container">
//         {/* Profile Header */}
//         <div className="profile-header">
//           <div className="profile-avatar-section">
//             <div className="profile-avatar">
//               <span className="avatar-text">
//                 {user.firstName?.charAt(0)}
//                 {user.lastName?.charAt(0)}
//               </span>
//               <div className="avatar-glow"></div>
//             </div>
//             <button className="change-avatar-btn">📷 שנה תמונה</button>
//           </div>

//           <div className="profile-info">
//             {isEditing ? (
//               <div className="edit-form">
//                 <input
//                   type="text"
//                   value={user.firstName}
//                   onChange={(e) => setUser({ ...user, firstName: e.target.value })}
//                   placeholder="שם פרטי"
//                   className="edit-input"
//                 />
//                 <input
//                   type="text"
//                   value={user.lastName}
//                   onChange={(e) => setUser({ ...user, lastName: e.target.value })}
//                   placeholder="שם משפחה"
//                   className="edit-input"
//                 />
//                 <input
//                   type="email"
//                   value={user.email}
//                   onChange={(e) => setUser({ ...user, email: e.target.value })}
//                   placeholder="אימייל"
//                   className="edit-input"
//                 />
//                 <div className="edit-actions">
//                   <button className="save-btn" onClick={handleSaveProfile}>
//                     💾 שמור
//                   </button>
//                   <button className="cancel-btn" onClick={() => setIsEditing(false)}>
//                     ❌ ביטול
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <div className="profile-display">
//                 <h1 className="profile-name">
//                   {user.firstName} {user.lastName}
//                 </h1>
//                 <p className="profile-email">{user.email}</p>
//                 <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
//                   ✏️ ערוך פרופיל
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="stats-grid">
//           <div className="stat-card">
//             <div className="stat-icon">💖</div>
//             <div className="stat-content">
//               <h3 className="stat-number">{stats.totalLikedSongs}</h3>
//               <p className="stat-label">שירים מועדפים</p>
//             </div>
//           </div>

//           <div className="stat-card">
//             <div className="stat-icon">🎵</div>
//             <div className="stat-content">
//               <h3 className="stat-number">{formatListeningTime(stats.listeningTime)}</h3>
//               <p className="stat-label">זמן האזנה</p>
//             </div>
//           </div>

//           <div className="stat-card">
//             <div className="stat-icon">📅</div>
//             <div className="stat-content">
//               <h3 className="stat-number">{formatDate(stats.joinDate)}</h3>
//               <p className="stat-label">תאריך הצטרפות</p>
//             </div>
//           </div>

//           <div className="stat-card">
//             <div className="stat-icon">⏰</div>
//             <div className="stat-content">
//               <h3 className="stat-number">{formatDate(stats.lastActive)}</h3>
//               <p className="stat-label">פעילות אחרונה</p>
//             </div>
//           </div>
//         </div>

//         {/* Music Preferences */}
//         <div className="preferences-section">
//           <h2 className="section-title">🎼 תחומי העניין המוזיקליים שלך</h2>
//           <div className="genres-container">
//             {stats.favoriteGenres.length > 0 ? (
//               stats.favoriteGenres.map((genre, index) => (
//                 <div key={index} className="genre-tag">
//                   {genre}
//                 </div>
//               ))
//             ) : (
//               <p className="no-genres">התחל לאהוב שירים כדי לגלות את תחומי העניין שלך</p>
//             )}
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="actions-section">
//           <h2 className="section-title">🚀 פעולות מהירות</h2>
//           <div className="actions-grid">
//             <button className="action-card" onClick={() => (window.location.href = "/personal-playlist")}>
//               <div className="action-icon">💖</div>
//               <div className="action-content">
//                 <h3>רשימת ההשמעה שלי</h3>
//                 <p>{stats.totalLikedSongs} שירים מועדפים</p>
//               </div>
//             </button>

//             <button className="action-card" onClick={() => (window.location.href = "/songs")}>
//               <div className="action-icon">🎵</div>
//               <div className="action-content">
//                 <h3>גלה שירים חדשים</h3>
//                 <p>עבור לספריית השירים</p>
//               </div>
//             </button>

//             <button className="action-card" onClick={() => (window.location.href = "/artists")}>
//               <div className="action-icon">🎤</div>
//               <div className="action-content">
//                 <h3>זמרים מועדפים</h3>
//                 <p>גלה אמנים חדשים</p>
//               </div>
//             </button>

//             <button className="action-card">
//               <div className="action-icon">📊</div>
//               <div className="action-content">
//                 <h3>סטטיסטיקות מפורטות</h3>
//                 <p>צפה בנתוני ההאזנה שלך</p>
//               </div>
//             </button>
//           </div>
//         </div>

//         {/* Recent Activity */}
//         <div className="activity-section">
//           <h2 className="section-title">📈 פעילות אחרונה</h2>
//           <div className="activity-list">
//             <div className="activity-item">
//               <div className="activity-icon">💖</div>
//               <div className="activity-content">
//                 <p>אהבת שיר חדש</p>
//                 <span className="activity-time">לפני 2 שעות</span>
//               </div>
//             </div>
//             <div className="activity-item">
//               <div className="activity-icon">🎵</div>
//               <div className="activity-content">
//                 <p>האזנת ל-5 שירים</p>
//                 <span className="activity-time">היום</span>
//               </div>
//             </div>
//             <div className="activity-item">
//               <div className="activity-icon">🎤</div>
//               <div className="activity-content">
//                 <p>גילית זמר חדש</p>
//                 <span className="activity-time">אתמול</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default UserProfile
