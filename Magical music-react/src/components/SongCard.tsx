"use client"

import type React from "react"
import { useState } from "react"

interface Song {
  id: number
  name: string
  musicStyle: string
  songLength: number
  creatorId: number
  S3Url: string
  key: string
  artistName: string
  description: string
}

interface SongCardProps {
  song: Song
  index: number
  currentSongIndex: number | null
  isPlaying: boolean
  isLoading: boolean
  isLiked?: boolean
  onPlayClick: (index: number) => void
  onDownload: (song: Song) => void
  onLike?: (song: Song) => void
  formatTime: (seconds: number) => string
}

const SongCard: React.FC<SongCardProps> = ({
  song,
  index,
  currentSongIndex,
  isPlaying,
  isLoading,
  isLiked = false,
  onPlayClick,
  onDownload,
  onLike,
  formatTime,
}) => {
  const [likeAnimation, setLikeAnimation] = useState(false)

  const handleLikeClick = () => {
    if (onLike) {
      setLikeAnimation(true)
      onLike(song)
      setTimeout(() => setLikeAnimation(false), 1000)
    }
  }

  return (
    <div
      className={`song-card ${currentSongIndex === index ? "playing" : ""}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="song-artwork">
        <div className="artwork-placeholder">
          <span className="music-note">🎵</span>
        </div>
        {currentSongIndex === index && isPlaying && (
          <div className="playing-indicator">
            <div className="wave-animation">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>

      <div className="song-info">
        <h3 className="song-title">{song.name}</h3>
        <p className="song-artist">{song.artistName}</p>
        <p className="song-style">{song.musicStyle}</p>
        <p className="song-description">{song.description}</p>
        <p className="song-duration">{formatTime(song.songLength)}</p>
      </div>

      <div className="song-actions">
        <button
          className={`play-btn ${currentSongIndex === index && isPlaying ? "playing" : ""}`}
          onClick={() => onPlayClick(index)}
          disabled={isLoading && currentSongIndex === index}
        >
          {currentSongIndex === index && isLoading ? "⏳" : currentSongIndex === index && isPlaying ? "⏸️" : "▶️"}
        </button>
        <button className="download-btn" onClick={() => onDownload(song)}>
          📥
        </button>
        {onLike && (
          <button
            className={`favorite-btn ${isLiked ? "liked" : ""} ${likeAnimation ? "animate" : ""}`}
            onClick={handleLikeClick}
          >
            {isLiked ? "❤️" : "🤍"}
            {likeAnimation && (
              <div className="like-particles">
                <span className="particle">💖</span>
                <span className="particle">✨</span>
                <span className="particle">💫</span>
                <span className="particle">⭐</span>
              </div>
            )}
          </button>
        )}
      </div>

      <div className="song-glow"></div>
    </div>
  )
}

export default SongCard
