import type React from "react"
interface MusicInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function MusicInput({ className = "", ...props }: MusicInputProps) {
  return (
    <input
      className={`w-full px-3 py-2 bg-black/50 border border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 rounded-md transition-colors ${className}`}
      {...props}
    />
  )
}
