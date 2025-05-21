export function MusicLogo() {
    return (
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center">
          <MusicNoteIcon className="h-8 w-8 mr-2 text-purple-500" />
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
            Magical Music
          </span>
          <MusicNoteIcon className="h-8 w-8 ml-2 text-purple-500" />
        </h1>
        <p className="text-gray-400">חווית מוזיקה יוקרתית</p>
      </div>
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
  