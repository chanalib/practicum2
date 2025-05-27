"use client"

import  React from "react"
import { useRef, useState, useEffect } from "react"
import "./audio-recorder.css"
const AudioRecorder: React.FC = () => {
  const canvas = useRef<HTMLCanvasElement | null>(null)
  const audioContext = useRef<AudioContext | null>(null)
  const analyser = useRef<AnalyserNode | null>(null)
  const dataArray = useRef<Uint8Array | null>(null)
  const source = useRef<MediaStreamAudioSourceNode | null>(null)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [recording, setRecording] = useState<boolean>(false)

  useEffect(() => {
    if (!audioContext.current) {
      audioContext.current = new AudioContext()
    }

    if (!analyser.current && audioContext.current) {
      analyser.current = audioContext.current.createAnalyser()
      analyser.current.fftSize = 2048
      const bufferLength = analyser.current.frequencyBinCount
      dataArray.current = new Uint8Array(bufferLength)
    }

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      setStream(stream)
      if (audioContext.current) {
        source.current = audioContext.current.createMediaStreamSource(stream)
        source.current.connect(analyser.current!)
      }
    })
  }, [])

  const draw = () => {
    if (!canvas.current || !analyser.current || !dataArray.current) return

    const canvasCtx = canvas.current.getContext("2d")
    if (!canvasCtx) return

    const WIDTH = canvas.current.width
    const HEIGHT = canvas.current.height

    analyser.current.getByteTimeDomainData(dataArray.current)

    // רקע כהה עם גרדיאנט
    const gradient = canvasCtx.createLinearGradient(0, 0, 0, HEIGHT)
    gradient.addColorStop(0, "#1a1a2e")
    gradient.addColorStop(1, "#16213e")
    canvasCtx.fillStyle = gradient
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT)

    canvasCtx.lineWidth = 3
    canvasCtx.strokeStyle = "#ec4899"

    canvasCtx.beginPath()

    const sliceWidth = (WIDTH * 1.0) / dataArray.current.length
    let x = 0

    for (let i = 0; i < dataArray.current.length; i++) {
      const v = dataArray.current[i] / 128.0
      const y = (v * HEIGHT) / 2

      if (i === 0) {
        canvasCtx.moveTo(x, y)
      } else {
        canvasCtx.lineTo(x, y)
      }
      x += sliceWidth
    }

    canvasCtx.lineTo(WIDTH, HEIGHT / 2)
    canvasCtx.stroke()

    requestAnimationFrame(draw)
  }

  const startRecording = () => {
    if (!stream) return

    mediaRecorder.current = new MediaRecorder(stream)
    mediaRecorder.current.ondataavailable = (event: BlobEvent) => {
      const url = URL.createObjectURL(event.data)
      setAudioURL(url)
    }
    mediaRecorder.current.start()
    setRecording(true)

    draw()
  }

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop()
    }
    setRecording(false)
  }

  return (
    <div className="audio-recorder-container">
      <div className="audio-recorder-card">
        <div className="recorder-header">
          <h2 className="recorder-title">🎤 מקליט אודיו מקצועי</h2>
          <p className="recorder-subtitle">הקליטו את הקול שלכם באיכות HD</p>
        </div>

        <div className="visualizer-container">
          <canvas ref={canvas} width={400} height={150} className="audio-visualizer" />
          <div className="visualizer-overlay">
            {recording && <div className="recording-indicator">🔴 מקליט...</div>}
          </div>
        </div>

        <div className="recorder-controls">
          <button
            className={`record-button ${recording ? "recording" : ""}`}
            onClick={recording ? stopRecording : startRecording}
          >
            {recording ? "⏹️ עצור הקלטה" : "🎤 התחל הקלטה"}
          </button>
        </div>

        {audioURL && (
          <div className="audio-player-container">
            <h3 className="player-title">🎵 ההקלטה שלכם</h3>
            <audio src={audioURL} controls className="audio-player" />
            <div className="audio-actions">
              <button className="download-button">📥 הורד קובץ</button>
              <button className="share-button">📤 שתף</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AudioRecorder
