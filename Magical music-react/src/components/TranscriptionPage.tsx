"use client"
import "./transcription.css"
import type React from "react"
import { useState, useRef, useCallback } from "react"

const TranscriptionPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false)
  const [transcription, setTranscription] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [copied, setCopied] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [dragActive, setDragActive] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
 
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      handleFileSelection(selectedFile)
    }
  }

  const handleFileSelection = (selectedFile: File) => {
    // בדיקת סוג הקובץ
    const validTypes = ["audio/mpeg", "audio/wav", "audio/mp4", "audio/ogg", "audio/flac", "audio/m4a"]
    if (!validTypes.some((type) => selectedFile.type.includes(type.split("/")[1]))) {
      setError("סוג קובץ לא נתמך. אנא העלה קובץ מסוג MP3, WAV, M4A, OGG או FLAC.")
      return
    }

    // בדיקת גודל הקובץ (מקסימום 25MB)
    if (selectedFile.size > 25 * 1024 * 1024) {
      setError("גודל הקובץ חורג מ-25MB. אנא העלה קובץ קטן יותר.")
      return
    }

    setFile(selectedFile)
    setError("")
    setTranscription("")
    setProgress(0)
  }

  const handleTranscribe = async () => {
    if (!file) {
      setError("אנא בחר קובץ שמע לתמלול")
      return
    }

    setIsTranscribing(true)
    setError("")
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append("file", file)

      // סימולציה של התקדמות
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + Math.random() * 10
        })
      }, 500)

      const response = await fetch("https://singlezone-net.onrender.com/api/transcription/transcribe-full", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        throw new Error(`שגיאה בתמלול: ${response.statusText}`)
      }

      const result = await response.json()
      setTranscription(result.text)
      setProgress(100)
    } catch (error: any) {
      console.error("שגיאה בתמלול:", error)
      setError("אירעה שגיאה בתמלול הקובץ. אנא נסה שוב מאוחר יותר.")
      setProgress(0)
    } finally {
      setIsTranscribing(false)
    }
  }

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(transcription)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Error copying to clipboard:", error)
    }
  }

  const handleClear = () => {
    setFile(null)
    setTranscription("")
    setError("")
    setProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="transcription-container">
      {/* Header */}
      <div className="transcription-header">
        <div className="header-content">
          <h1 className="transcription-title">
            <span className="gradient-text">🎤 תמלול שירים חכם</span>
          </h1>
          <p className="transcription-subtitle">טכנולוגיית בינה מלאכותית מתקדמת לתמלול מדויק של מילות השיר</p>
        </div>
        <div className="floating-elements">
          <div className="floating-note note-1">🎵</div>
          <div className="floating-note note-2">🎶</div>
          <div className="floating-note note-3">🎼</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="transcription-content">
        {/* Upload Section */}
        <div className="upload-section">
          <div
            className={`upload-zone ${dragActive ? "drag-active" : ""} ${file ? "has-file" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="audio/mpeg,audio/wav,audio/mp4,audio/ogg,audio/flac,audio/m4a"
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="audio-file-input"
              ref={fileInputRef}
            />

            {!file ? (
              <div className="upload-placeholder">
                <div className="upload-icon">
                  <div className="icon-circle">
                    <span>🎧</span>
                  </div>
                  <div className="upload-waves">
                    <div className="wave wave-1"></div>
                    <div className="wave wave-2"></div>
                    <div className="wave wave-3"></div>
                  </div>
                </div>
                <h3>גרור קובץ שמע לכאן או לחץ לבחירה</h3>
                <p>תומך בפורמטים: MP3, WAV, M4A, OGG, FLAC</p>
                <p>גודל מקסימלי: 25MB</p>
                <label htmlFor="audio-file-input" className="upload-button">
                  📁 בחר קובץ
                </label>
              </div>
            ) : (
              <div className="file-info">
                <div className="file-icon">🎵</div>
                <div className="file-details">
                  <h3 className="file-name">{file.name}</h3>
                  <p className="file-size">{formatFileSize(file.size)}</p>
                  <div className="file-type">{file.type}</div>
                </div>
                <button className="remove-file" onClick={handleClear}>
                  ❌
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="controls-section">
          <button
            className={`transcribe-button ${isTranscribing ? "loading" : ""}`}
            onClick={handleTranscribe}
            disabled={!file || isTranscribing}
          >
            {isTranscribing ? (
              <>
                <div className="loading-spinner"></div>
                <span>מתמלל...</span>
              </>
            ) : (
              <>
                <span className="button-icon">🚀</span>
                <span>התחל תמלול</span>
              </>
            )}
          </button>

          {file && !isTranscribing && (
            <button className="clear-button" onClick={handleClear}>
              <span className="button-icon">🗑️</span>
              <span>נקה הכל</span>
            </button>
          )}
        </div>

        {/* Progress */}
        {isTranscribing && (
          <div className="progress-section">
            <div className="progress-info">
              <span>מתמלל את הקובץ...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        {/* Results */}
        {transcription && (
          <div className="results-section">
            <div className="results-header">
              <h3>
                <span className="results-icon">📝</span>
                תוצאות התמלול
              </h3>
              <div className="results-actions">
                <button className={`copy-button ${copied ? "copied" : ""}`} onClick={handleCopyToClipboard}>
                  {copied ? (
                    <>
                      <span>✅</span>
                      <span>הועתק!</span>
                    </>
                  ) : (
                    <>
                      <span>📋</span>
                      <span>העתק</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="transcription-output">
              <div className="output-content">{transcription}</div>
            </div>

            <div className="results-footer">
              <div className="word-count">
                מילים: {transcription.split(/\s+/).filter((word) => word.length > 0).length}
              </div>
              <div className="char-count">תווים: {transcription.length}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TranscriptionPage
