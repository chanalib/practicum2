"use client"

import type React from "react"
import "./Styles/Messages.css"
import { useState, useRef } from "react"

interface FormData {
  senderName: string
  senderEmail: string
  content: string
  requestType: string
}

const RequestForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    senderName: "",
    senderEmail: "",
    content: "",
    requestType: "song",
  })

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([])
  const audioRef = useRef<HTMLAudioElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const requestTypes = [
    { value: "song", label: "🎵 בקשת שיר", icon: "🎵", color: "#ec4899" },
    { value: "artist", label: "🎤 בקשת זמר", icon: "🎤", color: "#8b5cf6" },
    { value: "genre", label: "🎼 בקשת ז'אנר", icon: "🎼", color: "#06b6d4" },
    { value: "feature", label: "⭐ בקשת תכונה", icon: "⭐", color: "#10b981" },
    { value: "other", label: "💌 אחר", icon: "💌", color: "#f59e0b" },
  ]

  const createParticles = () => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: getRandomColor(),
    }))
    setParticles(newParticles)
    setTimeout(() => setParticles([]), 3000)
  }

  const getRandomColor = () => {
    const colors = ["#ec4899", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock API call
      const response = await fetch("https://magical-music-server.onrender.com/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setStatus("success")
        createParticles()
        setFormData({ senderName: "", senderEmail: "", content: "", requestType: "song" })

        // Play success sound
        if (audioRef.current) {
          audioRef.current.play()
        }

        // Reset status after animation
        setTimeout(() => setStatus("idle"), 4000)
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      setStatus("error")
      setTimeout(() => setStatus("idle"), 3000)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="request-page">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="floating-notes">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="floating-note"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            >
              {["🎵", "🎶", "🎼", "🎤", "🎧"][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
        <div className="gradient-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="request-container">
        {/* Header */}
        <div className="request-header">
          <h1 className="request-title">
            <span className="title-icon">🎯</span>
            <span className="gradient-text">בקשות מוזיקליות</span>
            <span className="title-icon">🎯</span>
          </h1>
          <p className="request-subtitle">יש לכם בקשה מיוחדת? אנחנו כאן להגשים את החלומות המוזיקליים שלכם!</p>
          <div className="subtitle-decoration">
            <span className="decoration-line"></span>
            <span className="decoration-icon">✨</span>
            <span className="decoration-line"></span>
          </div>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className={`request-form ${status}`}>
          {/* Request Type Selection */}
          <div className="request-type-section">
            <h3 className="section-title">🎭 סוג הבקשה</h3>
            <div className="request-types">
              {requestTypes.map((type) => (
                <label
                  key={type.value}
                  className={`request-type-card ${formData.requestType === type.value ? "selected" : ""}`}
                  style={{ "--accent-color": type.color } as React.CSSProperties}
                >
                  <input
                    type="radio"
                    name="requestType"
                    value={type.value}
                    checked={formData.requestType === type.value}
                    onChange={handleInputChange}
                    className="request-type-input"
                  />
                  <div className="request-type-icon">{type.icon}</div>
                  <span className="request-type-label">{type.label}</span>
                  <div className="selection-indicator"></div>
                </label>
              ))}
            </div>
          </div>

          {/* Personal Info */}
          <div className="personal-info-section">
            <h3 className="section-title">👤 פרטים אישיים</h3>
            <div className="form-row">
              <div className="input-group">
                <div className="input-icon">👤</div>
                <input
                  type="text"
                  name="senderName"
                  value={formData.senderName}
                  onChange={handleInputChange}
                  placeholder="השם שלכם"
                  required
                  className="form-input"
                />
                <div className="input-border"></div>
              </div>
              <div className="input-group">
                <div className="input-icon">📧</div>
                <input
                  type="email"
                  name="senderEmail"
                  value={formData.senderEmail}
                  onChange={handleInputChange}
                  placeholder="האימייל שלכם"
                  required
                  className="form-input"
                />
                <div className="input-border"></div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="message-section">
            <h3 className="section-title">💭 הבקשה שלכם</h3>
            <div className="textarea-group">
              <div className="textarea-icon">✍️</div>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="ספרו לנו על הבקשה שלכם... איזה שיר? איזה זמר? מה הסיפור מאחורי הבקשה?"
                required
                className="form-textarea"
                rows={6}
              />
              <div className="textarea-border"></div>
              <div className="character-count">{formData.content.length}/500</div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="submit-section">
            <button type="submit" disabled={status === "loading"} className="submit-button">
              <span className="button-content">
                {status === "loading" ? (
                  <>
                    <div className="loading-spinner"></div>
                    <span>שולח בקשה...</span>
                  </>
                ) : (
                  <>
                    <span className="button-icon">🚀</span>
                    <span>שלח בקשה</span>
                    <span className="button-icon">🚀</span>
                  </>
                )}
              </span>
              <div className="button-glow"></div>
            </button>
          </div>

          {/* Status Messages */}
          {status === "success" && (
            <div className="status-message success">
              <div className="status-icon">🎉</div>
              <div className="status-content">
                <h4>הבקשה נשלחה בהצלחה!</h4>
                <p>נחזור אליכם בהקדם עם עדכונים</p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="status-message error">
              <div className="status-icon">❌</div>
              <div className="status-content">
                <h4>אופס! משהו השתבש</h4>
                <p>אנא נסו שוב מאוחר יותר</p>
              </div>
            </div>
          )}
        </form>

        {/* Success Particles */}
        {particles.length > 0 && (
          <div className="particles-container">
            {particles.map((particle) => (
              <div
                key={particle.id}
                className="success-particle"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  backgroundColor: particle.color,
                }}
              />
            ))}
          </div>
        )}

        {/* Popular Requests */}
        <div className="popular-requests">
          <h3 className="section-title">🔥 בקשות פופולריות</h3>
          <div className="popular-tags">
            {[
              "שירי נוסטלגיה",
              "מוזיקה ישראלית",
              "שירי אהבה",
              "מוזיקת רקע",
              "שירי ילדות",
              "רוק ישראלי",
              "מוזיקה מזרחית",
              "שירי זמר",
            ].map((tag, index) => (
              <div
                key={index}
                className="popular-tag"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setFormData((prev) => ({ ...prev, content: `בקשה ל${tag}: ` }))}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hidden Audio */}
      <audio ref={audioRef} preload="auto">
        <source src="/sounds/success.mp3" type="audio/mpeg" />
      </audio>
    </div>
  )
}

export default RequestForm
