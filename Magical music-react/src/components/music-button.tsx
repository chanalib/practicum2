import type React from "react"
interface MusicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline"
  fullWidth?: boolean
}

export function MusicButton({
  children,
  className = "",
  variant = "primary",
  fullWidth = false,
  ...props
}: MusicButtonProps) {
  const baseClasses = "px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none"

  const variantClasses = {
    primary: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white",
    secondary: "bg-gray-800 hover:bg-gray-700 text-white",
    outline: "bg-transparent border border-gray-600 hover:border-purple-500 text-gray-300 hover:text-white",
  }

  const widthClass = fullWidth ? "w-full" : ""

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`} {...props}>
      {children}
    </button>
  )
}
