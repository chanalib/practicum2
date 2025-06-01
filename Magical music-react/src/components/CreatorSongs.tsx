// "use client"
// import "./AllSongs.css"

// import { useEffect, useRef, useState } from "react"
// import { useParams } from "react-router-dom"
// import SongPlayerList from "./MusicPlayer"
// import type { Song } from "./MusicPlayer"

// const CreatorSongs = () => {
//   const { id } = useParams<{ id: string }>()
//   const [songs, setSongs] = useState<Song[]>([])
//   const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null)
//   const [isPlaying, setIsPlaying] = useState(false)
//   const [currentTime, setCurrentTime] = useState(0)
//   const [duration, setDuration] = useState(0)
//   const [playbackRate, setPlaybackRate] = useState(1)
//   const [volume, setVolume] = useState(1)
//   const [isLoading, setIsLoading] = useState(true)
//   const [songError, setSongError] = useState<string | null>(null)
//   const audioRef = useRef<HTMLAudioElement | null>(null)

//   useEffect(() => {
//     const fetchSongs = async () => {
//       try {
//         const response = await fetch(`https://localhost:7157/api/song/creator/${id}`)
//         const data = await response.json()
//         setSongs(data)
//       } catch (error) {
//         console.error("שגיאה בטעינת שירים של הזמר", error)
//         setSongError("אירעה שגיאה בטעינת השירים.")
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchSongs()
//   }, [id])

//   useEffect(() => {
//     if (audioRef.current) {
//       audioRef.current.playbackRate = playbackRate
//       audioRef.current.volume = volume
//     }
//   }, [playbackRate, volume])

//   useEffect(() => {
//     const audio = audioRef.current
//     if (!audio) return

//     const updateTime = () => {
//       setCurrentTime(audio.currentTime)
//       setDuration(audio.duration)
//     }

//     audio.addEventListener("timeupdate", updateTime)
//     return () => {
//       audio.removeEventListener("timeupdate", updateTime)
//     }
//   }, [])

//   useEffect(() => {
//     if (currentSongIndex !== null && audioRef.current) {
//       audioRef.current.src = songs[currentSongIndex].S3Url
//       audioRef.current.load()
//       if (isPlaying) {
//         audioRef.current.play().catch((e) => {
//           console.error("שגיאה בהפעלת השיר:", e)
//           setSongError("לא ניתן להפעיל את השיר.")
//         })
//       }
//     }
//   }, [currentSongIndex])

//   const togglePlayPause = () => {
//     if (!audioRef.current) return
//     if (isPlaying) {
//       audioRef.current.pause()
//       setIsPlaying(false)
//     } else {
//       audioRef.current.play().catch((e) => {
//         console.error("שגיאה בהפעלת השיר:", e)
//         setSongError("לא ניתן להפעיל את השיר.")
//       })
//       setIsPlaying(true)
//     }
//   }

//   const playNextSong = () => {
//     if (currentSongIndex !== null) {
//       const nextIndex = (currentSongIndex + 1) % songs.length
//       setCurrentSongIndex(nextIndex)
//     }
//   }

//   const formatTime = (time: number) => {
//     const minutes = Math.floor(time / 60)
//     const seconds = Math.floor(time % 60).toString().padStart(2, "0")
//     return `${minutes}:${seconds}`
//   }

//   const downloadSong = (song: Song) => {
//     const a = document.createElement("a")
//     a.href = song.S3Url
//     a.download = song.name
//     a.click()
//   }

//   return (
//     <div className="songs-page">
//       <audio ref={audioRef} onEnded={playNextSong} />
//       <SongPlayerList
//         songs={songs}
//         currentSongIndex={currentSongIndex}
//         isPlaying={isPlaying}
//         currentTime={currentTime}
//         duration={duration}
//         playbackRate={playbackRate}
//         volume={volume}
//         isLoading={isLoading}
//         songError={songError}
//         onTogglePlayPause={togglePlayPause}
//         onPlayNext={playNextSong}
//         onSetSongIndex={setCurrentSongIndex}
//         onSetVolume={setVolume}
//         onSetPlaybackRate={setPlaybackRate}
//         formatTime={formatTime}
//         onDownload={downloadSong}
//       />
//     </div>
//   )
// }

// export default CreatorSongs
"use client"

import type React from "react"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import SongsDisplay from "./SongsDisplay"

interface Creator {
  id: number
  name: string
}

const CreatorSongs: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [creator, setCreator] = useState<Creator | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const response = await fetch(`https://localhost:7157/api/creator/${id}`)
        if (response.ok) {
          const data = await response.json()
          setCreator(data)
        }
      } catch (error) {
        console.error("Error fetching creator:", error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCreator()
    }
  }, [id])

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "3rem", color: "#d1d5db", marginTop: "120px" }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
        <p>טוען פרטי זמר...</p>
      </div>
    )
  }

  return (
    <SongsDisplay
      title={`🎤 שירי ${creator?.name || "הזמר"}`}
      subtitle={`כל השירים של ${creator?.name || "הזמר הנבחר"}`}
      apiEndpoint={`https://localhost:7157/api/song/creator/${id}`}
    />
  )
}

export default CreatorSongs
