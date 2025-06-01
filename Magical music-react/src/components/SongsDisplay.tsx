"use client"

import type React from "react"
import { useEffect, useState, useRef, useMemo } from "react"
import SongCard from "./SongCard"
import MusicPlayer from "./MusicPlayer"
import SearchAndSort from "./SearchAndSort"

import "./styles/search-sort.css"
import "./styles/AllSongs.css"

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
  createdAt?: string
  updatedAt?: string
}

interface SongsDisplayProps {
  title: string
  subtitle: string
  apiEndpoint: string
  showLikes?: boolean
}

const SongsDisplay: React.FC<SongsDisplayProps> = ({ title, subtitle, apiEndpoint, showLikes = true }) => {
  const [songs, setSongs] = useState<Song[]>([])
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([])
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
  const [playerState, setPlayerState] = useState<"open" | "minimized" | "closed">("open")
  const [likedSongs, setLikedSongs] = useState<Set<number>>(new Set())

  // Search and Sort states
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const audioRef = useRef<HTMLAudioElement | null>(null)

  const currentSong = useMemo(() => {
    return currentSongIndex !== null && filteredSongs.length > 0 ? filteredSongs[currentSongIndex] : null
  }, [currentSongIndex, filteredSongs])

  // Load liked songs from localStorage
  useEffect(() => {
    const savedLikes = localStorage.getItem("likedSongs")
    if (savedLikes) {
      setLikedSongs(new Set(JSON.parse(savedLikes)))
    }
  }, [])

  // Filter and sort songs
  useEffect(() => {
    const filtered = songs.filter((song) => {
      const searchLower = searchTerm.toLowerCase()
      return (
        song.name.toLowerCase().includes(searchLower) ||
        song.artistName.toLowerCase().includes(searchLower) ||
        song.musicStyle.toLowerCase().includes(searchLower) ||
        song.description.toLowerCase().includes(searchLower)
      )
    })

    // Sort songs
    filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case "artist":
          aValue = a.artistName.toLowerCase()
          bValue = b.artistName.toLowerCase()
          break
        case "style":
          aValue = a.musicStyle.toLowerCase()
          bValue = b.musicStyle.toLowerCase()
          break
        case "duration":
          aValue = a.songLength
          bValue = b.songLength
          break
        case "created":
          aValue = new Date(a.createdAt || 0).getTime()
          bValue = new Date(b.createdAt || 0).getTime()
          break
        case "updated":
          aValue = new Date(a.updatedAt || 0).getTime()
          bValue = new Date(b.updatedAt || 0).getTime()
          break
        default:
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    setFilteredSongs(filtered)
  }, [songs, searchTerm, sortBy, sortOrder])

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoadingSongs(true)
        setErrorMessage(null)

        const response = await fetch(apiEndpoint)
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
  }, [apiEndpoint])

  useEffect(() => {
    if (currentSongIndex === null || filteredSongs.length === 0) return

    const loadAndPlaySong = async () => {
      const song = filteredSongs[currentSongIndex]
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
        audio.preload = "auto"

        audio.ontimeupdate = () => setCurrentTime(audio.currentTime)
        audio.onloadedmetadata = () => {
          setDuration(audio.duration)
          setIsLoading(false)
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
  }, [currentSongIndex, filteredSongs])

  const handleLike = (song: Song) => {
    const newLikedSongs = new Set(likedSongs)
    if (newLikedSongs.has(song.id)) {
      newLikedSongs.delete(song.id)
    } else {
      newLikedSongs.add(song.id)
    }
    setLikedSongs(newLikedSongs)
    localStorage.setItem("likedSongs", JSON.stringify(Array.from(newLikedSongs)))

    // Show notification
    const message = newLikedSongs.has(song.id) ? "השיר נוסף לרשימת ההשמעה האישית! 💖" : "השיר הוסר מרשימת ההשמעה האישית"

    // Create notification element
    const notification = document.createElement("div")
    notification.className = "like-notification"
    notification.textContent = message
    notification.style.cssText = `
      position: fixed;
      top: 120px;
      right: 20px;
      background: linear-gradient(135deg, #ec4899, #8b5cf6);
      color: white;
      padding: 1rem 2rem;
      border-radius: 25px;
      font-weight: 600;
      z-index: 10000;
      animation: slideInRight 0.5s ease-out;
      box-shadow: 0 10px 30px rgba(236, 72, 153, 0.4);
    `

    document.body.appendChild(notification)
    setTimeout(() => {
      notification.remove()
    }, 3000)
  }

  const handleRateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const rate = Number.parseFloat(e.target.value)
    setPlaybackRate(rate)
    if (audioRef.current) {
      audioRef.current.playbackRate = rate
    }
  }

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
    if (currentSongIndex === null || filteredSongs.length === 0) return
    const nextIndex = (currentSongIndex + 1) % filteredSongs.length
    setCurrentSongIndex(nextIndex)
  }

  const playPreviousSong = () => {
    if (currentSongIndex === null || filteredSongs.length === 0) return
    const prevIndex = (currentSongIndex - 1 + filteredSongs.length) % filteredSongs.length
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

  const handlePlayClick = (index: number) => {
    setPlayerState("open")

    if (currentSongIndex === index) {
      togglePlayPause()
    } else {
      setCurrentSongIndex(index)
    }
  }

  const retryLoadSongs = () => {
    window.location.reload()
  }

  const handlePlayerMinimize = () => {
    setPlayerState(playerState === "minimized" ? "open" : "minimized")
  }

  const handlePlayerClose = () => {
    setPlayerState("closed")
  }

  const sortOptions = [
    { value: "name", label: "שם השיר" },
    { value: "artist", label: "שם הזמר" },
    { value: "style", label: "ז'אנר" },
    { value: "duration", label: "משך השיר" },
    { value: "created", label: "תאריך יצירה" },
    { value: "updated", label: "תאריך עדכון" },
  ]

  return (
    <div className="songs-page">
      {/* Header */}
      <div className="songs-header">
        <h1 className="songs-title">
          <span className="gradient-text">{title}</span>
        </h1>
        <p className="songs-subtitle">{subtitle}</p>
      </div>

      {/* Search and Sort */}
      {!loadingSongs && !errorMessage && songs.length > 0 && (
        <SearchAndSort
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          searchPlaceholder="חיפוש לפי שם שיר, זמר או ז'אנר..."
          sortOptions={sortOptions}
        />
      )}

      {/* Results Info */}
      {!loadingSongs && !errorMessage && songs.length > 0 && (
        <div className="results-info">
          <p className="results-text">
            {searchTerm ? (
              <>
                נמצאו <span className="highlight">{filteredSongs.length}</span> שירים מתוך{" "}
                <span className="highlight">{songs.length}</span>
              </>
            ) : (
              <>
                סה"כ <span className="highlight">{songs.length}</span> שירים
              </>
            )}
          </p>
        </div>
      )}

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

      {/* No Results */}
      {!loadingSongs && !errorMessage && songs.length > 0 && filteredSongs.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem", color: "#d1d5db" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔍</div>
          <p>לא נמצאו שירים התואמים לחיפוש "{searchTerm}"</p>
          <button
            onClick={() => setSearchTerm("")}
            style={{
              background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
              border: "none",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "25px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "600",
              marginTop: "1rem",
            }}
          >
            נקה חיפוש
          </button>
        </div>
      )}

      {/* Songs Grid */}
      {!loadingSongs && !errorMessage && filteredSongs.length > 0 && (
        <div className="songs-container">
          {filteredSongs.map((song, index) => (
            <SongCard
              key={song.id}
              song={song}
              index={index}
              currentSongIndex={currentSongIndex}
              isPlaying={isPlaying}
              isLoading={isLoading}
              isLiked={likedSongs.has(song.id)}
              onPlayClick={handlePlayClick}
              onDownload={downloadSong}
              onLike={showLikes ? handleLike : undefined}
              formatTime={formatTime}
            />
          ))}
        </div>
      )}

      {/* Music Player */}
      {currentSong && playerState !== "closed" && (
        <MusicPlayer
          currentSong={currentSong}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          playbackRate={playbackRate}
          volume={volume}
          isLoading={isLoading}
          songError={songError}
          isMinimized={playerState === "minimized"}
          onTogglePlayPause={togglePlayPause}
          onPlayNext={playNextSong}
          onPlayPrevious={playPreviousSong}
          onSeek={handleSeek}
          onVolumeChange={handleVolumeChange}
          onRateChange={handleRateChange}
          onDownload={downloadSong}
          onMinimize={handlePlayerMinimize}
          onClose={handlePlayerClose}
          formatTime={formatTime}
        />
      )}
    </div>
  )
}

export default SongsDisplay
