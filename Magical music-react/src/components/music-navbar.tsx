"use client"

import { MusicButton } from "./music-button"


interface MusicNavbarProps {
  onLogout: () => void
}

export function MusicNavbar({ onLogout }: MusicNavbarProps) {
  return (
    <nav className="relative z-10 border-b border-gray-800 bg-black/60 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <MusicNoteIcon className="h-6 w-6 text-purple-500 mr-2" />
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
            Magical Music
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <MusicButton variant="outline"  className="text-gray-300 hover:text-white">
            <HomeIcon className="h-5 w-5 ml-1" />
            <span>בית</span>
          </MusicButton>
          <MusicButton variant="outline"  className="text-gray-300 hover:text-white">
            <UserIcon className="h-5 w-5 ml-1" />
            <span>פרופיל</span>
          </MusicButton>
          <MusicButton variant="outline"  className="text-gray-300 hover:text-white" onClick={onLogout}>
            <LogoutIcon className="h-5 w-5 ml-1" />
            <span>יציאה</span>
          </MusicButton>
        </div>
      </div>
    </nav>
  )
}

function MusicNoteIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 18V5l12-2v13"></path>
      <circle cx="6" cy="18" r="3"></circle>
      <circle cx="18" cy="16" r="3"></circle>
    </svg>
  )
}

function HomeIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  )
}

function UserIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  )
}

function LogoutIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  )
}
