"use client"
import "./AllSongs.css"
"use client"

import type React from "react"
import { useEffect, useState, useRef, useMemo } from "react"

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

const AllSongs = () => {
  const [songs, setSongs] = useState<Song[]>([])
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [volume, setVolume] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [songError, setSongError] = useState<string | null>(null)
  const [loadingSongs, setLoadingSongs] = useState(true)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  const currentSong = useMemo(() => {
    return currentSongIndex !== null && songs.length > 0 ? songs[currentSongIndex] : null
  }, [currentSongIndex, songs])

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoadingSongs(true)
        setErrorMessage(null)

        const response = await fetch("https://localhost:7157/api/song")
        if (!response.ok) {
          throw new Error(`שגיאה בטעינת השירים: ${response.status} ${response.statusText}`)
        }

        const data: Song[] = await response.json()

        if (!Array.isArray(data)) {
          throw new Error("פורמט נתונים לא תקין מהשרת")
        }

        setSongs(data)

        if (data.length === 0) {
          setErrorMessage("אין שירים זמינים כרגע")
        }
      } catch (error: any) {
        console.error("Error fetching songs:", error)
        setErrorMessage(error.message || "לא ניתן לטעון את רשימת השירים. אנא בדוק את החיבור לאינטרנט ונסה שוב.")
        setSongs([])
      } finally {
        setLoadingSongs(false)
      }
    }

    fetchSongs()

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (currentSongIndex === null || songs.length === 0) return

    const loadAndPlaySong = async () => {
      const song = songs[currentSongIndex]
      setIsLoading(true)
      setSongError(null)

      try {
        const response = await fetch(`https://localhost:7157/api/s3/presigned-url?key=${encodeURIComponent(song.key)}`)

        if (!response.ok) {
          throw new Error(`שגיאה בקבלת קישור לשיר: ${response.status} ${response.statusText}`)
        }

        const url = await response.text()

        if (!url || url.trim() === "") {
          throw new Error("לא התקבל קישור תקין לשיר")
        }

        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.src = ""
        }

        const audio = new Audio(url)
        audio.playbackRate = playbackRate
        audio.volume = volume
        audio.preload = "auto" // טעינה מיידית

        audio.ontimeupdate = () => setCurrentTime(audio.currentTime)
        audio.onloadedmetadata = () => {
          setDuration(audio.duration)
          setIsLoading(false)
          // ניגון מיידי ברגע שהמטאדטה נטענת
          audio
            .play()
            .then(() => {
              setIsPlaying(true)
            })
            .catch((error) => {
              setSongError("שגיאה בהפעלת השיר")
              console.error("Auto-play error:", error)
            })
        }
        audio.oncanplaythrough = () => {
          // ברגע שהשיר מוכן לניגון מלא
          setIsLoading(false)
        }
        audio.onended = () => {
          setIsPlaying(false)
          playNextSong()
        }
        audio.onerror = (e) => {
          setIsLoading(false)
          setSongError("שגיאה בניגון השיר. ייתכן שהקובץ לא קיים או פגום.")
          setIsPlaying(false)
          console.error("Audio playback error:", e)
        }

        audioRef.current = audio
      } catch (error: any) {
        setIsLoading(false)
        setSongError(error.message || "שגיאה לא צפויה בטעינת השיר")
        setIsPlaying(false)
        console.error("Song loading error:", error)
      }
    }

    loadAndPlaySong()

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [currentSongIndex, songs]) // הסרת playbackRate ו-volume מהתלויות

  // פונקציה לשינוי מהירות תוך כדי ניגון
  const handleRateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const rate = Number.parseFloat(e.target.value)
    setPlaybackRate(rate)
    if (audioRef.current) {
      audioRef.current.playbackRate = rate
    }
  }

  // פונקציה לשינוי ווליום תוך כדי ניגון
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = Number.parseFloat(e.target.value)
    setVolume(vol)
    if (audioRef.current) {
      audioRef.current.volume = vol
    }
  }

  const togglePlayPause = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().catch((error) => {
        setSongError("שגיאה בהפעלת השיר")
        console.error("Play error:", error)
      })
      setIsPlaying(true)
    }
  }

  const playNextSong = () => {
    if (currentSongIndex === null || songs.length === 0) return
    const nextIndex = (currentSongIndex + 1) % songs.length
    setCurrentSongIndex(nextIndex)
  }

  const playPreviousSong = () => {
    if (currentSongIndex === null || songs.length === 0) return
    const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length
    setCurrentSongIndex(prevIndex)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number.parseFloat(e.target.value)
    if (audioRef.current && !isNaN(time)) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || !isFinite(seconds)) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const downloadSong = async (song: Song) => {
    try {
      const urlResponse = await fetch(
        `https://localhost:7157/api/s3/presigned-url?key=${encodeURIComponent(song.key)}&download=true`,
      )

      if (!urlResponse.ok) {
        throw new Error(`שגיאה בקבלת קישור הורדה: ${urlResponse.status}`)
      }

      const url = await urlResponse.text()

      if (!url || url.trim() === "") {
        throw new Error("לא התקבל קישור תקין להורדה")
      }

      const link = document.createElement("a")
      link.href = url
      link.download = song.key.split("/").pop() || `${song.name}.mp3`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error: any) {
      alert(error.message || "לא ניתן להוריד את השיר כרגע. אנא נסה שוב מאוחר יותר.")
      console.error("Download error:", error)
    }
  }

  const retryLoadSongs = () => {
    window.location.reload()
  }

  return (
    <div className="songs-page">
      {/* Header */}
      <div className="songs-header">
        <h1 className="songs-title">
          <span className="gradient-text">ספריית השירים</span>
        </h1>
        <p className="songs-subtitle">גלו את השירים הטובים ביותר במקום אחד</p>
      </div>

      {/* Loading State */}
      {loadingSongs && (
        <div style={{ textAlign: "center", padding: "3rem", color: "#d1d5db" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
          <p>טוען שירים...</p>
        </div>
      )}

      {/* Error State */}
      {errorMessage && !loadingSongs && (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "20px",
            margin: "2rem",
            color: "#fca5a5",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>❌</div>
          <p style={{ marginBottom: "1rem" }}>{errorMessage}</p>
          <button
            onClick={retryLoadSongs}
            style={{
              background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
              border: "none",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "25px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "600",
            }}
          >
            נסה שוב
          </button>
        </div>
      )}

      {/* Songs Grid */}
      {!loadingSongs && !errorMessage && songs.length > 0 && (
        <div className="songs-container">
          {songs.map((song, index) => (
            <div
              key={song.id}
              className={`song-card ${currentSongIndex === index ? "playing" : ""}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="song-artwork">
                <div className="artwork-placeholder">
                  <span className="music-note"></span>
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
  onClick={() => {
    if (currentSongIndex === index) {
      togglePlayPause()
    } else {
      setCurrentSongIndex(index)
    }
  }}
  disabled={isLoading && currentSongIndex === index}
>
  {currentSongIndex === index && isLoading ? "⏳" : currentSongIndex === index && isPlaying ? "⏸️" : "▶️"}
</button>

                <button className="download-btn" onClick={() => downloadSong(song)}>
                  📥
                </button>
                <button className="favorite-btn">❤️</button>
              </div>

              <div className="song-glow"></div>
            </div>
          ))}
        </div>
      )}

      {/* Enhanced Music Player */}
      {currentSong && (
        <div className="music-player">
          <div className="player-container">
            {/* Song Info Section */}
            <div className="player-song-info">
              <div className="player-artwork">
                <div className="artwork-placeholder">
                  <span className="music-note"></span>
                </div>
                {isPlaying && (
                  <div className="playing-overlay">
                    <div className="equalizer">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
              </div>
              <div className="song-details">
                <h4 className="player-song-title">{currentSong.name}</h4>
                <p className="player-artist">{currentSong.artistName}</p>
                <p className="player-style">{currentSong.musicStyle}</p>
              </div>
            </div>

            {/* Controls Section */}
            <div className="player-controls">
              <div className="main-controls">
                <button className="control-btn prev" onClick={playPreviousSong} title="הקודם">
                  ⏮️
                </button>
                <button
                  className={`control-btn play-pause ${isLoading ? "loading" : ""}`}
                  onClick={togglePlayPause}
                  disabled={isLoading}
                  title={isPlaying ? "השהה" : "נגן"}
                >
                  {isLoading ? "⏳" : isPlaying ? "⏸️" : "▶️"}
                </button>
                <button className="control-btn next" onClick={playNextSong} title="הבא">
                  ⏭️
                </button>
              </div>

              {/* Progress Bar */}
              <div className="progress-section">
                <span className="time-display current">{formatTime(currentTime)}</span>
                <div className="progress-container">
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="progress-bar"
                    disabled={!duration}
                  />
                  <div
                    className="progress-fill"
                    style={{ width: duration ? `${(currentTime / duration) * 100}%` : "0%" }}
                  ></div>
                </div>
                <span className="time-display duration">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Additional Controls */}
            <div className="player-extras">
              <div className="volume-control">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                />
                <span className="volume-icon">🔊</span>
              </div>

              <div className="speed-control">
                <label htmlFor="playbackRate">מהירות:</label>
                <select id="playbackRate" value={playbackRate} onChange={handleRateChange} className="speed-select">
                  <option value="0.5">0.5x</option>
                  <option value="0.75">0.75x</option>
                  <option value="1">1x</option>
                  <option value="1.25">1.25x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2">2x</option>
                </select>
              </div>

              <div className="extra-actions">
                <button className="action-btn" onClick={() => downloadSong(currentSong)} title="הורד">
                  📥
                </button>
                <button className="action-btn" title="שתף">
                  📤
                </button>
                <button className="action-btn" title="הוסף לפלייליסט">
                  ➕
                </button>
              </div>
            </div>
          </div>

          {/* Song Error Display */}
          {songError && (
            <div
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#fca5a5",
                padding: "1rem",
                borderRadius: "10px",
                textAlign: "center",
                margin: "1rem 0",
              }}
            >
              {songError}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AllSongs
