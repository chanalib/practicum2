import type React from "react"
interface MusicCardProps {
  children: React.ReactNode
  className?: string
}

export function MusicCard({ children, className = "" }: MusicCardProps) {
  return (
    <div
      className={`border-0 bg-black/60 backdrop-blur-md border-gray-800 shadow-xl shadow-purple-900/20 rounded-lg overflow-hidden ${className}`}
    >
      <div className="p-6">{children}</div>
    </div>
  )
}
