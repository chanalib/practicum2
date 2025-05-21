interface MusicProgressBarProps {
    value: number
    className?: string
  }
  
  export function MusicProgressBar({ value, className = "" }: MusicProgressBarProps) {
    return (
      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-300 ${className}`} style={{ width: `${value}%` }} />
      </div>
    )
  }
  