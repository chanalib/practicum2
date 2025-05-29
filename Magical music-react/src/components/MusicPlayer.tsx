import React, { useEffect, useRef, useState } from "react"
import "./Music-player.css"
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

interface MusicPlayerProps {
  song: Song
  playbackRate: number
  volume: number
  onPlaybackRateChange: (rate: number) => void
  onVolumeChange: (vol: number) => void
  onNext: () => void
  onPrevious: () => void
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  song,
  playbackRate,
  volume,
  onPlaybackRateChange,
  onVolumeChange,
  onNext,
  onPrevious,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [songError, setSongError] = useState<string | null>(null)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isClosed, setIsClosed] = useState(false)

  useEffect(() => {
    if (isClosed) return

    const loadAndPlaySong = async () => {
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
            .then(() => setIsPlaying(true))
            .catch((error) => {
              setSongError("שגיאה בהפעלת השיר")
              console.error("Auto-play error:", error)
            })
        }
        audio.oncanplaythrough = () => setIsLoading(false)
        audio.onended = () => {
          setIsPlaying(false)
          onNext()
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
  }, [song, playbackRate, volume, onNext, isClosed])

  const togglePlayPause = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => {
          setSongError("שגיאה בהפעלת השיר")
          console.error("Play error:", error)
        })
    }
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

  const toggleMinimize = () => setIsMinimized(!isMinimized)
  const closePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setIsPlaying(false)
    setIsClosed(true)
  }

  if (isClosed) return null

  return (
    <div className={`music-player ${isMinimized ? "minimized" : ""}`}>
      <div className="player-actions-top">
        <button className="minimize-btn" onClick={toggleMinimize} title="מזער">
          {isMinimized ? "🔼" : "🔽"}
        </button>
        <button className="close-btn" onClick={closePlayer} title="סגור">
          ❌
        </button>
      </div>

      <div className="player-container">
        <div className="player-song-info">
          <div className="player-artwork">
            <div className="artwork-placeholder">
              <span className="music-note">🎵</span>
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
            <h4 className="player-song-title">{song.name}</h4>
            <p className="player-artist">{song.artistName}</p>
            <p className="player-style">{song.musicStyle}</p>
          </div>
        </div>

        <div className="player-controls">
          <div className="main-controls">
            <button className="control-btn prev" onClick={onPrevious} title="הקודם">⏮️</button>
            <button className={`control-btn play-pause ${isLoading ? "loading" : ""}`} onClick={togglePlayPause} disabled={isLoading}>
              {isLoading ? "⏳" : isPlaying ? "⏸️" : "▶️"}
            </button>
            <button className="control-btn next" onClick={onNext} title="הבא">⏭️</button>
          </div>

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
              <div className="progress-fill" style={{ width: duration ? `${(currentTime / duration) * 100}%` : "0%" }}></div>
            </div>
            <span className="time-display duration">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="player-extras">
          <div className="volume-control">
            <span className="volume-icon">🔊</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="volume-slider"
            />
          </div>

          <div className="speed-control">
            <label htmlFor="playbackRate">מהירות:</label>
            <select
              id="playbackRate"
              value={playbackRate}
              onChange={(e) => onPlaybackRateChange(Number(e.target.value))}
              className="speed-select"
            >
              <option value="0.5">0.5x</option>
              <option value="0.75">0.75x</option>
              <option value="1">1x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
            </select>
          </div>
        </div>

        {songError && <div className="song-error">{songError}</div>}
      </div>
    </div>
  )
}

export default MusicPlayer
