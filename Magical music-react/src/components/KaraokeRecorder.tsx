"use client"

import React from "react"
import { useRef, useState } from "react"
import "./Styles/karaoke.css"
const KaraokeRecorder: React.FC = () => {
  const audioContext = useRef<AudioContext | null>(null)
  const sourceMic = useRef<MediaStreamAudioSourceNode | null>(null)
  const sourceSong = useRef<AudioBufferSourceNode | null>(null)
  const destination = useRef<MediaStreamAudioDestinationNode | null>(null)
  const mediaRecorder = useRef<MediaRecorder | null>(null)

  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [recording, setRecording] = useState(false)
  const [songBuffer, setSongBuffer] = useState<AudioBuffer | null>(null)
  const [loadingSong, setLoadingSong] = useState(false)
  const [songName, setSongName] = useState<string>("")

  const loadSongBuffer = (file: File) => {
    setLoadingSong(true)
    setSongName(file.name)
    const reader = new FileReader()
    reader.onload = async () => {
      if (!audioContext.current) {
        audioContext.current = new AudioContext()
      }
      const arrayBuffer = reader.result as ArrayBuffer
      try {
        const buffer = await audioContext.current.decodeAudioData(arrayBuffer)
        setSongBuffer(buffer)
      } catch (e) {
        alert("שגיאה בטעינת השיר")
      } finally {
        setLoadingSong(false)
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const handleSongUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setAudioURL(null)
      loadSongBuffer(file)
    }
  }

  const startRecording = async () => {
    if (!songBuffer) {
      alert("נא להעלות שיר לפני ההקלטה")
      return
    }

    if (!audioContext.current) {
      audioContext.current = new AudioContext()
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

    sourceMic.current = audioContext.current.createMediaStreamSource(stream)
    destination.current = audioContext.current.createMediaStreamDestination()
    sourceSong.current = audioContext.current.createBufferSource()
    sourceSong.current.buffer = songBuffer

    sourceMic.current.connect(destination.current)
    sourceMic.current.connect(audioContext.current.destination)
    sourceSong.current.connect(destination.current)
    sourceSong.current.connect(audioContext.current.destination)

    sourceSong.current.start()

    mediaRecorder.current = new MediaRecorder(destination.current.stream)
    const chunks: BlobPart[] = []
    mediaRecorder.current.ondataavailable = (e) => {
      chunks.push(e.data)
    }
    mediaRecorder.current.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" })
      const url = URL.createObjectURL(blob)
      setAudioURL(url)
      setRecording(false)

      stream.getTracks().forEach((t) => t.stop())
      sourceSong.current?.disconnect()
      sourceMic.current?.disconnect()
      destination.current?.disconnect()
    }

    mediaRecorder.current.start()
    setRecording(true)
  }

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop()
    }
  }

  return (
    <div className="karaoke-container">
      <div className="karaoke-card">
        <div className="karaoke-header">
          <h2 className="karaoke-title">🎤 קריוקי מקצועי</h2>
          <p className="karaoke-subtitle">שירו עם השירים האהובים עליכם</p>
        </div>

        <div className="song-upload-section">
          <div className="upload-area">
            <label htmlFor="song-upload" className="upload-label">
              <div className="upload-icon">🎵</div>
              <div className="upload-text">{songBuffer ? `✅ ${songName}` : "בחרו שיר להעלאה"}</div>
              <input
                id="song-upload"
                type="file"
                accept="audio/*"
                onChange={handleSongUpload}
                disabled={recording || loadingSong}
                className="upload-input"
              />
            </label>
          </div>
          {loadingSong && <div className="loading-indicator">⏳ טוען שיר...</div>}
        </div>

        <div className="karaoke-controls">
          <button
            className={`karaoke-record-button ${recording ? "recording" : ""} ${!songBuffer ? "disabled" : ""}`}
            onClick={recording ? stopRecording : startRecording}
            disabled={!songBuffer || loadingSong}
          >
            {recording ? "⏹️ עצור הקלטה" : loadingSong ? "⏳ טוען..." : "🎤 התחל קריוקי"}
          </button>
        </div>

        {recording && (
          <div className="recording-status">
            <div className="recording-animation">🔴</div>
            <span>מקליט קריוקי...</span>
          </div>
        )}

        {audioURL && (
          <div className="karaoke-result">
            <h3 className="result-title">🎉 הקריוקי שלכם מוכן!</h3>
            <audio src={audioURL} controls className="karaoke-player" />
            <div className="result-actions">
              <button className="save-button">💾 שמור</button>
              <button className="share-button">📤 שתף</button>
              <button className="new-recording-button">🎤 הקלטה חדשה</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default KaraokeRecorder
