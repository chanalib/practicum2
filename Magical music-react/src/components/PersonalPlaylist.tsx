"use client"

import type React from "react"
import { useEffect, useState } from "react"
import SongsDisplay from "./SongsDisplay"

const PersonalPlaylist: React.FC = () => {
  const [likedSongIds, setLikedSongIds] = useState<number[]>([])
  const [personalPlaylistEndpoint, setPersonalPlaylistEndpoint] = useState<string>("")

  useEffect(() => {
    // Load liked songs from localStorage
    const savedLikes = localStorage.getItem("likedSongs")
    if (savedLikes) {
      const likedIds = JSON.parse(savedLikes)
      setLikedSongIds(likedIds)

      // Create endpoint for personal playlist
      if (likedIds.length > 0) {
        const idsParam = likedIds.join(",")
        setPersonalPlaylistEndpoint(`https://localhost:7157/api/song/playlist?ids=${idsParam}`)
      }
    }
  }, [])

  if (likedSongIds.length === 0) {
    return (
      <div className="personal-playlist-empty">
        <div className="empty-container">
          <div className="empty-icon">💔</div>
          <h2 className="empty-title">רשימת ההשמעה האישית שלך ריקה</h2>
          <p className="empty-description">
            התחל לאהוב שירים כדי לבנות את רשימת ההשמעה האישית שלך!
            <br />
            לחץ על ❤️ ליד השירים שאתה אוהב והם יופיעו כאן.
          </p>
          <button className="browse-songs-btn" onClick={() => (window.location.href = "/songs")}>
            🎵 עבור לדף השירים
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="personal-playlist-page">
      <SongsDisplay
        title="   רשימת ההשמעה האישית שלי 💖 "
        subtitle={`${likedSongIds.length} שירים שאהבת - ההשמעה האישית שלך`}
        apiEndpoint={personalPlaylistEndpoint}
        showLikes={true}
      />
    </div>
  )
}

export default PersonalPlaylist
