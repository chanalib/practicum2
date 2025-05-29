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
    const validTypes = ["audio/mpeg", "audio/wav", "audio/mp4", "audio/ogg", "audio/flac", "audio/x-flac", "audio/m4a"]
    if (!validTypes.includes(selectedFile.type)) {
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
      formData.append("audioFile", file) // שים לב לשם הפרמטר - חייב להתאים לשם בפרמטר של ה-API: audioFile
      formData.append("language", "he") // שולח את השפה "he" לשרת

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

      const response = await fetch("https://localhost:7157/api/ai/upload", { method: "POST", body: formData })

      clearInterval(progressInterval)

      if (!response.ok) {
        const errText = await response.text()
        throw new Error(`שגיאה בתמלול: ${response.statusText} - ${errText}`)
      }

      const result = await response.json()
      setTranscription(result.text || result.Text || "")
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
      <div className="transcription-glass-effect"></div>

      <div className="transcription-content">
        <div className="transcription-header">
          <h1 className="transcription-title">תמלול שירים</h1>
          <div className="title-underline"></div>
          <p className="transcription-subtitle">תמלול מדויק באמצעות בינה מלאכותית</p>
        </div>

        <div className="transcription-card">
          <div
            className={`upload-area ${dragActive ? "drag-active" : ""} ${file ? "has-file" : ""}`}
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
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 12L12 16L16 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 8V16"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="upload-text">גרור קובץ שמע לכאן או לחץ לבחירה</p>
                <p className="upload-formats">MP3, WAV, M4A, OGG, FLAC | עד 25MB</p>
                <label htmlFor="audio-file-input" className="upload-button">
                  בחר קובץ
                </label>
              </div>
            ) : (
              <div className="file-info">
                <div className="file-preview">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M9 18V6L21 12L9 18Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 3V21"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="file-details">
                  <p className="file-name">{file.name}</p>
                  <p className="file-meta">{formatFileSize(file.size)}</p>
                </div>
                <button className="file-remove" onClick={handleClear} aria-label="הסר קובץ">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M18 6L6 18"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 6L18 18"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="error-message">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 8V12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 16H12.01"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="action-buttons">
            <button
              className={`primary-button ${isTranscribing ? "loading" : ""}`}
              onClick={handleTranscribe}
              disabled={!file || isTranscribing}
            >
              {isTranscribing ? (
                <>
                  <span className="spinner"></span>
                  <span>מתמלל...</span>
                </>
              ) : (
                <>
                  <span>התחל תמלול</span>
                </>
              )}
            </button>

            {file && !isTranscribing && (
              <button className="secondary-button" onClick={handleClear}>
                נקה
              </button>
            )}
          </div>

          {isTranscribing && (
            <div className="progress-container">
              <div className="progress-label">
                <span>מעבד את הקובץ</span>
                <span className="progress-percentage">{Math.round(progress)}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}
        </div>

        {transcription && (
          <div className="result-card">
            <div className="result-header">
              <h2>תוצאות התמלול</h2>
              <button
                className={`copy-button ${copied ? "copied" : ""}`}
                onClick={handleCopyToClipboard}
                aria-label="העתק לזיכרון"
              >
                {copied ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M20 6L9 17L4 12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>הועתק</span>
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M8 16H6C4.89543 16 4 15.1046 4 14V6C4 4.89543 4.89543 4 6 4H14C15.1046 4 16 4.89543 16 6V8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10 14V14C10 12.8954 10.8954 12 12 12H18C19.1046 12 20 12.8954 20 14V18C20 19.1046 19.1046 20 18 20H12C10.8954 20 10 19.1046 10 18V18"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>העתק</span>
                  </>
                )}
              </button>
            </div>

            <div className="result-content">
              <div className="lyrics-container">{transcription}</div>
            </div>

            <div className="result-footer">
              <div className="stats">
                <div className="stat-item">
                  <span className="stat-label">מילים</span>
                  <span className="stat-value">
                    {transcription.split(/\s+/).filter((word) => word.length > 0).length}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">תווים</span>
                  <span className="stat-value">{transcription.length}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TranscriptionPage
