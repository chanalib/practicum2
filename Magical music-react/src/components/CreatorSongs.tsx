"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

interface Song {
  id: number
  title: string
  audioUrl: string
  duration: number
}

const CreatorSongs = () => {
  const { id } = useParams<{ id: string }>()
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch(`https://localhost:7157/api/song/creator/${id}`)
        const data = await response.json()
        setSongs(data)
      } catch (error) {
        console.error("שגיאה בטעינת שירים של הזמר", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSongs()
  }, [id])

  if (loading) return <p>טוען שירים...</p>

  return (
    <div className="songs-page">
      <h2>שירים של הזמר</h2>
      {songs.length === 0 ? (
        <p>אין שירים לזמר זה</p>
      ) : (
        <ul>
          {songs.map(song => (
            <li key={song.id}>
              <p>{song.title}</p>
              <audio controls src={song.audioUrl}></audio>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CreatorSongs
