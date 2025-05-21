"use client"

import type React from "react"

import { useState } from "react"
import { MusicCard } from "./music-card"
import { MusicInput } from "./music-input"
import { MusicButton } from "./music-button"
import { PasswordStrengthIndicator } from "./password-strength-indicator"

interface RegisterFormProps {
  onRegister: (name: string, email: string, password: string) => void
  onLoginClick: () => void
}

export function RegisterForm({ onRegister, onLoginClick }: RegisterFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simple validation
    if (!name || !email || !password) {
      setError("יש למלא את כל השדות")
      return
    }

    if (password !== confirmPassword) {
      setError("הסיסמאות אינן תואמות")
      return
    }

    onRegister(name, email, password)
  }

  return (
    <MusicCard>
      <div className="text-center border-b border-gray-800 pb-6">
        <h2 className="text-xl text-white">הרשמה</h2>
        <p className="text-gray-400 text-sm mt-1">צור חשבון חדש כדי להתחיל את המסע המוזיקלי שלך</p>
      </div>

      <div className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-300 block text-right">
              שם
            </label>
            <MusicInput
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="השם שלך"
              dir="rtl"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-300 block text-right">
              דואר אלקטרוני
            </label>
            <MusicInput
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              dir="rtl"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-300 block text-right">
              סיסמה
            </label>
            <MusicInput
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              dir="rtl"
            />
          </div>

          <PasswordStrengthIndicator password={password} />

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300 block text-right">
              אימות סיסמה
            </label>
            <MusicInput
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              dir="rtl"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <MusicButton type="submit" fullWidth>
            הרשמה
          </MusicButton>

          <div className="text-center mt-4">
            <p className="text-gray-400 text-sm">
              כבר יש לך חשבון?{" "}
              <span
                className="text-purple-400 font-medium cursor-pointer hover:text-pink-400 transition-colors"
                onClick={onLoginClick}
              >
                התחבר כאן
              </span>
            </p>
          </div>
        </form>
      </div>
    </MusicCard>
  )
}
