"use client"

import { useEffect, useState } from "react"
import { MusicProgressBar } from "./music-progress-bar"

interface PasswordStrengthIndicatorProps {
  password: string
}

interface PasswordChecks {
  length: boolean
  uppercase: boolean
  lowercase: boolean
  number: boolean
  special: boolean
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const [strength, setStrength] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [checks, setChecks] = useState<PasswordChecks>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  })

  // Check password strength whenever password changes
  useEffect(() => {
    if (!password) {
      setStrength(0)
      setFeedback("")
      setChecks({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
      })
      return
    }

    // Check various password criteria
    const currentChecks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    }

    setChecks(currentChecks)

    // Calculate strength based on criteria met
    const metCriteria = Object.values(currentChecks).filter(Boolean).length
    const strengthPercentage = (metCriteria / 5) * 100
    setStrength(strengthPercentage)

    // Set feedback message
    if (strengthPercentage <= 20) {
      setFeedback("חלשה מאוד")
    } else if (strengthPercentage <= 40) {
      setFeedback("חלשה")
    } else if (strengthPercentage <= 60) {
      setFeedback("בינונית")
    } else if (strengthPercentage <= 80) {
      setFeedback("חזקה")
    } else {
      setFeedback("חזקה מאוד")
    }
  }, [password])

  // Function to get color based on strength
  const getStrengthColor = () => {
    if (strength <= 20) return "bg-red-500"
    if (strength <= 40) return "bg-orange-500"
    if (strength <= 60) return "bg-yellow-500"
    if (strength <= 80) return "bg-lime-500"
    return "bg-green-500"
  }

  if (!password) return null

  return (
    <div className="space-y-2 mt-1">
      <div className="flex items-center justify-between">
        <MusicProgressBar value={strength} className={getStrengthColor()} />
        <span className="text-sm mr-2 min-w-16 text-right">{feedback}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="flex items-center text-xs">
          {checks.length ? <CheckIcon className="text-green-500 ml-1" /> : <XIcon className="text-red-500 ml-1" />}
          <span className="text-gray-400">לפחות 8 תווים</span>
        </div>
        <div className="flex items-center text-xs">
          {checks.uppercase ? <CheckIcon className="text-green-500 ml-1" /> : <XIcon className="text-red-500 ml-1" />}
          <span className="text-gray-400">אות גדולה (A-Z)</span>
        </div>
        <div className="flex items-center text-xs">
          {checks.lowercase ? <CheckIcon className="text-green-500 ml-1" /> : <XIcon className="text-red-500 ml-1" />}
          <span className="text-gray-400">אות קטנה (a-z)</span>
        </div>
        <div className="flex items-center text-xs">
          {checks.number ? <CheckIcon className="text-green-500 ml-1" /> : <XIcon className="text-red-500 ml-1" />}
          <span className="text-gray-400">מספר (0-9)</span>
        </div>
        <div className="flex items-center text-xs">
          {checks.special ? <CheckIcon className="text-green-500 ml-1" /> : <XIcon className="text-red-500 ml-1" />}
          <span className="text-gray-400">תו מיוחד (!@#$%^&*)</span>
        </div>
      </div>
    </div>
  )
}

function CheckIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  )
}

function XIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="15" y1="9" x2="9" y2="15"></line>
      <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
  )
}
