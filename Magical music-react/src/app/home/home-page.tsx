"use client"

import { useState } from "react"
import { useNavigate } from 'react-router-dom'; // עדכון כאן
import { MusicBackgroundAnimation } from "../../components/music-background-animation"
import { MusicNavbar } from "../../components/music-navbar"
import { MusicSearchBar } from "../../components/music-search-bar"
import { MusicTrackGrid } from "../../components/music-track-grid"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate(); // עדכון כאן

  const handleSearch = (query: string) => {
    // In a real app, you would search for songs here
    console.log("Searching for:", query)
    setSearchQuery(query)
  }

  const handleLogout = () => {
    navigate("/"); // שימוש נכון בניווט
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background animated elements */}
      <MusicBackgroundAnimation />

      {/* Navigation */}
      <MusicNavbar onLogout={handleLogout} />

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
            ברוכים הבאים ל-Magical Music
          </h1>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed" dir="rtl">
            גלו עולם של צלילים קסומים באתר המוזיקה היוקרתי שלנו. Magical Music מציע לכם חוויה מוזיקלית ייחודית עם אוסף
            עשיר של יצירות מכל הז׳אנרים והתקופות. חפשו את השירים האהובים עליכם, גלו אמנים חדשים, וצרו פלייליסטים מותאמים
            אישית. המסע המוזיקלי שלכם מתחיל כאן.
          </p>

          <MusicSearchBar onSearch={handleSearch} />
        </div>

        {/* Track grid */}
        <MusicTrackGrid />
      </main>
    </div>
  )
}
