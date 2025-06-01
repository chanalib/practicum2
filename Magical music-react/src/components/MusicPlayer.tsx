"use client"

import type React from "react"

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
  currentSong: Song
  isPlaying: boolean
  currentTime: number
  duration: number
  playbackRate: number
  volume: number
  isLoading: boolean
  songError: string | null
  isMinimized: boolean
  onTogglePlayPause: () => void
  onPlayNext: () => void
  onPlayPrevious: () => void
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRateChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onDownload: (song: Song) => void
  onMinimize: () => void
  onClose: () => void
  formatTime: (seconds: number) => string
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentSong,
  isPlaying,
  currentTime,
  duration,
  playbackRate,
  volume,
  isLoading,
  songError,
  isMinimized,
  onTogglePlayPause,
  onPlayNext,
  onPlayPrevious,
  onSeek,
  onVolumeChange,
  onRateChange,
  onDownload,
  onMinimize,
  onClose,
  formatTime,
}) => {
  // הסר את ה-state הפנימי
  // const [isMinimized, setIsMinimized] = useState(false)
  // const [isClosed, setIsClosed] = useState(false)

  // if (isClosed) return null

  return (
    <div className={`music-player ${isMinimized ? "minimized" : ""}`}>
      <div className="player-container">
        {/* Player Controls */}
        <div className="player-header">
          <div className="player-actions">
            <button className="minimize-btn" onClick={onMinimize} title={isMinimized ? "הרחב" : "מזער"}>
              {isMinimized ? "⬆️" : "⬇️"}
            </button>
            <button className="close-btn" onClick={onClose} title="סגור נגן">
              ✕
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Song Info Section */}
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
                <h4 className="player-song-title">{currentSong.name}</h4>
                <p className="player-artist">{currentSong.artistName}</p>
                <p className="player-style">{currentSong.musicStyle}</p>
              </div>
            </div>

            {/* Controls Section */}
            <div className="player-controls">
              <div className="main-controls">
                <button className="control-btn prev" onClick={onPlayPrevious} title="הקודם">
                  ⏮️
                </button>
                <button
                  className={`control-btn play-pause ${isLoading ? "loading" : ""}`}
                  onClick={onTogglePlayPause}
                  disabled={isLoading}
                  title={isPlaying ? "השהה" : "נגן"}
                >
                  {isLoading ? "⏳" : isPlaying ? "⏸️" : "▶️"}
                </button>
                <button className="control-btn next" onClick={onPlayNext} title="הבא">
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
                    onChange={onSeek}
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
                  max="1"
                  min="0"
                  step="0.1"
                  value={volume}
                  onChange={onVolumeChange}
                  className="volume-slider"
                />
                <span className="volume-icon">🔊</span>
              </div>

              <div className="speed-control">
                <label htmlFor="playbackRate">מהירות:</label>
                <select id="playbackRate" value={playbackRate} onChange={onRateChange} className="speed-select">
                  <option value="0.5">0.5x</option>
                  <option value="0.75">0.75x</option>
                  <option value="1">1x</option>
                  <option value="1.25">1.25x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2">2x</option>
                </select>
              </div>

              <div className="extra-actions">
                <button className="action-btn" onClick={() => onDownload(currentSong)} title="הורד">
                  📥
                </button>
                <button className="action-btn" title="שתף">
                  📤
                </button>
            
              </div>
            </div>
          </>
        )}

        {/* Minimized View */}
        {isMinimized && (
          <div className="minimized-player">
            <div className="mini-song-info">
              <span className="mini-title">{currentSong.name}</span>
              <span className="mini-artist">{currentSong.artistName}</span>
            </div>
            <div className="mini-controls">
              <button className="mini-btn" onClick={onPlayPrevious}>
                ⏮️
              </button>
              <button className="mini-btn play-pause" onClick={onTogglePlayPause}>
                {isLoading ? "⏳" : isPlaying ? "⏸️" : "▶️"}
              </button>
              <button className="mini-btn" onClick={onPlayNext}>
                ⏭️
              </button>
            </div>
          </div>
        )}

        {/* Song Error Display */}
        {songError && <div className="song-error">{songError}</div>}
      </div>
    </div>
  )
}

export default MusicPlayer
